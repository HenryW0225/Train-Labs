'use strict';
// ============================================================================
// Train Labs — Visualizer
// AI Stage animations, Chart.js wrappers, console output
// ============================================================================

window.NB = window.NB || {};

NB.VISUALIZER = (() => {

  let activeChart = null;
  let confettiInterval = null;

  // ── Console Output ─────────────────────────────────────────────────────────
  function log(msg, type = 'info') {
    const log = document.getElementById('console-log');
    if (!log) return;
    const entry = document.createElement('div');
    entry.className = `console-entry ${type}`;
    const time = new Date().toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    entry.innerHTML = `<span class="log-time">${time}</span><span class="log-msg">${msg}</span>`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
  }

  function clearConsole() {
    const log = document.getElementById('console-log');
    if (log) log.innerHTML = '';
  }

  // ── Stage Management ───────────────────────────────────────────────────────
  function clearStage() {
    const msg = document.getElementById('stage-message');
    const chartEl = document.getElementById('stage-chart');
    const viz = document.getElementById('stage-visualization');
    if (msg) { msg.classList.add('hidden'); msg.textContent = ''; }
    if (chartEl) chartEl.classList.add('hidden');
    if (viz) { viz.classList.add('hidden'); viz.innerHTML = ''; }
    if (activeChart) { activeChart.destroy(); activeChart = null; }
  }

  function showMessage(text) {
    clearStage();
    const msg = document.getElementById('stage-message');
    if (!msg) return;
    msg.classList.remove('hidden');
    msg.innerHTML = `<div class="speech-bubble">${text}</div>`;
    setCharacterEmotion('happy');
  }

  function showVisualization(html) {
    clearStage();
    const viz = document.getElementById('stage-visualization');
    if (!viz) return;
    viz.classList.remove('hidden');
    viz.innerHTML = html;
  }

  // ── Character Emotions ─────────────────────────────────────────────────────
  function setCharacterEmotion(emotion) {
    const char = document.getElementById('ai-character');
    if (!char) return;
    char.dataset.emotion = emotion;
    const eyes = char.querySelectorAll('.bot-eye');
    const mouth = char.querySelector('.bot-mouth');
    const chest = char.querySelector('.bot-chest-light');

    const emotionStyles = {
      idle:      { eyeClass: '', mouthClass: '',       chestColor: '#818CF8' },
      happy:     { eyeClass: 'happy', mouthClass: 'smile',    chestColor: '#10B981' },
      thinking:  { eyeClass: 'thinking', mouthClass: 'flat',  chestColor: '#F59E0B' },
      excited:   { eyeClass: 'wide', mouthClass: 'big-smile', chestColor: '#F97316' },
      sad:       { eyeClass: 'sad', mouthClass: 'frown',      chestColor: '#EF4444' },
      working:   { eyeClass: 'focused', mouthClass: 'flat',   chestColor: '#3B82F6' },
    };
    const s = emotionStyles[emotion] || emotionStyles.idle;
    eyes.forEach(e => { e.className = 'bot-eye ' + s.eyeClass; });
    if (mouth) mouth.className = 'bot-mouth ' + s.mouthClass;
    if (chest) chest.style.background = s.chestColor;
  }

  // ── Training Overlay ───────────────────────────────────────────────────────
  function showTrainingOverlay(show, status = '', epoch = 0, totalEpochs = 0, pct = 0) {
    const overlay = document.getElementById('training-overlay');
    const statusEl = document.getElementById('training-status');
    const fill = document.getElementById('training-progress-fill');
    const epochInfo = document.getElementById('training-epoch-info');
    if (!overlay) return;
    if (show) {
      overlay.classList.remove('hidden');
      if (statusEl) statusEl.textContent = status;
      if (fill) fill.style.width = `${pct}%`;
      if (epochInfo) epochInfo.textContent = `Epoch ${epoch} / ${totalEpochs}`;
      setCharacterEmotion('working');
    } else {
      overlay.classList.add('hidden');
    }
  }

  // ── Dataset Preview Table ──────────────────────────────────────────────────
  function showDatasetPreview(dataset) {
    if (!dataset || !dataset.data || !dataset.headers) {
      showMessage('⚠️ No dataset loaded yet!');
      return;
    }
    const maxRows = Math.min(dataset.data.length, 8);
    const rows = dataset.data.slice(0, maxRows);
    let html = `
      <div class="stage-table-wrap">
        <div class="stage-table-title">📋 ${dataset.name || 'Dataset'} — ${dataset.data.length} rows × ${dataset.headers.length} columns</div>
        <table class="stage-table">
          <thead><tr>${dataset.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map(v => `<td>${typeof v === 'number' ? v.toFixed(3).replace(/\.?0+$/, '') : v}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        ${dataset.data.length > maxRows ? `<div class="table-more">... and ${dataset.data.length - maxRows} more rows</div>` : ''}
      </div>`;
    showVisualization(html);
    log(`📋 Showing preview: ${dataset.data.length} rows, ${dataset.headers.length} columns`, 'info');
  }

  // ── Bar Chart ──────────────────────────────────────────────────────────────
  function showBarChart(labels, values, title, colors) {
    clearStage();
    const chartEl = document.getElementById('stage-chart');
    if (!chartEl) return;
    chartEl.classList.remove('hidden');
    if (activeChart) activeChart.destroy();

    const palette = colors || labels.map((_, i) => {
      const hues = [265, 215, 160, 45, 25, 0, 200];
      return `hsl(${hues[i % hues.length]}, 80%, 65%)`;
    });

    activeChart = new Chart(chartEl, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: title,
          data: values,
          backgroundColor: palette,
          borderColor: palette.map(c => c.replace('65%', '45%')),
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: !!title, text: title, color: '#F1F5F9', font: { size: 13, family: 'Nunito', weight: '700' } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.raw.toFixed ? ctx.raw.toFixed(2) : ctx.raw}` } }
        },
        scales: {
          x: { ticks: { color: '#94A3B8', font: { family: 'Nunito' } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#94A3B8', font: { family: 'Nunito' } }, grid: { color: 'rgba(255,255,255,0.08)' }, beginAtZero: true }
        },
        animation: { duration: 800, easing: 'easeOutQuart' }
      }
    });
  }

  // ── Line Chart (Training History) ─────────────────────────────────────────
  function showLineChart(history, title) {
    clearStage();
    const chartEl = document.getElementById('stage-chart');
    if (!chartEl) return;
    chartEl.classList.remove('hidden');
    if (activeChart) activeChart.destroy();

    const epochs = history.loss.map((_, i) => `Epoch ${i + 1}`);
    const datasets = [
      {
        label: 'Loss',
        data: history.loss,
        borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.1)',
        tension: 0.4, pointRadius: 3, fill: true, yAxisID: 'y',
      }
    ];
    if (history.acc) {
      datasets.push({
        label: 'Accuracy',
        data: history.acc,
        borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.1)',
        tension: 0.4, pointRadius: 3, fill: true, yAxisID: 'y1',
      });
    }

    activeChart = new Chart(chartEl, {
      type: 'line',
      data: { labels: epochs, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          title: { display: true, text: title || 'Training History', color: '#F1F5F9', font: { size: 13, family: 'Nunito', weight: '700' } },
          legend: { labels: { color: '#D1D5DB', font: { family: 'Nunito' } } },
        },
        scales: {
          x: { ticks: { color: '#94A3B8', font: { family: 'Nunito', size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: {
            type: 'linear', position: 'left',
            ticks: { color: '#EF4444', font: { family: 'Nunito', size: 10 } },
            grid: { color: 'rgba(255,255,255,0.05)' },
            title: { display: true, text: 'Loss', color: '#EF4444' }
          },
          y1: {
            type: 'linear', position: 'right',
            ticks: { color: '#10B981', font: { family: 'Nunito', size: 10 } },
            grid: { drawOnChartArea: false },
            title: { display: true, text: 'Accuracy', color: '#10B981' },
            min: 0, max: 1
          }
        },
        animation: { duration: 600, easing: 'easeOutQuart' }
      }
    });
  }

  // ── Scatter Plot ───────────────────────────────────────────────────────────
  function showScatterPlot(dataset, xCol, yCol) {
    if (!dataset) { showMessage('⚠️ Load a dataset first!'); return; }
    clearStage();
    const chartEl = document.getElementById('stage-chart');
    if (!chartEl) return;
    chartEl.classList.remove('hidden');
    if (activeChart) activeChart.destroy();

    // Group by label (last column)
    const labelCol = dataset.headers.length - 1;
    const uniqueLabels = [...new Set(dataset.data.map(r => r[labelCol]))];
    const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

    const datasets = uniqueLabels.map((lbl, i) => ({
      label: String(lbl),
      data: dataset.data.filter(r => r[labelCol] === lbl).map(r => ({ x: +r[xCol] || 0, y: +r[yCol] || 0 })),
      backgroundColor: colors[i % colors.length] + 'CC',
      pointRadius: 5,
    }));

    activeChart = new Chart(chartEl, {
      type: 'scatter',
      data: { datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: `${dataset.headers[xCol]} vs ${dataset.headers[yCol]}`, color: '#F1F5F9', font: { size: 13, family: 'Nunito', weight: '700' } },
          legend: { labels: { color: '#D1D5DB', font: { family: 'Nunito' } } },
        },
        scales: {
          x: { title: { display: true, text: dataset.headers[xCol] || `Col ${xCol}`, color: '#94A3B8' }, ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { title: { display: true, text: dataset.headers[yCol] || `Col ${yCol}`, color: '#94A3B8' }, ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        },
        animation: { duration: 600 }
      }
    });
  }

  // ── Cluster Plot (K-Means) ─────────────────────────────────────────────────
  function showClusterPlot(rows, labels, centroids, xCol, yCol, headers) {
    if (!rows || !rows.length) { showMessage('⚠️ No data to plot!'); return; }
    clearStage();
    const chartEl = document.getElementById('stage-chart');
    if (!chartEl) return;
    chartEl.classList.remove('hidden');
    if (activeChart) activeChart.destroy();

    const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#84CC16', '#F97316', '#6366F1'];
    const k = centroids.length;
    const xName = headers?.[xCol] || `Col ${xCol}`;
    const yName = headers?.[yCol] || `Col ${yCol}`;

    const datasets = Array.from({ length: k }, (_, ci) => ({
      label: `Cluster ${ci}`,
      data: rows.filter((_, i) => labels[i] === ci).map(r => ({ x: +r[xCol] || 0, y: +r[yCol] || 0 })),
      backgroundColor: colors[ci % colors.length] + 'CC',
      pointRadius: 5,
    }));

    if (centroids.length) {
      datasets.push({
        label: 'Centroids',
        data: centroids.map(c => ({ x: +c[xCol] || 0, y: +c[yCol] || 0 })),
        backgroundColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 2,
        pointRadius: 9,
        pointStyle: 'star',
      });
    }

    activeChart = new Chart(chartEl, {
      type: 'scatter',
      data: { datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: `K-Means Clusters: ${xName} vs ${yName}`, color: '#F1F5F9', font: { size: 13, family: 'Nunito', weight: '700' } },
          legend: { labels: { color: '#D1D5DB', font: { family: 'Nunito' } } },
        },
        scales: {
          x: { title: { display: true, text: xName, color: '#94A3B8' }, ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { title: { display: true, text: yName, color: '#94A3B8' }, ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        },
        animation: { duration: 600 }
      }
    });
    setCharacterEmotion('excited');
  }

  // ── Prediction Result Card ────────────────────────────────────────────────
  function showPredictionCard(label, confidence, allProbs) {
    const confPct = confidence != null ? Math.round(confidence * 100) : null;
    let probsHtml = '';
    if (allProbs) {
      probsHtml = `<div class="pred-probs">
        ${Object.entries(allProbs).map(([cls, prob]) => `
          <div class="prob-row">
            <span class="prob-label">${cls}</span>
            <div class="prob-bar-bg"><div class="prob-bar" style="width:${Math.round(prob*100)}%;background:${cls === label ? '#10B981' : '#3B82F6'}"></div></div>
            <span class="prob-pct">${Math.round(prob*100)}%</span>
          </div>`).join('')}
      </div>`;
    }
    showVisualization(`
      <div class="pred-card">
        <div class="pred-icon">🔮</div>
        <div class="pred-result-label">Prediction</div>
        <div class="pred-result-value">${label}</div>
        ${confPct != null ? `<div class="pred-confidence"><div class="conf-bar-bg"><div class="conf-bar" style="width:${confPct}%"></div></div><span>${confPct}% confident</span></div>` : ''}
        ${probsHtml}
      </div>`);
    setCharacterEmotion('excited');
  }

  // ── Confusion Matrix ──────────────────────────────────────────────────────
  function showConfusionMatrix(matrix, labels) {
    const n = labels.length;
    let html = `<div class="confusion-matrix-wrap"><div class="cm-title">Confusion Matrix</div>
      <table class="cm-table">
        <thead><tr><th>Actual ↓ / Pred →</th>${labels.map(l => `<th>${l}</th>`).join('')}</tr></thead>
        <tbody>
          ${matrix.map((row, i) => `
            <tr><th>${labels[i]}</th>${row.map((v, j) => `<td class="${i === j ? 'cm-correct' : 'cm-wrong'}" style="opacity:${0.3 + 0.7 * (v / Math.max(...matrix.flat(), 1))}">${v}</td>`).join('')}</tr>
          `).join('')}
        </tbody>
      </table>
      <div class="cm-legend"><span class="cm-correct-dot">●</span> Correct &nbsp; <span class="cm-wrong-dot">●</span> Incorrect</div>
    </div>`;
    showVisualization(html);
  }

  // ── Sentiment Display ──────────────────────────────────────────────────────
  function showSentimentResult(text, sentiment, score) {
    const icon = sentiment === 'positive' ? '😊' : sentiment === 'negative' ? '😢' : '😐';
    const color = sentiment === 'positive' ? '#10B981' : sentiment === 'negative' ? '#EF4444' : '#F59E0B';
    const pct = Math.round(Math.abs(score) * 100);
    showVisualization(`
      <div class="sentiment-card">
        <div class="sent-icon" style="font-size:3rem">${icon}</div>
        <div class="sent-label" style="color:${color}">${sentiment.toUpperCase()}</div>
        <div class="sent-text">"${text.length > 60 ? text.slice(0, 60) + '…' : text}"</div>
        <div class="sent-bar-wrap">
          <div class="sent-bar" style="width:${pct}%;background:${color}"></div>
        </div>
        <div class="sent-score">Confidence: ${pct}%</div>
      </div>`);
    setCharacterEmotion(sentiment === 'positive' ? 'happy' : sentiment === 'negative' ? 'sad' : 'thinking');
  }

  // ── Word Frequency Chart ───────────────────────────────────────────────────
  function showWordFrequency(freqMap) {
    const sorted = Object.entries(freqMap).sort((a, b) => b[1] - a[1]).slice(0, 12);
    showBarChart(sorted.map(e => e[0]), sorted.map(e => e[1]), 'Word Frequency');
  }

  // ── Tokenize Display ───────────────────────────────────────────────────────
  function showTokens(tokens) {
    const html = `<div class="token-display">
      <div class="token-title">🔤 Tokens (${tokens.length} words)</div>
      <div class="token-chips">${tokens.map((t, i) => `<span class="token-chip" style="animation-delay:${i * 60}ms">${t}</span>`).join('')}</div>
    </div>`;
    showVisualization(html);
  }

  // ── Model Summary ──────────────────────────────────────────────────────────
  function showModelSummary(modelName, layers) {
    const rows = layers.map(l =>
      `<tr><td>${l.name}</td><td>${l.type}</td><td>${l.outputShape || '?'}</td><td>${l.params}</td></tr>`
    ).join('');
    const totalParams = layers.reduce((s, l) => s + (l.params || 0), 0);
    showVisualization(`
      <div class="model-summary">
        <div class="summary-title">🧠 ${modelName} — Architecture</div>
        <table class="summary-table">
          <thead><tr><th>Layer</th><th>Type</th><th>Output Shape</th><th>Parameters</th></tr></thead>
          <tbody>${rows}</tbody>
          <tfoot><tr><td colspan="3" style="text-align:right;font-weight:700">Total Parameters</td><td>${totalParams.toLocaleString()}</td></tr></tfoot>
        </table>
      </div>`);
  }

  // ── Reinforcement Learning Grid Viz ───────────────────────────────────────
  function showRLGrid(gridSize, agentPos, goalPos, walls, path) {
    const size = gridSize || 4;
    let html = `<div class="rl-grid-wrap"><div class="rl-title">🎮 RL Environment — Grid World ${size}×${size}</div>
      <div class="rl-grid" style="grid-template-columns:repeat(${size},1fr)">`;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const idx = r * size + c;
        let cls = 'rl-cell';
        let content = '';
        if (walls && walls.includes(idx)) { cls += ' rl-wall'; content = '🧱'; }
        else if (goalPos && goalPos[0] === r && goalPos[1] === c) { cls += ' rl-goal'; content = '🏆'; }
        else if (agentPos && agentPos[0] === r && agentPos[1] === c) { cls += ' rl-agent'; content = '🤖'; }
        else if (path && path.some(p => p[0] === r && p[1] === c)) { cls += ' rl-path'; content = '·'; }
        html += `<div class="${cls}">${content}</div>`;
      }
    }
    html += '</div></div>';
    showVisualization(html);
  }

  // ── Celebrate Confetti ─────────────────────────────────────────────────────
  function celebrate() {
    clearStage();
    const viz = document.getElementById('stage-visualization');
    if (!viz) return;
    viz.classList.remove('hidden');
    viz.innerHTML = `<div class="celebrate-container">
      <div class="celebrate-text">🎉 Amazing Work! 🎉</div>
      <div class="celebrate-sub">Your AI is incredible!</div>
      <div class="confetti-wrap" id="confetti-wrap"></div>
    </div>`;
    setCharacterEmotion('excited');

    const wrap = document.getElementById('confetti-wrap');
    if (!wrap) return;
    const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#F97316', '#06B6D4'];
    for (let i = 0; i < 40; i++) {
      const dot = document.createElement('div');
      dot.className = 'confetti-dot';
      dot.style.cssText = `
        left:${Math.random()*100}%;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        animation-delay:${Math.random()*1.5}s;
        animation-duration:${1.5 + Math.random()}s;
        width:${6 + Math.random()*8}px;
        height:${6 + Math.random()*8}px;
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};`;
      wrap.appendChild(dot);
    }
  }

  // ── Image Display (CORS-safe, data-URL based) ──────────────────────────────
  // Main function: renders any src (data-URL or remote) with error fallback
  function showImageFromDataURL(src, caption) {
    clearStage();
    const viz = document.getElementById('stage-visualization');
    if (!viz) return;
    viz.classList.remove('hidden');
    viz.innerHTML = `
      <div class="image-display">
        <img src="${src}" alt="${caption || 'AI image'}" class="stage-img"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="img-error" style="display:none">
          <div style="font-size:3rem">🖼️</div>
          <div style="color:#64748B;font-size:0.8rem;margin-top:8px">Image preview unavailable</div>
        </div>
        ${caption ? `<div class="img-caption">${caption}</div>` : ''}
      </div>`;
    setCharacterEmotion('happy');
  }

  // For URLs from the internet — tries to load, shows friendly fallback on error
  function showImageWithFallback(src, fallbackEmoji, caption) {
    clearStage();
    const viz = document.getElementById('stage-visualization');
    if (!viz) return;
    viz.classList.remove('hidden');
    const emoji = fallbackEmoji || '🖼️';
    viz.innerHTML = `
      <div class="image-display">
        <img src="${src}" alt="${caption || 'AI image'}" class="stage-img"
          crossorigin="anonymous"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="img-error" style="display:none">
          <div style="font-size:3rem">${emoji}</div>
          <div style="color:#94A3B8;font-size:0.78rem;margin-top:6px">Could not load image from URL</div>
          <div style="color:#64748B;font-size:0.7rem;margin-top:4px">Try a different URL or use a sample image</div>
        </div>
        ${caption ? `<div class="img-caption">${caption}</div>` : ''}
      </div>`;
    setCharacterEmotion('happy');
  }

  // Applies a CSS filter to a data-URL image (always works since it's already loaded)
  function showFilteredImage(src, filterName, cssFilter, label) {
    clearStage();
    const viz = document.getElementById('stage-visualization');
    if (!viz) return;
    viz.classList.remove('hidden');
    viz.innerHTML = `
      <div class="image-display">
        <div class="filter-badge">${filterName}</div>
        <img src="${src}" alt="Filtered image" class="stage-img" style="filter:${cssFilter}">
        <div class="img-caption">Filter applied: <strong>${filterName}</strong>${label ? ' — ' + label : ''}</div>
      </div>`;
  }

  // Detection overlay drawn on canvas (no CORS issues with data-URLs)
  function showDetectionOverlay(src, detections, label) {
    clearStage();
    const viz = document.getElementById('stage-visualization');
    if (!viz) return;
    viz.classList.remove('hidden');

    // Draw the detections on a canvas over the image
    const wrap = document.createElement('div');
    wrap.className = 'image-display detection-wrap';
    const canvas = document.createElement('canvas');
    canvas.className = 'detection-canvas';
    canvas.width = 320; canvas.height = 240;

    const ctx2 = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      ctx2.drawImage(img, 0, 0, 320, 240);
      const colors = { cat:'#10B981', dog:'#3B82F6', car:'#F59E0B', flower:'#F97316', house:'#8B5CF6', butterfly:'#06B6D4', tree:'#10B981', object:'#EF4444' };
      detections.forEach(d => {
        const color = colors[d.class] || '#EF4444';
        // Bounding box
        ctx2.strokeStyle = color;
        ctx2.lineWidth = 3;
        ctx2.strokeRect(d.bbox[0], d.bbox[1], d.bbox[2], d.bbox[3]);
        // Label background
        const text = `${d.class} ${Math.round(d.score*100)}%`;
        ctx2.font = 'bold 13px Nunito, sans-serif';
        const tw = ctx2.measureText(text).width;
        ctx2.fillStyle = color;
        ctx2.fillRect(d.bbox[0] - 1, d.bbox[1] - 22, tw + 10, 20);
        // Label text
        ctx2.fillStyle = 'white';
        ctx2.fillText(text, d.bbox[0] + 4, d.bbox[1] - 7);
      });
    };
    img.onerror = () => {
      // Image failed to load — draw boxes over dark bg anyway
      ctx2.fillStyle = '#0F172A';
      ctx2.fillRect(0, 0, 320, 240);
      ctx2.fillStyle = 'rgba(129,140,248,0.1)';
      ctx2.fillRect(0, 0, 320, 240);
      const colors = { cat:'#10B981', dog:'#3B82F6', car:'#F59E0B', flower:'#F97316', house:'#8B5CF6', butterfly:'#06B6D4', tree:'#10B981', object:'#EF4444' };
      // Draw emoji in center
      const emojiMap = { cat:'🐱', dog:'🐶', car:'🚗', flower:'🌸', house:'🏠', butterfly:'🦋' };
      const labelKey = (label||'').replace(/^.+? /, '').toLowerCase();
      const emoji = emojiMap[labelKey] || '🖼️';
      ctx2.font = '80px serif';
      ctx2.textAlign = 'center';
      ctx2.textBaseline = 'middle';
      ctx2.fillText(emoji, 160, 110);
      detections.forEach(d => {
        const color = colors[d.class] || '#EF4444';
        ctx2.strokeStyle = color;
        ctx2.lineWidth = 3;
        ctx2.strokeRect(d.bbox[0], d.bbox[1], d.bbox[2], d.bbox[3]);
        const text = `${d.class} ${Math.round(d.score*100)}%`;
        ctx2.font = 'bold 13px sans-serif';
        ctx2.fillStyle = color;
        const tw = ctx2.measureText(text).width;
        ctx2.fillRect(d.bbox[0] - 1, d.bbox[1] - 22, tw + 10, 20);
        ctx2.fillStyle = 'white';
        ctx2.fillText(text, d.bbox[0] + 4, d.bbox[1] - 7);
      });
    };
    img.src = src;

    wrap.appendChild(canvas);
    const cap = document.createElement('div');
    cap.className = 'img-caption';
    cap.innerHTML = `🔍 Found <strong>${detections.length}</strong> object(s) detected`;
    wrap.appendChild(cap);
    viz.appendChild(wrap);
    setCharacterEmotion('excited');
  }

  // ── Class Distribution Chart ───────────────────────────────────────────────
  function showClassDistribution(dataset) {
    if (!dataset) { showMessage('⚠️ Load a dataset first!'); return; }
    const labelCol = dataset.data[0].length - 1;
    const counts = {};
    dataset.data.forEach(row => {
      const lbl = String(row[labelCol]);
      counts[lbl] = (counts[lbl] || 0) + 1;
    });
    showBarChart(Object.keys(counts), Object.values(counts), 'Class Distribution');
  }

  // ── Accuracy Display ───────────────────────────────────────────────────────
  function showAccuracyResult(modelName, accuracy) {
    const pct = Math.round(accuracy * 100);
    const color = pct >= 90 ? '#10B981' : pct >= 70 ? '#F59E0B' : '#EF4444';
    const grade = pct >= 90 ? 'Excellent! 🏆' : pct >= 75 ? 'Good Job! 👍' : pct >= 50 ? 'Keep Training! 💪' : 'Needs Work 🔧';
    showVisualization(`
      <div class="accuracy-card">
        <div class="acc-model">${modelName}</div>
        <div class="acc-ring-wrap">
          <svg viewBox="0 0 100 100" class="acc-ring">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#1F2937" stroke-width="10"/>
            <circle cx="50" cy="50" r="42" fill="none" stroke="${color}" stroke-width="10"
              stroke-dasharray="${pct * 2.639} ${(100 - pct) * 2.639}"
              stroke-dashoffset="66" stroke-linecap="round"
              style="transition:stroke-dasharray 1s ease;"/>
            <text x="50" y="46" text-anchor="middle" fill="${color}" font-size="22" font-weight="bold" font-family="Nunito">${pct}%</text>
            <text x="50" y="60" text-anchor="middle" fill="#9CA3AF" font-size="9" font-family="Nunito">accuracy</text>
          </svg>
        </div>
        <div class="acc-grade" style="color:${color}">${grade}</div>
      </div>`);
    setCharacterEmotion(pct >= 75 ? 'happy' : pct >= 50 ? 'thinking' : 'sad');
  }

  // ── Regression Line Chart ──────────────────────────────────────────────────
  function showRegressionLine(points, line, xName, yName, modelName) {
    clearStage();
    const pts = points.map((p) => ({ x: +p.x, y: +p.y }));
    let ln = line.map((p) => ({ x: +p.x, y: +p.y }));
    ln = ln.sort((a, b) => a.x - b.x);

    // compute axis ranges with padding
    const allX = pts.map((p) => p.x).concat(ln.map((p) => p.x));
    const allY = pts.map((p) => p.y).concat(ln.map((p) => p.y));
    let xMin = Math.min(...allX),
      xMax = Math.max(...allX);
    let yMin = Math.min(...allY),
      yMax = Math.max(...allY);

    // handle errors in the dataset
    if (!isFinite(xMin) || !isFinite(xMax)) {
      xMin = 0;
      xMax = 1;
    }
    if (!isFinite(yMin) || !isFinite(yMax)) {
      yMin = 0;
      yMax = 1;
    }

    const chartEl = document.getElementById('stage-chart');
    if (!chartEl) return;
    chartEl.classList.remove('hidden');
    if (activeChart) activeChart.destroy();
    console.log(xMin)
    console.log(xMax)
    activeChart = new Chart(chartEl, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Data points',
            data: pts,
            backgroundColor: 'rgba(59,130,246,0.65)',
            borderColor: '#3B82F6',
            borderWidth: 1,
            pointRadius: 5,
            order: 2,
          },
          {
            label: 'Regression line',
            data: line,
            type: 'line',
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245,158,11,0.08)',
            borderWidth: 3,
            pointRadius: 0,
            tension: 0,
            fill: false,
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${modelName}: ${xName} vs ${yName}`,
            color: '#F1F5F9',
            font: { size: 13, family: 'Nunito', weight: '700' },
          },
          legend: { labels: { color: '#D1D5DB', font: { family: 'Nunito' } } },
        },
        scales: {
          x: {
            type: 'linear',
            title: { display: true, text: xName, color: '#94A3B8' },
            ticks: { color: '#94A3B8' },
            grid: { color: 'rgba(255,255,255,0.05)' },
            
          },
          y: {
            title: { display: true, text: yName, color: '#94A3B8' },
            ticks: { color: '#94A3B8' },
            grid: { color: 'rgba(255,255,255,0.08)' },
            
          },
        },
        animation: { duration: 700 },
      },
    });
    setCharacterEmotion('happy');
  }

  // ── ROC Curve ──────────────────────────────────────────────────────────────
  function showROCCurve(fpr, tpr, auc, modelName, posClass, negClass, isMulticlass) {
    clearStage();
    const chartEl = document.getElementById('stage-chart');
    if (!chartEl) return;
    chartEl.classList.remove('hidden');
    if (activeChart) activeChart.destroy();

    const aucPct = Math.round(auc * 100);
    const rocPoints = fpr.map((x, i) => ({ x, y: tpr[i] }));
    const diagPoints = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
    const classNote = isMulticlass ? ` ("${posClass}" vs rest)` : '';

    activeChart = new Chart(chartEl, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Random guess',
            data: diagPoints,
            type: 'line',
            borderColor: 'rgba(148,163,184,0.4)',
            borderDash: [6, 4],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
          },
          {
            label: `ROC curve`,
            data: rocPoints,
            type: 'line',
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139,92,246,0.12)',
            borderWidth: 3,
            pointRadius: 0,
            tension: 0.1,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `ROC — ${modelName}${classNote}  ·  AUC ${aucPct}%  ·  +${posClass} / −${negClass}`,
            color: '#F1F5F9',
            font: { size: 12, family: 'Nunito', weight: '700' },
          },
          legend: { labels: { color: '#D1D5DB', font: { family: 'Nunito', size: 11 } } },
        },
        scales: {
          x: {
            type: 'linear',
            min: 0, max: 1,
            title: { display: true, text: 'False Positive Rate', color: '#94A3B8' },
            ticks: { color: '#94A3B8' },
            grid: { color: 'rgba(255,255,255,0.05)' },
            
          },
          y: {
            min: 0, max: 1,
            title: { display: true, text: 'True Positive Rate', color: '#94A3B8' },
            ticks: { color: '#94A3B8' },
            grid: { color: 'rgba(255,255,255,0.08)' },
          },
        },
        animation: { duration: 800 },
      },
    });
    setCharacterEmotion(auc >= 0.8 ? 'excited' : 'thinking');
  }

  // ── Correlation Heatmap ────────────────────────────────────────────────────
  function corrHeatColor(r) {
    const abs = Math.abs(r);
    if (r >= 0) return `rgba(16,185,129,${0.15 + abs * 0.85})`;
    return `rgba(239,68,68,${0.15 + abs * 0.85})`;
  }

  function showCorrelationHeatmap(headers, matrix) {
    const n = headers.length;
    let html = `
      <div class="corr-heatmap-wrap">
        <div class="corr-heatmap-title">🔥 Correlation Heatmap</div>
        <div class="corr-heatmap-sub">Pearson correlation (−1 to +1) between numeric columns</div>
        <table class="corr-heatmap-table">
          <thead><tr><th></th>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>
            ${matrix.map((row, i) => `
              <tr>
                <th>${headers[i]}</th>
                ${row.map((r, j) => {
                  const val = Math.round(r * 100) / 100;
                  const textColor = Math.abs(r) > 0.5 ? '#fff' : 'var(--text-2)';
                  return `<td style="background:${corrHeatColor(r)};color:${textColor}" title="${headers[i]} × ${headers[j]}">${val.toFixed(2)}</td>`;
                }).join('')}
              </tr>`).join('')}
          </tbody>
        </table>
        <div class="corr-heatmap-legend">
          <span class="corr-neg">■ Negative</span>
          <span class="corr-zero">■ None</span>
          <span class="corr-pos">■ Positive</span>
        </div>
      </div>`;
    showVisualization(html);
    setCharacterEmotion('thinking');
  }

  return {
    log, clearConsole,
    clearStage, showMessage, showVisualization,
    setCharacterEmotion, showTrainingOverlay,
    showDatasetPreview, showBarChart, showLineChart,
    showScatterPlot, showPredictionCard, showConfusionMatrix,
    showSentimentResult, showWordFrequency, showTokens,
    showModelSummary, showRLGrid, celebrate,
    // Vision display — CORS-safe
    showImage: showImageFromDataURL,  // keep old name working
    showImageFromDataURL,
    showImageWithFallback,
    showFilteredImage,
    showDetectionOverlay,
    showImageWithDetections: showDetectionOverlay,  // legacy alias
    showClassDistribution, showAccuracyResult, showClusterPlot,
    showRegressionLine, showROCCurve, showCorrelationHeatmap,
  };
})();
