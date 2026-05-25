'use strict';
// ============================================================================
// Train Labs — Block Category and Block Definitions
// ============================================================================

window.NB = window.NB || {};

NB.CATEGORIES = [
  { id: 'data',    name: 'Data & Datasets',        icon: '🗄️',  color: '#8B5CF6', dark: '#6D28D9', desc: 'Load and prepare data for your AI' },
  { id: 'ml',      name: 'Machine Learning',       icon: '🤖',  color: '#3B82F6', dark: '#1D4ED8', desc: 'Classic ML algorithms' },
  { id: 'neural',  name: 'Neural Networks',        icon: '🧠',  color: '#10B981', dark: '#047857', desc: 'Build deep learning models' },
  { id: 'vision',  name: 'Computer Vision',        icon: '👁️',  color: '#F59E0B', dark: '#B45309', desc: 'Image and video AI' },
  { id: 'nlp',     name: 'Natural Language',       icon: '💬',  color: '#F97316', dark: '#C2410C', desc: 'Understand and generate text' },
  { id: 'rl',      name: 'Reinforcement Learning', icon: '🎮',  color: '#EF4444', dark: '#B91C1C', desc: 'Train agents through rewards' },
  { id: 'control', name: 'Logic & Control',        icon: '⚙️',  color: '#6B7280', dark: '#374151', desc: 'Control flow and variables' },
  { id: 'output',  name: 'Output & Viz',           icon: '📊',  color: '#06B6D4', dark: '#0E7490', desc: 'Charts, results, and visuals' },
];

// Block shapes:
//  hat     = starts a script (no top connector, rounded top)
//  stack   = connects above and below
//  cap     = ends a script (no bottom connector)
//  c-block = has an inner body stack (like if/loop)
//  reporter= returns a value (oval shape, fits inside other blocks)

