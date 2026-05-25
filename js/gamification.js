'use strict';
// ============================================================================
// Train Labs — Gamification System
// XP, Levels, Badges, Missions, LocalStorage persistence
// ============================================================================

window.NB = window.NB || {};

NB.GAMIFICATION = (() => {

  // ── Constants ──────────────────────────────────────────────────────────────
  const STORAGE_KEY = 'neuralblocks_save_v1';
  const XP_PER_LEVEL = [0, 100, 250, 500, 900, 1500, 2500, 4000, 6000, 9000, 13000];

  // ── Badge Definitions ──────────────────────────────────────────────────────
  const BADGES = [
    { id: 'starter',     icon: '🌱', name: 'First Steps',       desc: 'Run your first program!',               trigger: 'run_count',    threshold: 1   },
    { id: 'data_wrangler',icon: '🗄️', name: 'Data Wrangler',    desc: 'Load 3 different datasets',             trigger: 'datasets_loaded', threshold: 3 },
    { id: 'ml_wizard',   icon: '🤖', name: 'ML Wizard',         desc: 'Train your first ML model',             trigger: 'models_trained', threshold: 1  },
    { id: 'accuracy_ace',icon: '🎯', name: 'Accuracy Ace',      desc: 'Achieve 90%+ accuracy on any model',    trigger: 'best_accuracy',  threshold: 90 },
    { id: 'neural_arch', icon: '🧠', name: 'Neural Architect',  desc: 'Build and train a neural network',      trigger: 'nn_trained',   threshold: 1   },
    { id: 'vision_master',icon: '👁️',name: 'Vision Master',    desc: 'Classify your first image',             trigger: 'images_classified', threshold: 1},
    { id: 'nlp_lord',    icon: '💬', name: 'Language Lord',     desc: 'Analyze the sentiment of 5 texts',      trigger: 'sentiments_analyzed', threshold: 5},
    { id: 'rl_explorer', icon: '🎮', name: 'RL Explorer',       desc: 'Train your first RL agent',             trigger: 'agents_trained', threshold: 1  },
    { id: 'block_master',icon: '🧩', name: 'Block Master',      desc: 'Use 50 total blocks',                   trigger: 'blocks_used',  threshold: 50  },
    { id: 'speedrunner', icon: '⚡', name: 'Speed Runner',      desc: 'Complete a full ML pipeline in < 5 blocks', trigger: 'quick_pipeline', threshold: 1},
    { id: 'level_5',     icon: '⭐', name: 'Rising Star',       desc: 'Reach Level 5',                         trigger: 'level',        threshold: 5   },
    { id: 'level_10',    icon: '🌟', name: 'AI Champion',       desc: 'Reach Level 10',                        trigger: 'level',        threshold: 10  },
  ];

  // ── Mission Definitions ────────────────────────────────────────────────────
  const MISSIONS = [
    {
      id: 'mission_1',
      name: 'First Steps in AI',
      icon: '👶',
      description: 'Load a dataset and print a message to the console.',
      xpReward: 50,
      steps: [
        { desc: 'Load a dataset using the "load dataset" block', blockId: 'load_dataset', done: false },
        { desc: 'Print something using the "print" block', blockId: 'print', done: false },
      ]
    },
    {
      id: 'mission_2',
      name: 'My First Model',
      icon: '🤖',
      description: 'Build, train, and test your first KNN classifier!',
      xpReward: 100,
      steps: [
        { desc: 'Load the Iris Flowers dataset',        blockId: 'load_dataset', done: false },
        { desc: 'Split data into training & test sets', blockId: 'split_data',   done: false },
        { desc: 'Create a KNN classifier',              blockId: 'create_knn',   done: false },
        { desc: 'Train your model on the dataset',      blockId: 'train_model',  done: false },
        { desc: 'Show the accuracy of your model',      blockId: 'show_accuracy', done: false },
      ]
    },
    {
      id: 'mission_3',
      name: 'Deep Learning Debut',
      icon: '🧠',
      description: 'Build and train your first neural network!',
      xpReward: 200,
      steps: [
        { desc: 'Load a dataset',                       blockId: 'load_dataset',    done: false },
        { desc: 'Normalize your data',                  blockId: 'normalize_data',  done: false },
        { desc: 'Create a neural network',              blockId: 'create_nn',       done: false },
        { desc: 'Add a Dense layer',                    blockId: 'add_dense_layer', done: false },
        { desc: 'Compile the neural network',           blockId: 'compile_nn',      done: false },
        { desc: 'Train for at least 5 epochs',          blockId: 'train_nn',        done: false },
        { desc: 'Plot the training history',            blockId: 'plot_history',    done: false },
      ]
    },
    {
      id: 'mission_4',
      name: 'Vision Quest',
      icon: '👁️',
      description: 'Use computer vision to classify an image!',
      xpReward: 150,
      steps: [
        { desc: 'Load a sample image',                  blockId: 'load_sample_image', done: false },
        { desc: 'Display the image in the AI Stage',    blockId: 'show_image',        done: false },
        { desc: 'Classify the image with MobileNet',    blockId: 'classify_image',    done: false },
        { desc: 'Show the result card',                 blockId: 'show_result_card',  done: false },
      ]
    },
    {
      id: 'mission_5',
      name: 'Language Learner',
      icon: '💬',
      description: 'Explore Natural Language Processing techniques!',
      xpReward: 150,
      steps: [
        { desc: 'Tokenize a sentence into words',       blockId: 'tokenize_text',     done: false },
        { desc: 'Analyze the sentiment of a text',      blockId: 'analyze_sentiment', done: false },
        { desc: 'Show word frequency chart',            blockId: 'word_frequency',    done: false },
      ]
    },
    {
      id: 'mission_6',
      name: 'RL Pioneer',
      icon: '🎮',
      description: 'Create and train your first reinforcement learning agent!',
      xpReward: 250,
      steps: [
        { desc: 'Create an RL agent',                   blockId: 'create_agent',     done: false },
        { desc: 'Set up an environment',                blockId: 'set_env',          done: false },
        { desc: 'Define rewards for the agent',         blockId: 'set_reward',       done: false },
        { desc: 'Train the agent for 100+ episodes',    blockId: 'train_agent',      done: false },
        { desc: 'Visualize the agent navigating',       blockId: 'visualize_agent',  done: false },
      ]
    },
  ];

  // ── State ─────────────────────────────────────────────────────────────────
  let state = {
    xp: 0,
    level: 1,
    earnedBadges: [],
    completedMissions: [],
    missionProgress: {}, // missionId -> array of completed step indices
    stats: {
      run_count: 0,
      blocks_used: 0,
      models_trained: 0,
      datasets_loaded: 0,
      best_accuracy: 0,
      nn_trained: 0,
      images_classified: 0,
      sentiments_analyzed: 0,
      agents_trained: 0,
      quick_pipeline: 0,
    }
  };

  // ── Persistence ───────────────────────────────────────────────────────────
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
  }

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };
        state.stats = { ...state.stats, ...(parsed.stats || {}) };
        // Re-init mission progress if missing
        MISSIONS.forEach(m => {
          if (!state.missionProgress[m.id]) state.missionProgress[m.id] = [];
        });
      }
    } catch(e) { console.warn('Could not load save:', e); }
  }

  // ── Level Computation ──────────────────────────────────────────────────────
  function getLevelForXP(xp) {
    for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
      if (xp >= XP_PER_LEVEL[i]) return i + 1;
    }
    return 1;
  }

  function getXPForNextLevel(level) {
    return XP_PER_LEVEL[Math.min(level, XP_PER_LEVEL.length - 1)] || Infinity;
  }

  function getXPForCurrentLevel(level) {
    return XP_PER_LEVEL[Math.max(level - 1, 0)];
  }

  // ── XP Award ──────────────────────────────────────────────────────────────
  function awardXP(amount, reason) {
    if (!amount || amount <= 0) return;
    state.xp += amount;
    const newLevel = getLevelForXP(state.xp);
    const leveled = newLevel > state.level;
    if (leveled) {
      state.level = newLevel;
      NB.EVENTS.emit('levelup', { level: newLevel });
    }
    NB.EVENTS.emit('xp_changed', { xp: state.xp, level: state.level, gained: amount, reason });
    save();
    return { leveled, newLevel };
  }

  // ── Stat Tracking ─────────────────────────────────────────────────────────
  function trackStat(statName, value = 1) {
    if (!(statName in state.stats)) return;
    if (statName === 'best_accuracy') {
      state.stats[statName] = Math.max(state.stats[statName], value);
    } else {
      state.stats[statName] += value;
    }
    checkBadges();
    save();
  }

  // ── Badge Checking ─────────────────────────────────────────────────────────
  function checkBadges() {
    BADGES.forEach(badge => {
      if (state.earnedBadges.includes(badge.id)) return; // already earned

      let earned = false;
      const stat = state.stats[badge.trigger];

      if (badge.trigger === 'level') {
        earned = state.level >= badge.threshold;
      } else if (typeof stat !== 'undefined') {
        earned = stat >= badge.threshold;
      }

      if (earned) {
        state.earnedBadges.push(badge.id);
        NB.EVENTS.emit('badge_earned', badge);
        save();
      }
    });
  }

  // ── Mission Step Tracking ──────────────────────────────────────────────────
  function onBlockUsed(blockId) {
    state.stats.blocks_used++;

    MISSIONS.forEach(mission => {
      if (state.completedMissions.includes(mission.id)) return;

      const progress = state.missionProgress[mission.id] || [];

      mission.steps.forEach((step, idx) => {
        if (progress.includes(idx)) return; // already done
        if (step.blockId === blockId) {
          progress.push(idx);
          state.missionProgress[mission.id] = progress;
          NB.EVENTS.emit('mission_step', { mission, stepIdx: idx });

          // Check if mission complete
          if (progress.length >= mission.steps.length) {
            state.completedMissions.push(mission.id);
            awardXP(mission.xpReward, `Mission: ${mission.name}`);
            NB.EVENTS.emit('mission_complete', mission);
          }
        }
      });
    });
    checkBadges();
    save();
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  return {
    init() {
      load();
      // Initialize mission progress map
      MISSIONS.forEach(m => {
        if (!state.missionProgress[m.id]) state.missionProgress[m.id] = [];
      });
    },
    awardXP,
    trackStat,
    onBlockUsed,
    checkBadges,
    getState: () => ({ ...state }),
    getLevel: () => state.level,
    getXP: () => state.xp,
    getXPProgress() {
      const lvl = state.level;
      const cur = getXPForCurrentLevel(lvl);
      const next = getXPForNextLevel(lvl);
      const pct = next === Infinity ? 100 : Math.floor(((state.xp - cur) / (next - cur)) * 100);
      return { current: state.xp - cur, needed: next - cur, pct };
    },
    getMissions: () => MISSIONS.map(m => ({
      ...m,
      completed: state.completedMissions.includes(m.id),
      steps: m.steps.map((s, i) => ({
        ...s,
        done: (state.missionProgress[m.id] || []).includes(i),
      })),
    })),
    getBadges: () => BADGES.map(b => ({ ...b, earned: state.earnedBadges.includes(b.id) })),
    MISSIONS,
    BADGES,
    XP_PER_LEVEL,
  };
})();
