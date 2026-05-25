'use strict';
// ============================================================================
// Train Labs — App Entry Point
// Initializes all modules, wires up events, manages global UI state
// ============================================================================

window.NB = window.NB || {};

// ── Simple Event Bus ─────────────────────────────────────────────────────────
NB.EVENTS = (() => {
  const listeners = {};
  return {
    on(event, fn) { (listeners[event] = listeners[event] || []).push(fn); },
    off(event, fn) { if (listeners[event]) listeners[event] = listeners[event].filter(f => f !== fn); },
    emit(event, data) { (listeners[event] || []).forEach(fn => fn(data)); },
  };
})();

// ── App Init ──────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // Initialize modules
  NB.GAMIFICATION.init();
  NB.WORKSPACE.init();
  NB.VISUALIZER.setCharacterEmotion('idle');

  // Initial XP UI render
  updateXPDisplay();
  updateBadgesDisplay();
  updateMissionsBtn();

  // ── Run / Stop Controls ────────────────────────────────────────────────────
  const runBtn = document.getElementById('run-btn');
  const stopBtn = document.getElementById('stop-btn');
  const resetBtn = document.getElementById('reset-btn');
  const speedSlider = document.getElementById('speed-slider');
  const speedLabel = document.getElementById('speed-label');
  const statusText = document.getElementById('status-text');

  const SPEED_LABELS = ['Very Slow', 'Slow', 'Normal', 'Fast', 'Turbo ⚡'];

  let isRunning = false;

  runBtn?.addEventListener('click', async () => {
    if (isRunning) return;
    isRunning = true;
    runBtn.disabled = true;
    stopBtn.disabled = false;
    if (statusText) statusText.textContent = 'Running…';

    const stacks = NB.WORKSPACE.getStacks();
    if (stacks.length === 0 || stacks.every(s => s.length === 0)) {
      NB.VISUALIZER.log('⚠️ No blocks in workspace! Click blocks from the left panel to add them.', 'warn');
      NB.VISUALIZER.showMessage('Add some blocks to get started! 👆');
      isRunning = false;
      runBtn.disabled = false;
      stopBtn.disabled = true;
      return;
    }

    const speed = +speedSlider?.value || 3;
    await NB.EXECUTOR.run(stacks, speed);
  });

  stopBtn?.addEventListener('click', () => {
    NB.EXECUTOR.stop();
    NB.EVENTS.emit('run_complete');
  });

  resetBtn?.addEventListener('click', () => {
    NB.EXECUTOR.stop();
    NB.VISUALIZER.clearStage();
    NB.VISUALIZER.clearConsole();
    NB.VISUALIZER.log('↺ Reset. Ready to run again!', 'info');
    NB.VISUALIZER.setCharacterEmotion('idle');
    NB.EVENTS.emit('run_complete');
  });

  NB.EVENTS.on('run_complete', () => {
    isRunning = false;
    if (runBtn) runBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    if (statusText) statusText.textContent = 'Ready';
  });

  speedSlider?.addEventListener('input', () => {
    const v = +speedSlider.value;
    if (speedLabel) speedLabel.textContent = SPEED_LABELS[v - 1] || 'Normal';
  });

  // ── Console Clear ──────────────────────────────────────────────────────────
  document.getElementById('clear-console-btn')?.addEventListener('click', () => {
    NB.VISUALIZER.clearConsole();
    NB.VISUALIZER.log('Console cleared.', 'info');
  });

  // ── Modals ─────────────────────────────────────────────────────────────────
  // Missions modal
  document.getElementById('missions-btn')?.addEventListener('click', openMissionsModal);
  document.getElementById('help-btn')?.addEventListener('click', () => toggleModal('help-modal', true));

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal')?.classList.add('hidden');
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
      overlay.closest('.modal')?.classList.add('hidden');
    });
  });

  document.getElementById('badge-continue-btn')?.addEventListener('click', () => toggleModal('badge-modal', false));
  document.getElementById('levelup-continue-btn')?.addEventListener('click', () => toggleModal('levelup-modal', false));

  // ── Gamification Events ────────────────────────────────────────────────────
  NB.EVENTS.on('xp_changed', ({ xp, level, gained, reason }) => {
    updateXPDisplay();
    showXPFloat(gained);
  });

  NB.EVENTS.on('levelup', ({ level }) => {
    updateXPDisplay();
    const el = document.getElementById('new-level-num');
    if (el) el.textContent = level;
    const rewardText = document.getElementById('levelup-reward-text');
    if (rewardText) rewardText.textContent = `Keep building AI — you're on fire! 🔥`;
    toggleModal('levelup-modal', true);
    NB.VISUALIZER.log(`⬆️ Level Up! You are now Level ${level}!`, 'success');
    NB.VISUALIZER.celebrate();
  });

  NB.EVENTS.on('badge_earned', (badge) => {
    updateBadgesDisplay();
    const icon = document.getElementById('badge-earned-icon');
    const name = document.getElementById('badge-earned-name');
    const desc = document.getElementById('badge-earned-desc');
    if (icon) icon.textContent = badge.icon;
    if (name) name.textContent = badge.name;
    if (desc) desc.textContent = badge.desc;
    setTimeout(() => toggleModal('badge-modal', true), 500);
    NB.VISUALIZER.log(`🏆 Badge earned: "${badge.name}" ${badge.icon}`, 'success');
  });

  NB.EVENTS.on('mission_step', ({ mission, stepIdx }) => {
    updateMissionsBtn();
    const steps = NB.GAMIFICATION.getMissions().find(m => m.id === mission.id)?.steps || [];
    const step = steps[stepIdx];
    if (step) NB.VISUALIZER.log(`✅ Mission step: "${step.desc}"`, 'info');
  });

  NB.EVENTS.on('mission_complete', (mission) => {
    updateMissionsBtn();
    NB.VISUALIZER.log(`🎯 Mission complete: "${mission.name}" +${mission.xpReward} XP!`, 'success');
    NB.VISUALIZER.celebrate();
  });

  // ── XP Float Animation ─────────────────────────────────────────────────────
  function showXPFloat(amount) {
    if (!amount) return;
    const el = document.createElement('div');
    el.className = 'xp-float';
    el.textContent = `+${amount} XP`;
    document.body.appendChild(el);
    const xpBar = document.getElementById('xp-bar-container');
    if (xpBar) {
      const rect = xpBar.getBoundingClientRect();
      el.style.left = `${rect.left + 20}px`;
      el.style.top = `${rect.top}px`;
    }
    setTimeout(() => el.remove(), 1200);
  }

  // ── Display Helpers ────────────────────────────────────────────────────────
  function updateXPDisplay() {
    const G = NB.GAMIFICATION;
    const lvl = G.getLevel();
    const progress = G.getXPProgress();

    const lvlEl = document.getElementById('level-num');
    if (lvlEl) lvlEl.textContent = lvl;

    const fill = document.getElementById('xp-bar-fill');
    if (fill) fill.style.width = `${Math.min(100, progress.pct)}%`;

    const xpText = document.getElementById('xp-text');
    if (xpText) xpText.textContent = `${progress.current} / ${progress.needed === Infinity ? '∞' : progress.needed} XP`;
  }

  function updateBadgesDisplay() {
    const badges = NB.GAMIFICATION.getBadges();
    const container = document.getElementById('badges-display');
    if (!container) return;
    container.innerHTML = badges.slice(0, 7).map(b => `
      <span class="badge-icon ${b.earned ? 'earned' : 'locked'}" title="${b.name}: ${b.desc}">
        ${b.earned ? b.icon : '🔒'}
      </span>
    `).join('');
  }

  function updateMissionsBtn() {
    const missions = NB.GAMIFICATION.getMissions();
    const active = missions.find(m => !m.completed);
    if (!active) return;

    const missionName = document.getElementById('mission-name');
    if (missionName) missionName.textContent = `Mission: ${active.name}`;

    const completedSteps = active.steps.filter(s => s.done).length;
    const pct = (completedSteps / active.steps.length) * 100;
    const fill = document.getElementById('mission-progress-fill');
    if (fill) fill.style.width = `${pct}%`;
  }

  function openMissionsModal() {
    const missions = NB.GAMIFICATION.getMissions();
    const container = document.getElementById('missions-list');
    if (!container) return;

    container.innerHTML = missions.map(m => `
      <div class="mission-card ${m.completed ? 'mission-done' : ''}">
        <div class="mission-header">
          <span class="mission-icon">${m.icon}</span>
          <div class="mission-info">
            <div class="mission-name">${m.name} ${m.completed ? '✅' : ''}</div>
            <div class="mission-desc">${m.description}</div>
            <div class="mission-xp">🏆 +${m.xpReward} XP reward</div>
          </div>
        </div>
        <div class="mission-steps">
          ${m.steps.map(s => `
            <div class="mission-step ${s.done ? 'step-done' : ''}">
              <span class="step-check">${s.done ? '✅' : '⬜'}</span>
              <span class="step-desc">${s.desc}</span>
            </div>
          `).join('')}
        </div>
        <div class="mission-progress-bar-wrap">
          <div class="mission-progress-bar-fill" style="width:${Math.round(m.steps.filter(s=>s.done).length/m.steps.length*100)}%"></div>
        </div>
      </div>
    `).join('');

    toggleModal('missions-modal', true);
  }

  function toggleModal(id, show) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.toggle('hidden', !show);
  }

  // ── Keyboard Shortcuts ─────────────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === ' ' || e.key === 'Enter') { // Space/Enter = Run
      if (!isRunning) runBtn?.click();
    }
    if (e.key === 'Escape') { // Escape = Stop
      NB.EXECUTOR.stop();
      NB.EVENTS.emit('run_complete');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') { // Ctrl+Z = (could do undo but just clear for now)
      // future: undo
    }
  });

  // ── Welcome Message ────────────────────────────────────────────────────────
  NB.VISUALIZER.log('🧠 NeuralBlocks loaded! Welcome to AI Block Coding!', 'success');
  NB.VISUALIZER.log('💡 Click blocks from the left palette to add them to the workspace.', 'info');
  NB.VISUALIZER.log('▶ Press Run to execute your AI program!', 'info');
  NB.VISUALIZER.showMessage("Hi! I'm your AI assistant! 👋 Click blocks from the left panel to start building!");

  // Auto-open missions if first run
  const state = NB.GAMIFICATION.getState();
  if (state.stats.run_count === 0) {
    setTimeout(() => openMissionsModal(), 800);
  }
});