NB.BLOCKS = [

  // ══════════════════════════════════════════════════════════════════
  // DATA & DATASETS
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'load_dataset', category: 'data', shape: 'stack',
    label: ['load dataset', { type: 'dropdown', name: 'dataset', options: ['Iris Flowers', 'Titanic Survival', 'House Prices', 'Spam Detector', 'MNIST Digits (100 samples)', 'Custom CSV'] }],
    tooltip: '📦 Loads a built-in dataset. "Iris Flowers" is perfect for beginners — 150 flower measurements with species labels!',
    xp: 10, level: 1,
  },
  {
    id: 'show_dataset', category: 'data', shape: 'stack',
    label: ['show dataset preview'],
    tooltip: '👀 Displays the first few rows of your dataset as a table in the AI Stage.',
    xp: 5, level: 1,
  },
  {
    id: 'split_data', category: 'data', shape: 'stack',
    label: ['split data', { type: 'dropdown', name: 'ratio', options: ['80% train / 20% test', '70% train / 30% test', '90% train / 10% test', '60% train / 40% test'] }],
    tooltip: '✂️ Splits your data into training and testing sets. Always test on data the model has never seen!',
    xp: 10, level: 1,
  },
  {
    id: 'normalize_data', category: 'data', shape: 'stack',
    label: ['normalize data to 0–1 range'],
    tooltip: '📏 Scales all numbers to be between 0 and 1. This helps AI learn faster and prevents one feature from dominating!',
    xp: 15, level: 2,
  },
  {
    id: 'shuffle_dataset', category: 'data', shape: 'stack',
    label: ['shuffle dataset'],
    tooltip: '🔀 Randomly shuffles the rows in your dataset. Prevents the model from learning the order instead of the patterns!',
    xp: 5, level: 2,
  },
  {
    id: 'filter_dataset', category: 'data', shape: 'stack',
    label: ['keep rows where', { type: 'text', name: 'col', default: 'class', width: 65 }, { type: 'dropdown', name: 'op', options: ['=', '≠', '>', '<'] }, { type: 'text', name: 'val', default: 'setosa', width: 65 }],
    tooltip: '🔍 Filters your dataset to only keep rows matching a condition.',
    xp: 15, level: 3,
  },
  {
    id: 'dataset_size', category: 'data', shape: 'reporter',
    label: ['dataset size'],
    tooltip: '🔢 Returns the number of rows in the current dataset.',
    xp: 5, level: 1,
  },

  // ══════════════════════════════════════════════════════════════════
  // MACHINE LEARNING
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'create_knn', category: 'ml', shape: 'stack',
    label: ['create KNN  k =', { type: 'number', name: 'k', default: 3, min: 1, max: 20 }, 'named', { type: 'text', name: 'model', default: 'myKNN', width: 70 }],
    tooltip: '🔵 K-Nearest Neighbors: predicts by finding the k most similar training examples and taking a vote. Great first model!',
    xp: 20, level: 1,
  },
  {
    id: 'create_decision_tree', category: 'ml', shape: 'stack',
    label: ['create decision tree named', { type: 'text', name: 'model', default: 'myTree', width: 75 }],
    tooltip: '🌳 Decision Tree: learns a series of yes/no questions from your data. Easy to understand and visualize!',
    xp: 20, level: 2,
  },
  {
    id: 'create_linear_reg', category: 'ml', shape: 'stack',
    label: ['create linear regression named', { type: 'text', name: 'model', default: 'myReg', width: 75 }],
    tooltip: '📈 Linear Regression: fits the best straight line through data points. Great for predicting numbers!',
    xp: 20, level: 2,
  },
  {
    id: 'train_model', category: 'ml', shape: 'stack',
    label: ['train', { type: 'text', name: 'model', default: 'myKNN', width: 70 }, 'on dataset'],
    tooltip: '🏋️ Trains your model! It reads all the training examples and learns the patterns.',
    xp: 25, level: 1,
  },
  {
    id: 'show_accuracy', category: 'ml', shape: 'stack',
    label: ['show accuracy of', { type: 'text', name: 'model', default: 'myKNN', width: 70 }],
    tooltip: '🎯 Tests your model on the test set (data it has NEVER seen) and shows the % of correct predictions.',
    xp: 20, level: 1,
  },
  {
    id: 'predict_ml', category: 'ml', shape: 'stack',
    label: ['predict using', { type: 'text', name: 'model', default: 'myKNN', width: 65 }, 'input', { type: 'text', name: 'input', default: '5.1,3.5,1.4,0.2', width: 130 }],
    tooltip: '🔮 Makes a single prediction! Enter comma-separated feature values matching your dataset.',
    xp: 15, level: 2,
  },
  {
    id: 'show_confusion_matrix', category: 'ml', shape: 'stack',
    label: ['show confusion matrix for', { type: 'text', name: 'model', default: 'myKNN', width: 70 }],
    tooltip: '📊 A grid showing correct vs incorrect predictions for each class. Great for understanding model mistakes!',
    xp: 25, level: 3,
  },
  {
    id: 'compare_models', category: 'ml', shape: 'stack',
    label: ['compare models', { type: 'text', name: 'm1', default: 'myKNN', width: 65 }, 'vs', { type: 'text', name: 'm2', default: 'myTree', width: 65 }],
    tooltip: '⚔️ Side-by-side accuracy comparison of two models. Which one learns better?',
    xp: 25, level: 3,
  },

  // ══════════════════════════════════════════════════════════════════
  // NEURAL NETWORKS
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'create_nn', category: 'neural', shape: 'stack',
    label: ['create neural network named', { type: 'text', name: 'model', default: 'myNN', width: 75 }],
    tooltip: '🧠 Creates a new empty neural network. You\'ll add layers to build its architecture!',
    xp: 20, level: 2,
  },
  {
    id: 'add_dense_layer', category: 'neural', shape: 'stack',
    label: ['add Dense layer to', { type: 'text', name: 'model', default: 'myNN', width: 55 }, 'neurons', { type: 'number', name: 'neurons', default: 64, min: 1, max: 512 }, 'activation', { type: 'dropdown', name: 'act', options: ['relu', 'sigmoid', 'tanh', 'softmax', 'linear'] }],
    tooltip: '🔲 Dense (fully-connected) layer: every neuron connects to all neurons in the next layer. The most common layer type!',
    xp: 15, level: 2,
  },
  {
    id: 'add_dropout', category: 'neural', shape: 'stack',
    label: ['add Dropout to', { type: 'text', name: 'model', default: 'myNN', width: 55 }, 'rate', { type: 'number', name: 'rate', default: 0.2, min: 0.01, max: 0.9, step: 0.05 }],
    tooltip: '💧 Dropout randomly switches off neurons during training. This prevents the model from "memorizing" and helps it generalize!',
    xp: 20, level: 3,
  },
  {
    id: 'compile_nn', category: 'neural', shape: 'stack',
    label: ['compile', { type: 'text', name: 'model', default: 'myNN', width: 55 }, 'loss', { type: 'dropdown', name: 'loss', options: ['categoricalCrossentropy', 'binaryCrossentropy', 'meanSquaredError', 'sparseCategoricalCrossentropy'] }, 'optimizer', { type: 'dropdown', name: 'opt', options: ['adam', 'sgd', 'rmsprop', 'adagrad'] }, 'lr', { type: 'number', name: 'lr', default: 0.001, min: 0.0001, max: 0.5, step: 0.0001 }],
    tooltip: '⚙️ Prepares the model for training. Loss = how we measure mistakes. Optimizer = how we fix them. Learning rate = how big our steps are.',
    xp: 20, level: 2,
  },
  {
    id: 'train_nn', category: 'neural', shape: 'stack',
    label: ['train', { type: 'text', name: 'model', default: 'myNN', width: 55 }, 'epochs', { type: 'number', name: 'epochs', default: 10, min: 1, max: 100 }, 'batch', { type: 'number', name: 'batch', default: 32, min: 4, max: 256 }],
    tooltip: '🏋️ Runs real neural network training! Each epoch = one full pass through all training data. Watch the loss decrease!',
    xp: 30, level: 2,
  },
  {
    id: 'plot_history', category: 'neural', shape: 'stack',
    label: ['plot training history of', { type: 'text', name: 'model', default: 'myNN', width: 75 }],
    tooltip: '📈 Shows loss and accuracy curves from training epochs. Did the model keep improving?',
    xp: 15, level: 2,
  },
  {
    id: 'predict_nn', category: 'neural', shape: 'stack',
    label: ['predict using', { type: 'text', name: 'model', default: 'myNN', width: 55 }, 'input', { type: 'text', name: 'input', default: '1,0,1,0', width: 110 }],
    tooltip: '🔮 Runs a forward pass through your trained neural network for a new input.',
    xp: 15, level: 3,
  },
  {
    id: 'show_model_summary', category: 'neural', shape: 'stack',
    label: ['show summary of', { type: 'text', name: 'model', default: 'myNN', width: 75 }],
    tooltip: '📋 Displays the layers, output shapes, and total parameter count of your neural network.',
    xp: 10, level: 2,
  },

  // ══════════════════════════════════════════════════════════════════
  // COMPUTER VISION
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'load_image_url', category: 'vision', shape: 'stack',
    label: ['load image from URL', { type: 'text', name: 'url', default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cute_dog.jpg/320px-Cute_dog.jpg', width: 200 }],
    tooltip: '🖼️ Loads an image from the internet to analyze with vision AI.',
    xp: 15, level: 3,
  },
  {
    id: 'load_sample_image', category: 'vision', shape: 'stack',
    label: ['load sample image', { type: 'dropdown', name: 'img', options: ['🐱 Cat', '🐶 Dog', '🚗 Car', '🌸 Flower', '🏠 House', '🦋 Butterfly'] }],
    tooltip: '📸 Loads a built-in sample image for testing computer vision.',
    xp: 10, level: 3,
  },
  {
    id: 'classify_image', category: 'vision', shape: 'stack',
    label: ['classify image using', { type: 'dropdown', name: 'model', options: ['MobileNet (fast)', 'EfficientNet (accurate)'] }],
    tooltip: '🏷️ Uses a pre-trained AI to identify what\'s in the image from 1000+ categories!',
    xp: 25, level: 3,
  },
  {
    id: 'detect_objects', category: 'vision', shape: 'stack',
    label: ['detect objects using COCO-SSD'],
    tooltip: '🔍 Finds objects in the image and draws bounding boxes around them (80 object types).',
    xp: 30, level: 4,
  },
  {
    id: 'apply_filter', category: 'vision', shape: 'stack',
    label: ['apply', { type: 'dropdown', name: 'filter', options: ['grayscale', 'sepia', 'invert', 'blur', 'brighten', 'high contrast'] }, 'filter'],
    tooltip: '🎨 Applies a visual transformation to the current image.',
    xp: 10, level: 3,
  },
  {
    id: 'show_image', category: 'vision', shape: 'stack',
    label: ['display image in AI Stage'],
    tooltip: '🖼️ Shows the currently loaded image in the output panel.',
    xp: 5, level: 3,
  },

  // ══════════════════════════════════════════════════════════════════
  // NATURAL LANGUAGE
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'analyze_sentiment', category: 'nlp', shape: 'stack',
    label: ['analyze sentiment of', { type: 'text', name: 'text', default: 'I love building AI projects!', width: 200 }],
    tooltip: '😊😐😢 Detects whether text is positive, negative, or neutral using NLP techniques.',
    xp: 20, level: 3,
  },
  {
    id: 'tokenize_text', category: 'nlp', shape: 'stack',
    label: ['tokenize', { type: 'text', name: 'text', default: 'Hello AI World', width: 160 }, 'into words'],
    tooltip: '✂️ Splits text into individual word tokens — the first step in almost every NLP pipeline!',
    xp: 10, level: 3,
  },
  {
    id: 'classify_spam', category: 'nlp', shape: 'stack',
    label: ['classify', { type: 'text', name: 'text', default: 'FREE PRIZE WINNER CLICK NOW', width: 180 }, 'as spam/ham'],
    tooltip: '📧 Uses rule-based NLP to detect whether a message looks like spam.',
    xp: 25, level: 4,
  },
  {
    id: 'word_frequency', category: 'nlp', shape: 'stack',
    label: ['show word frequency of', { type: 'text', name: 'text', default: 'the cat sat on the mat the cat', width: 200 }],
    tooltip: '📊 Counts and visualizes how often each word appears in the text.',
    xp: 15, level: 3,
  },
  {
    id: 'encode_text', category: 'nlp', shape: 'stack',
    label: ['encode', { type: 'text', name: 'text', default: 'Hello AI', width: 130 }, 'as numbers'],
    tooltip: '🔢 Converts each character to its numeric code — how text becomes data for neural networks!',
    xp: 15, level: 4,
  },

  // ══════════════════════════════════════════════════════════════════
  // REINFORCEMENT LEARNING
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'create_agent', category: 'rl', shape: 'stack',
    label: ['create RL agent named', { type: 'text', name: 'agent', default: 'myAgent', width: 85 }],
    tooltip: '🤖 Creates a Reinforcement Learning agent that learns by exploring and receiving rewards!',
    xp: 25, level: 4,
  },
  {
    id: 'set_env', category: 'rl', shape: 'stack',
    label: ['set environment to', { type: 'dropdown', name: 'env', options: ['Grid World 4×4', 'Maze 6×6', 'Cart-Pole', 'Mountain Car'] }],
    tooltip: '🌍 Sets the virtual environment where your agent will learn through trial and error.',
    xp: 15, level: 4,
  },
  {
    id: 'set_reward', category: 'rl', shape: 'stack',
    label: ['give', { type: 'text', name: 'agent', default: 'myAgent', width: 70 }, 'reward', { type: 'number', name: 'reward', default: 10, min: -100, max: 100 }, 'when', { type: 'dropdown', name: 'event', options: ['reaches goal', 'hits wall', 'falls off', 'takes a step'] }],
    tooltip: '🎁 Defines when your agent gets a reward (+) or penalty (-). Rewards teach the agent what to do!',
    xp: 20, level: 4,
  },
  {
    id: 'train_agent', category: 'rl', shape: 'stack',
    label: ['train', { type: 'text', name: 'agent', default: 'myAgent', width: 70 }, 'for', { type: 'number', name: 'episodes', default: 200, min: 10, max: 2000 }, 'episodes'],
    tooltip: '🏃 Runs many training episodes. The agent tries random actions at first, then gets smarter over time!',
    xp: 35, level: 4,
  },
  {
    id: 'visualize_agent', category: 'rl', shape: 'stack',
    label: ['show', { type: 'text', name: 'agent', default: 'myAgent', width: 70 }, 'navigating environment'],
    tooltip: '🎬 Animates the trained agent navigating through its environment using the learned policy.',
    xp: 15, level: 4,
  },

  // ══════════════════════════════════════════════════════════════════
  // LOGIC & CONTROL
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'when_run', category: 'control', shape: 'hat',
    label: ['🚀  when Run is clicked'],
    tooltip: '▶ This is the START of your program. Everything below runs when you click the Run button!',
    xp: 5, level: 1,
  },
  {
    id: 'repeat', category: 'control', shape: 'c-block',
    label: ['repeat', { type: 'number', name: 'times', default: 3, min: 1, max: 100 }, 'times'],
    tooltip: '🔁 Repeats all the blocks inside this loop the specified number of times.',
    xp: 10, level: 1,
  },
  {
    id: 'if_accuracy', category: 'control', shape: 'c-block',
    label: ['if last accuracy >', { type: 'number', name: 'threshold', default: 80, min: 0, max: 100 }, '%'],
    tooltip: '✅ Runs the inner blocks only if the last model accuracy was above your threshold.',
    xp: 15, level: 2,
  },
  {
    id: 'wait', category: 'control', shape: 'stack',
    label: ['wait', { type: 'number', name: 'secs', default: 1, min: 0.1, max: 10, step: 0.1 }, 'seconds'],
    tooltip: '⏱ Pauses your program for the given number of seconds.',
    xp: 5, level: 1,
  },
  {
    id: 'set_var', category: 'control', shape: 'stack',
    label: ['set variable', { type: 'text', name: 'name', default: 'myVar', width: 75 }, '=', { type: 'text', name: 'value', default: '0', width: 65 }],
    tooltip: '📦 Stores a value in a named variable for use later in your program.',
    xp: 10, level: 1,
  },
  {
    id: 'print', category: 'control', shape: 'stack',
    label: ['print', { type: 'text', name: 'msg', default: 'Hello, AI World! 🤖', width: 210 }],
    tooltip: '📋 Prints a message to the console output panel at the bottom right.',
    xp: 5, level: 1,
  },
  {
    id: 'stop_all', category: 'control', shape: 'cap',
    label: ['⛔ stop program'],
    tooltip: '🛑 Immediately stops all running blocks.',
    xp: 5, level: 1,
  },

  // ══════════════════════════════════════════════════════════════════
  // OUTPUT & VISUALIZATION
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'say', category: 'output', shape: 'stack',
    label: ['say', { type: 'text', name: 'msg', default: 'Hello! I am an AI! 🤖', width: 195 }, 'in AI Stage'],
    tooltip: '💬 Shows a message speech bubble in the AI Stage from the robot character.',
    xp: 5, level: 1,
  },
  {
    id: 'show_bar_chart', category: 'output', shape: 'stack',
    label: ['show bar chart of', { type: 'dropdown', name: 'data', options: ['class distribution', 'accuracy history', 'prediction confidence', 'feature means', 'word frequency'] }],
    tooltip: '📊 Creates a colorful bar chart in the AI Stage.',
    xp: 15, level: 1,
  },
  {
    id: 'show_scatter', category: 'output', shape: 'stack',
    label: ['scatter plot  x col', { type: 'number', name: 'x', default: 0, min: 0, max: 20 }, 'y col', { type: 'number', name: 'y', default: 1, min: 0, max: 20 }, 'color by label'],
    tooltip: '🔵 Shows a scatter plot of two features from your dataset, colored by label.',
    xp: 15, level: 2,
  },
  {
    id: 'celebrate', category: 'output', shape: 'stack',
    label: ['🎉  celebrate!'],
    tooltip: '🥳 Triggers a celebration animation when your AI succeeds! Use after a high-accuracy result!',
    xp: 5, level: 1,
  },
  {
    id: 'show_result_card', category: 'output', shape: 'stack',
    label: ['show last prediction as card'],
    tooltip: '🃏 Displays the most recent prediction result in a stylish card format.',
    xp: 10, level: 2,
  },
  {
    id: 'clear_stage', category: 'output', shape: 'stack',
    label: ['clear AI Stage'],
    tooltip: '🧹 Clears all output from the AI Stage area.',
    xp: 5, level: 1,
  },
  {
    id: 'play_sound', category: 'output', shape: 'stack',
    label: ['play sound', { type: 'dropdown', name: 'sound', options: ['success 🔔', 'error ❌', 'level up ⬆️', 'thinking 🤔', 'training 🏋️'] }],
    tooltip: '🔊 Plays a sound effect in the AI Stage.',
    xp: 5, level: 1,
  },
];

// ─── Helper: look up a block definition by id ────────────────────────────────
NB.getBlockDef = (id) => NB.BLOCKS.find(b => b.id === id);
NB.getCategoryDef = (id) => NB.CATEGORIES.find(c => c.id === id);
