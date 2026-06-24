"use strict";
// ============================================================================
// Train Labs — Workspace Engine
// Palette rendering, block drag-and-drop, block stacking, workspace state
// ============================================================================

window.NB = window.NB || {};

NB.WORKSPACE = (() => {
  // ── State ─────────────────────────────────────────────────────────────────
  let blocks = []; // array of block instances
  let selectedCat = "data";
  let searchQuery = "";
  let scale = 1;
  let canvasOffset = { x: 0, y: 0 };
  let isDragging = false;
  let dragBlock = null; // { instance, startX, startY, offsetX, offsetY, isNew }
  let snapTarget = null; // block instance to snap to
  let blockCount = 0;

  const SNAP_DIST = 36;

  // ── ID Generation ─────────────────────────────────────────────────────────
  function genId() {
    return `b_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }

  // ── Block Instance ─────────────────────────────────────────────────────────
  function createInstance(defId, x, y) {
    const def = NB.getBlockDef(defId);
    if (!def) return null;
    const inputs = {};
    def.label.forEach((item) => {
      if (typeof item === "object" && item.name)
        inputs[item.name] = item.default ?? "";
    });
    return {
      id: genId(),
      defId,
      inputs,
      x,
      y,
      parentId: null,
      childId: null,
      body: null,
    };
  }

  // ── Stack Navigation ───────────────────────────────────────────────────────
  function getRoot(instance) {
    let cur = instance;
    while (cur.parentId) cur = blocks.find((b) => b.id === cur.parentId) || cur;
    return cur;
  }

  function getStack(root) {
    const stack = [];
    let cur = root;
    while (cur) {
      stack.push(cur);
      cur = cur.childId ? blocks.find((b) => b.id === cur.childId) : null;
    }
    return stack;
  }

  function detachBlock(instance) {
    if (instance.parentId) {
      const parent = blocks.find((b) => b.id === instance.parentId);
      if (parent) parent.childId = null;
      instance.parentId = null;
    }
  }

  function attachBlock(child, parent) {
    // Detach any existing child of parent
    if (parent.childId) {
      const existingChild = blocks.find((b) => b.id === parent.childId);
      if (existingChild) existingChild.parentId = null;
    }
    parent.childId = child.id;
    child.parentId = parent.id;
  }

  function getBlockHeight(instance) {
    const el = document.querySelector(`[data-block-id="${instance.id}"]`);
    return el ? el.offsetHeight : 46;
  }

  // ── Serialize for Executor ────────────────────────────────────────────────
  function getStacks() {
    const roots = blocks.filter((b) => !b.parentId);
    return roots.map((root) => getStack(root));
  }

  // ── Palette Rendering ─────────────────────────────────────────────────────
  function renderPalette() {
    renderCategoryTabs();
    renderBlockList();
  }

  function renderCategoryTabs() {
    const container = document.getElementById("category-tabs");
    if (!container) return;
    container.innerHTML = NB.CATEGORIES.map(
      (cat) => `
      <button class="cat-tab ${cat.id === selectedCat ? "active" : ""}" data-cat="${cat.id}"
        style="--cat-color:${cat.color};" title="${cat.desc}">
        <span class="cat-tab-icon">${cat.icon}</span>
        <span class="cat-tab-name">${cat.name}</span>
      </button>
    `,
    ).join("");

    container.querySelectorAll(".cat-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedCat = btn.dataset.cat;
        renderPalette();
      });
    });
  }

  function renderBlockList() {
    const container = document.getElementById("block-list");
    if (!container) return;

    const catDef = NB.getCategoryDef(selectedCat);
    const filtered = NB.BLOCKS.filter((b) => {
      if (b.category !== selectedCat) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const labelStr = b.label
          .map((l) =>
            typeof l === "string"
              ? l
              : l.options
                ? l.options.join(" ")
                : l.name || "",
          )
          .join(" ")
          .toLowerCase();
        return labelStr.includes(q) || b.tooltip.toLowerCase().includes(q);
      }
      return true;
    });

    container.innerHTML = `
      <div class="cat-header" style="--cat-color:${catDef?.color}">
        <span class="cat-header-icon">${catDef?.icon}</span>
        <span class="cat-header-name">${catDef?.name}</span>
      </div>
      <div class="palette-blocks">
        ${filtered.map((block) => renderPaletteBlock(block, catDef?.color)).join("")}
      </div>
    `;

    // Attach click handlers
    container.querySelectorAll(".palette-block").forEach((el) => {
      el.addEventListener("click", () =>
        addBlockToWorkspace(el.dataset.blockId),
      );

      // Tooltip on hover
      el.addEventListener("mouseenter", (e) => {
        const def = NB.getBlockDef(el.dataset.blockId);
        showTooltip(e, def?.tooltip || "");
      });
      el.addEventListener("mouseleave", hideTooltip);
    });
  }

  function renderPaletteBlock(block, color) {
    const labelHtml = renderLabelHtml(block.label, {}, true);
    const catDef = NB.getCategoryDef(block.category);
    // Extract a short description from the tooltip (first sentence, max 60 chars)
    const shortDesc = block.tooltip
      ? block.tooltip
          .replace(/^[^a-zA-Z0-9(]*/, "")
          .split(/[.!?]/)[0]
          .slice(0, 65)
      : "";
    return `
      <div class="palette-block block-shape-${block.shape}" data-block-id="${block.id}"
        style="--block-color:${color || catDef?.color};--block-dark:${catDef?.dark};">
        <div class="block-inner ${block.shape === "hat" ? "hat-shape" : block.shape === "reporter" ? "reporter-shape" : block.shape === "cap" ? "cap-shape" : ""}">
          ${labelHtml}
        </div>
        ${shortDesc ? `<div class="block-desc">${shortDesc}</div>` : ""}
      </div>
    `;
  }

  function renderLabelHtml(label, inputs, isReadonly) {
    return label
      .map((item) => {
        if (typeof item === "string") {
          return `<span class="block-label-text">${item}</span>`;
        }
        const val = inputs[item.name] ?? item.default ?? "";
        if (item.type === "dropdown") {
          if (isReadonly)
            return `<span class="block-input-pill">${val || item.options[0]}</span>`;
          return `<select class="block-select" data-input="${item.name}" onclick="event.stopPropagation()">
          ${item.options.map((o) => `<option value="${o}" ${String(val) === String(o) ? "selected" : ""}>${o}</option>`).join("")}
        </select>`;
        }
        if (item.type === "number") {
          if (isReadonly)
            return `<span class="block-input-pill number-pill">${val}</span>`;
          return `<input class="block-num-input" type="number" data-input="${item.name}"
          value="${val}" min="${item.min ?? ""}" max="${item.max ?? ""}" step="${item.step ?? 1}"
          onclick="event.stopPropagation()" style="width:${Math.max(40, String(val).length * 10 + 24)}px">`;
        }
        if (item.type === "text") {
          if (isReadonly)
            return `<span class="block-input-pill text-pill" style="max-width:${item.width || 80}px">${String(val).slice(0, 20)}</span>`;
          return `<input class="block-text-input" type="text" data-input="${item.name}"
          value="${val}" onclick="event.stopPropagation()"
          style="width:${item.width || 80}px">`;
        }
        return "";
      })
      .join("");
  }

  // ── Workspace Block Rendering ─────────────────────────────────────────────
  function renderWorkspaceBlock(instance) {
    const def = NB.getBlockDef(instance.defId);
    if (!def) return null;
    const catDef = NB.getCategoryDef(def.category);

    const el = document.createElement("div");
    el.className = `workspace-block block-shape-${def.shape}`;
    el.dataset.blockId = instance.id;
    el.style.cssText = `left:${instance.x}px;top:${instance.y}px;--block-color:${catDef?.color};--block-dark:${catDef?.dark};`;

    const shapeClass =
      def.shape === "hat"
        ? "hat-shape"
        : def.shape === "reporter"
          ? "reporter-shape"
          : def.shape === "cap"
            ? "cap-shape"
            : "";

    el.innerHTML = `
      <div class="block-inner ${shapeClass}">
        ${renderLabelHtml(def.label, instance.inputs, false)}
        <button class="block-delete-btn" title="Delete block" data-block-id="${instance.id}">×</button>
      </div>
      ${def.shape === "c-block" ? '<div class="block-mouth"><div class="block-mouth-inner"></div></div>' : ""}
      <div class="block-connector-bottom"></div>
    `;

    // Wire up input changes
    el.querySelectorAll("[data-input]").forEach((inp) => {
      inp.addEventListener("change", () => {
        instance.inputs[inp.dataset.input] = inp.value;
        updateBlockCount();
      });
      inp.addEventListener("input", () => {
        instance.inputs[inp.dataset.input] = inp.value;
      });
    });

    // Special: when load_dataset dropdown changes to Custom CSV, open Kaggle search modal
    if (instance.defId === "load_dataset") {
      const sel = el.querySelector('select.block-select[data-input="dataset"]');
      if (sel) {
        sel.addEventListener("change", (e) => {
          const v = e.target.value;
          instance.inputs["dataset"] = v;
          if (v === "Custom CSV") {
            // open Kaggle search modal
            toggleModal("kaggle-search-modal", true);
          }
        });
      }
    }

    // Delete button
    el.querySelector(".block-delete-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteBlock(instance.id);
    });

    return el;
  }

  function positionStack(root) {
    let cur = root;
    let y = root.y;
    while (cur) {
      const el = document.querySelector(`[data-block-id="${cur.id}"]`);
      if (el) {
        el.style.left = `${root.x}px`;
        el.style.top = `${y}px`;
        cur.x = root.x;
        cur.y = y;
        y += el.offsetHeight + 2; // 2px seamless gap
      }
      cur = cur.childId ? blocks.find((b) => b.id === cur.childId) : null;
    }
  }

  function addBlockToWorkspace(defId, x, y) {
    const canvas = document.getElementById("workspace-inner");
    if (!canvas) return;

    // Remove hint
    const hint = canvas.querySelector(".workspace-hint");
    if (hint) hint.style.display = "none";

    const spawnX = x ?? 80 + (blockCount % 4) * 30;
    const spawnY =
      y ?? 80 + Math.floor(blocks.filter((b) => !b.parentId).length / 1) * 60;

    const instance = createInstance(defId, spawnX, spawnY);
    if (!instance) return;
    blocks.push(instance);

    const el = renderWorkspaceBlock(instance);
    if (!el) return;
    canvas.appendChild(el);
    blockCount++;
    updateBlockCount();

    // Animate in
    el.style.opacity = "0";
    el.style.transform = "scale(0.8)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.2s, transform 0.2s";
      el.style.opacity = "1";
      el.style.transform = "scale(1)";
      setTimeout(() => (el.style.transition = ""), 200);
    });

    attachDragHandlers(el, instance);
    NB.GAMIFICATION.awardXP(1, "Added block");
    return instance;
  }

  // ── Drag and Drop ─────────────────────────────────────────────────────────
  function attachDragHandlers(el, instance) {
    el.addEventListener("mousedown", (e) => {
      if (e.target.closest("input, select, button")) return;
      e.preventDefault();

      const canvas = document.getElementById("workspace-inner");
      const canvasRect = canvas.getBoundingClientRect();

      // Detach from parent stack
      detachBlock(instance);
      // Re-render parent connections
      updateStackVisuals();

      // Get current el position
      const elRect = el.getBoundingClientRect();
      const offsetX = e.clientX - elRect.left;
      const offsetY = e.clientY - elRect.top;

      dragBlock = { instance, offsetX, offsetY };
      isDragging = true;
      el.classList.add("dragging");
      el.style.zIndex = "1000";

      // Move all children with it
      const stack = getStack(instance);
      stack.forEach((b) => {
        const bEl = document.querySelector(`[data-block-id="${b.id}"]`);
        if (bEl) {
          bEl.classList.add("dragging");
          bEl.style.zIndex = "1000";
        }
      });
    });
  }

  function onMouseMove(e) {
    if (!isDragging || !dragBlock) return;

    const canvas = document.getElementById("workspace-inner");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const x = (e.clientX - rect.left - dragBlock.offsetX) / scale;
    const y = (e.clientY - rect.top - dragBlock.offsetY) / scale;

    dragBlock.instance.x = x;
    dragBlock.instance.y = y;

    // Position the whole stack being dragged
    const stack = getStack(dragBlock.instance);
    let stackY = y;
    stack.forEach((b) => {
      const bEl = document.querySelector(`[data-block-id="${b.id}"]`);
      if (bEl) {
        bEl.style.left = `${x}px`;
        bEl.style.top = `${stackY}px`;
        b.x = x;
        b.y = stackY;
        stackY += bEl.offsetHeight + 2;
      }
    });

    // Snap detection
    const prevSnap = snapTarget;
    snapTarget = null;

    const def = NB.getBlockDef(dragBlock.instance.defId);
    if (def.shape !== "hat") {
      // don't snap hat blocks
      for (const b of blocks) {
        if (stack.includes(b)) continue;
        const bEl = document.querySelector(`[data-block-id="${b.id}"]`);
        if (!bEl) continue;

        const bDef = NB.getBlockDef(b.defId);
        if (bDef.shape === "cap" || bDef.shape === "reporter") continue;
        if (b.childId) continue; // already has child

        const bBottom = b.y + bEl.offsetHeight;
        const dist = Math.hypot(x - b.x, y - bBottom);

        if (dist < SNAP_DIST) {
          snapTarget = b;
          break;
        }
      }
    }

    // Update snap visual
    if (snapTarget !== prevSnap) {
      if (prevSnap) {
        const pEl = document.querySelector(`[data-block-id="${prevSnap.id}"]`);
        if (pEl) pEl.classList.remove("snap-highlight");
      }
      if (snapTarget) {
        const sEl = document.querySelector(
          `[data-block-id="${snapTarget.id}"]`,
        );
        if (sEl) sEl.classList.add("snap-highlight");
      }
    }
  }

  function onMouseUp(e) {
    if (!isDragging || !dragBlock) return;
    isDragging = false;

    const instance = dragBlock.instance;
    const canvas = document.getElementById("workspace-inner");
    const rect = canvas?.getBoundingClientRect();

    // Remove dragging styles
    const stack = getStack(instance);
    stack.forEach((b) => {
      const bEl = document.querySelector(`[data-block-id="${b.id}"]`);
      if (bEl) {
        bEl.classList.remove("dragging");
        bEl.style.zIndex = "";
      }
    });

    // Clear snap highlight
    if (snapTarget) {
      const sEl = document.querySelector(`[data-block-id="${snapTarget.id}"]`);
      if (sEl) sEl.classList.remove("snap-highlight");
    }

    // Snap to target?
    if (snapTarget) {
      attachBlock(instance, snapTarget);
      positionStack(getRoot(snapTarget));
      snapTarget = null;
    }

    // Drop onto trash?
    const trashBtn = document.getElementById("clear-workspace-btn");
    if (trashBtn) {
      const trashRect = trashBtn.getBoundingClientRect();
      if (
        e.clientX >= trashRect.left &&
        e.clientX <= trashRect.right &&
        e.clientY >= trashRect.top &&
        e.clientY <= trashRect.bottom
      ) {
        deleteBlock(instance.id);
        dragBlock = null;
        return;
      }
    }

    // Drop outside canvas?
    if (
      rect &&
      (e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom)
    ) {
      deleteBlock(instance.id);
      dragBlock = null;
      return;
    }

    updateStackVisuals();
    dragBlock = null;
  }

  // ── Kaggle search modal handlers ───────────────────────────────────────
  function toggleModal(id, show) {
    const modal = document.getElementById(id);
    if (!modal) return;
    if (show) modal.classList.remove("hidden");
    else modal.classList.add("hidden");
  }

  // attach modal close buttons globally (simple)
  document
    .querySelectorAll("#kaggle-search-modal .modal-close")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        toggleModal("kaggle-search-modal", false),
      ),
    );

  const kaggleSearchBtn = document.getElementById("kaggle-search-btn");
  const kaggleSearchInput = document.getElementById("kaggle-search-input");
  const kaggleResults = document.getElementById("kaggle-search-results");
  const kagglePreview = document.getElementById("kaggle-search-preview");

  function getKaggleApiBase() {
    const override = String(window.NB_API_BASE || "").trim();
    if (override) return override.replace(/\/+$/, "");

    const { protocol, hostname } = window.location;
    if (
      protocol === "file:" ||
      hostname === "localhost" ||
      hostname === "127.0.0.1"
    ) {
      return "http://127.0.0.1:8000/api/v1";
    }

    return "/api/v1";
  }

  function buildKaggleApiUrl(path) {
    return `${getKaggleApiBase()}${path}`;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  async function fetchKaggleJson(path) {
    const res = await fetch(buildKaggleApiUrl(path));
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res.json();
  }

  function normalizePreviewRows(rows, columns) {
    return (Array.isArray(rows) ? rows : []).map((row) => {
      if (Array.isArray(row)) return row;
      if (row && typeof row === "object") {
        return (columns || []).map((col) => row[col]);
      }
      return [row];
    });
  }

  async function performKaggleSearch() {
    const q = kaggleSearchInput.value.trim();
    if (!q) return;
    kaggleResults.innerHTML = "Searching...";
    kagglePreview.innerHTML = "";
    try {
      const body = await fetchKaggleJson(
        `/datasets/search?q=${encodeURIComponent(q)}`,
      );
      const items = body.datasets || [];
      if (!items.length)
        kaggleResults.innerHTML = '<div class="muted">No results</div>';
      else {
        kaggleResults.innerHTML = items
          .map(
            (it) =>
              `<div class="kaggle-item" data-ref="${escapeHtml(it.ref)}" style="padding:8px;border-bottom:1px solid #eee;cursor:pointer;"><strong>${escapeHtml(it.title || it.ref)}</strong><div style="font-size:0.85rem;color:#666">${escapeHtml(it.ref)} · downloads: ${escapeHtml(it.downloadCount ?? "—")}</div></div>`,
          )
          .join("");
        kaggleResults.querySelectorAll(".kaggle-item").forEach((el) =>
          el.addEventListener("click", async () => {
            const ref = el.dataset.ref;
            // fetch a small preview from the API and store it under a temp key
            kagglePreview.innerHTML = "Loading preview...";
            try {
              const pb = await fetchKaggleJson(
                `/datasets/${encodeURIComponent(ref)}/preview?lines=20`,
              );
              // show a small table
              const cols =
                pb.columns ||
                (pb.preview && pb.preview[0] && Array.isArray(pb.preview[0])
                  ? pb.preview[0].map((_, i) => `C${i}`)
                  : []);
              const rows = normalizePreviewRows(pb.preview, cols);
              const selectedFile = pb.file || "";
              const previewTable = rows.length
                ? `<div style="max-height:160px;overflow:auto;border:1px solid #eee;padding:6px;background:bg"><table style="width:100%;border-collapse:collapse"><thead><tr>${(cols || []).map((c) => `<th style="text-align:left;padding:4px;border-bottom:1px solid #ddd">${escapeHtml(c)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td style="padding:4px;border-bottom:1px solid #f5f5f5">${escapeHtml(String(c).slice(0, 50))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
                : '<div class="muted">No preview rows available for this file.</div>';
              const fileSummary = selectedFile
                ? `<div class="muted" style="margin:8px 0 0 0;">Selected file: ${escapeHtml(selectedFile)}</div>`
                : '<div class="muted" style="margin:8px 0 0 0;">No readable file was detected for this dataset.</div>';
              kagglePreview.innerHTML = `${previewTable}${fileSummary}<div style="margin-top:8px;"><button id="kaggle-select-btn" class="modal-btn" ${selectedFile ? "" : "disabled"}>Load this dataset</button></div>`;
              document
                .getElementById("kaggle-select-btn")
                ?.addEventListener("click", async () => {
                  kagglePreview.innerHTML =
                    '<div class="muted">Loading the full dataset...</div>';
                  try {
                    const datasetBody = await fetchKaggleJson(
                      `/datasets/${encodeURIComponent(ref)}?file=${encodeURIComponent(selectedFile)}`,
                    );
                    window.NB_CUSTOM_DATASET = {
                      ...(datasetBody.dataset || {}),
                      ref,
                      file: selectedFile,
                    };
                    toggleModal("kaggle-search-modal", false);
                    // Also update any open load_dataset block inputs to select 'Custom CSV'
                    document
                      .querySelectorAll('.block-select[data-input="dataset"]')
                      .forEach((s) => {
                        if (s) s.value = "Custom CSV";
                        s.dispatchEvent(new Event("change"));
                      });
                    kagglePreview.innerHTML =
                      '<div class="muted">Dataset ready to load. Use the load dataset block to load it.</div>';
                  } catch (err) {
                    kagglePreview.innerHTML = `<div class="error">Dataset load failed: ${escapeHtml(err.message)}</div>`;
                  }
                });
            } catch (err) {
              kagglePreview.innerHTML = `<div class="error">Preview failed: ${escapeHtml(err.message)}</div>`;
            }
          }),
        );
      }
    } catch (err) {
      kaggleResults.innerHTML = `<div class="error">Search failed: ${escapeHtml(err.message)}<br>If you are running locally, start the API on http://127.0.0.1:8000.</div>`;
    }
  }

  kaggleSearchBtn?.addEventListener("click", performKaggleSearch);
  kaggleSearchInput?.addEventListener("keyup", (e) => {
    if (e.key === "Enter") performKaggleSearch();
  });

  function deleteBlock(blockId) {
    const instance = blocks.find((b) => b.id === blockId);
    if (!instance) return;

    // Delete entire stack below
    const stack = getStack(instance);
    stack.forEach((b) => {
      const el = document.querySelector(`[data-block-id="${b.id}"]`);
      if (el) el.remove();
      blocks = blocks.filter((x) => x.id !== b.id);
    });

    // Detach from parent
    if (instance.parentId) {
      const parent = blocks.find((b) => b.id === instance.parentId);
      if (parent) parent.childId = null;
    }

    updateBlockCount();
  }

  function updateStackVisuals() {
    const roots = blocks.filter((b) => !b.parentId);
    roots.forEach((root) => positionStack(root));
  }

  // ── Tooltip ────────────────────────────────────────────────────────────────
  function showTooltip(e, text) {
    const tt = document.getElementById("block-tooltip");
    const ttText = document.getElementById("tooltip-text");
    if (!tt || !ttText || !text) return;
    ttText.textContent = text;
    tt.classList.remove("hidden");
    tt.style.left = `${Math.min(e.clientX + 12, window.innerWidth - 260)}px`;
    tt.style.top = `${e.clientY - 10}px`;
  }

  function hideTooltip() {
    const tt = document.getElementById("block-tooltip");
    if (tt) tt.classList.add("hidden");
  }

  // ── Workspace Controls ─────────────────────────────────────────────────────
  function clearWorkspace() {
    document
      .getElementById("workspace-inner")
      .querySelectorAll(".workspace-block")
      .forEach((el) => el.remove());
    blocks = [];
    blockCount = 0;
    updateBlockCount();
    const hint = document
      .getElementById("workspace-inner")
      ?.querySelector(".workspace-hint");
    if (hint) hint.style.display = "";
    NB.VISUALIZER.log("🗑️ Workspace cleared", "info");
  }

  function updateBlockCount() {
    const el = document.getElementById("block-count");
    if (el)
      el.textContent = `${blocks.length} block${blocks.length !== 1 ? "s" : ""}`;
  }

  // ── Zoom ───────────────────────────────────────────────────────────────────
  function setZoom(delta) {
    scale = Math.max(0.4, Math.min(2, scale + delta));
    const inner = document.getElementById("workspace-inner");
    if (inner) inner.style.transform = `scale(${scale})`;
  }

  // ── Save / Load ────────────────────────────────────────────────────────────
  function saveWorkspace() {
    const data = blocks.map((b) => ({
      id: b.id,
      defId: b.defId,
      inputs: b.inputs,
      x: b.x,
      y: b.y,
      parentId: b.parentId,
      childId: b.childId,
    }));
    localStorage.setItem("neuralblocks_workspace_v1", JSON.stringify(data));
    NB.VISUALIZER.log("💾 Workspace saved!", "success");
  }

  function loadWorkspace() {
    try {
      const saved = localStorage.getItem("neuralblocks_workspace_v1");
      if (!saved) return;
      const data = JSON.parse(saved);
      clearWorkspace();
      const canvas = document.getElementById("workspace-inner");
      if (!canvas) return;
      const hint = canvas.querySelector(".workspace-hint");
      if (hint && data.length > 0) hint.style.display = "none";

      data.forEach((b) => {
        const instance = { ...b };
        blocks.push(instance);
        const el = renderWorkspaceBlock(instance);
        if (el) {
          canvas.appendChild(el);
          attachDragHandlers(el, instance);
        }
      });
      updateBlockCount();
    } catch (e) {
      console.warn("Could not load workspace:", e);
    }
  }

  // ── Block Search ───────────────────────────────────────────────────────────
  function onSearch(query) {
    searchQuery = query;
    if (query) {
      // Search across all categories
      selectedCat = null;
      renderAllMatchingBlocks();
    } else {
      selectedCat = selectedCat || "data";
      renderPalette();
    }
  }

  function renderAllMatchingBlocks() {
    const container = document.getElementById("block-list");
    if (!container) return;
    const q = searchQuery.toLowerCase();
    const matching = NB.BLOCKS.filter((b) => {
      const labelStr = b.label
        .map((l) =>
          typeof l === "string"
            ? l
            : l.options
              ? l.options.join(" ")
              : l.name || "",
        )
        .join(" ")
        .toLowerCase();
      return labelStr.includes(q) || b.tooltip.toLowerCase().includes(q);
    });

    container.innerHTML = `
      <div class="cat-header search-header">
        <span>🔍 Search Results (${matching.length})</span>
      </div>
      <div class="palette-blocks">
        ${matching
          .map((block) => {
            const catDef = NB.getCategoryDef(block.category);
            return renderPaletteBlock(block, catDef?.color);
          })
          .join("")}
      </div>
    `;
    container.querySelectorAll(".palette-block").forEach((el) => {
      el.addEventListener("click", () =>
        addBlockToWorkspace(el.dataset.blockId),
      );
      el.addEventListener("mouseenter", (e) => {
        const def = NB.getBlockDef(el.dataset.blockId);
        showTooltip(e, def?.tooltip || "");
      });
      el.addEventListener("mouseleave", hideTooltip);
    });
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  function init() {
    renderPalette();

    // Global mouse events for drag
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    // Search
    const searchEl = document.getElementById("block-search");
    if (searchEl)
      searchEl.addEventListener("input", (e) =>
        onSearch(e.target.value.trim()),
      );
    
    


    // Zoom buttons
    document
      .getElementById("zoom-in-btn")
      ?.addEventListener("click", () => setZoom(0.1));
    document
      .getElementById("zoom-out-btn")
      ?.addEventListener("click", () => setZoom(-0.1));

    // Clear workspace
    document
      .getElementById("clear-workspace-btn")
      ?.addEventListener("click", () => {
        if (blocks.length === 0 || confirm("Clear the entire workspace?"))
          clearWorkspace();
      });

    // Save button
    document
      .getElementById("save-btn")
      ?.addEventListener("click", saveWorkspace);

    // Load saved workspace
    loadWorkspace();

    // Add a starter "when run clicked" block if workspace is empty
    if (blocks.length === 0) {
      setTimeout(() => {
        addBlockToWorkspace("when_run", 80, 60);
      }, 300);
    }
  }

  return {
    init,
    getStacks,
    addBlockToWorkspace,
    clearWorkspace,
    renderPalette,
    updateBlockCount,
  };
})();
