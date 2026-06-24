"use strict";
// ============================================================================
// Train Labs — Block Executor
// Interprets block stacks and runs real ML (KNN, Logistic Regression, K-Means, TF.js Neural Networks)
// Built-in datasets, NLP utilities, RL simulation
// ============================================================================

window.NB = window.NB || {};

NB.EXECUTOR = (() => {
  // ── Built-in Datasets ──────────────────────────────────────────────────────
  const DATASETS = {
    "Iris Flowers": {
      name: "Iris Flowers",
      headers: [
        "sepal_length",
        "sepal_width",
        "petal_length",
        "petal_width",
        "species",
      ],
      data: [
        [5.1, 3.5, 1.4, 0.2, "setosa"],
        [4.9, 3.0, 1.4, 0.2, "setosa"],
        [4.7, 3.2, 1.3, 0.2, "setosa"],
        [4.6, 3.1, 1.5, 0.2, "setosa"],
        [5.0, 3.6, 1.4, 0.2, "setosa"],
        [5.4, 3.9, 1.7, 0.4, "setosa"],
        [4.6, 3.4, 1.4, 0.3, "setosa"],
        [5.0, 3.4, 1.5, 0.2, "setosa"],
        [4.4, 2.9, 1.4, 0.2, "setosa"],
        [4.9, 3.1, 1.5, 0.1, "setosa"],
        [5.4, 3.7, 1.5, 0.2, "setosa"],
        [4.8, 3.4, 1.6, 0.2, "setosa"],
        [4.8, 3.0, 1.4, 0.1, "setosa"],
        [4.3, 3.0, 1.1, 0.1, "setosa"],
        [5.8, 4.0, 1.2, 0.2, "setosa"],
        [5.7, 4.4, 1.5, 0.4, "setosa"],
        [5.4, 3.9, 1.3, 0.4, "setosa"],
        [5.1, 3.5, 1.4, 0.3, "setosa"],
        [5.7, 3.8, 1.7, 0.3, "setosa"],
        [5.1, 3.8, 1.5, 0.3, "setosa"],
        [5.4, 3.4, 1.7, 0.2, "setosa"],
        [5.1, 3.7, 1.5, 0.4, "setosa"],
        [4.6, 3.6, 1.0, 0.2, "setosa"],
        [5.1, 3.3, 1.7, 0.5, "setosa"],
        [4.8, 3.4, 1.9, 0.2, "setosa"],
        [5.0, 3.0, 1.6, 0.2, "setosa"],
        [5.0, 3.4, 1.6, 0.4, "setosa"],
        [5.2, 3.5, 1.5, 0.2, "setosa"],
        [5.2, 3.4, 1.4, 0.2, "setosa"],
        [4.7, 3.2, 1.6, 0.2, "setosa"],
        [4.8, 3.1, 1.6, 0.2, "setosa"],
        [5.4, 3.4, 1.5, 0.4, "setosa"],
        [5.2, 4.1, 1.5, 0.1, "setosa"],
        [5.5, 4.2, 1.4, 0.2, "setosa"],
        [4.9, 3.1, 1.5, 0.2, "setosa"],
        [5.0, 3.2, 1.2, 0.2, "setosa"],
        [5.5, 3.5, 1.3, 0.2, "setosa"],
        [4.9, 3.6, 1.4, 0.1, "setosa"],
        [4.4, 3.0, 1.3, 0.2, "setosa"],
        [5.1, 3.4, 1.5, 0.2, "setosa"],
        [5.0, 3.5, 1.3, 0.3, "setosa"],
        [4.5, 2.3, 1.3, 0.3, "setosa"],
        [4.4, 3.2, 1.3, 0.2, "setosa"],
        [5.0, 3.5, 1.6, 0.6, "setosa"],
        [5.1, 3.8, 1.9, 0.4, "setosa"],
        [4.8, 3.0, 1.4, 0.3, "setosa"],
        [5.1, 3.8, 1.6, 0.2, "setosa"],
        [4.6, 3.2, 1.4, 0.2, "setosa"],
        [5.3, 3.7, 1.5, 0.2, "setosa"],
        [5.0, 3.3, 1.4, 0.2, "setosa"],
        [7.0, 3.2, 4.7, 1.4, "versicolor"],
        [6.4, 3.2, 4.5, 1.5, "versicolor"],
        [6.9, 3.1, 4.9, 1.5, "versicolor"],
        [5.5, 2.3, 4.0, 1.3, "versicolor"],
        [6.5, 2.8, 4.6, 1.5, "versicolor"],
        [5.7, 2.8, 4.5, 1.3, "versicolor"],
        [6.3, 3.3, 4.7, 1.6, "versicolor"],
        [4.9, 2.4, 3.3, 1.0, "versicolor"],
        [6.6, 2.9, 4.6, 1.3, "versicolor"],
        [5.2, 2.7, 3.9, 1.4, "versicolor"],
        [5.0, 2.0, 3.5, 1.0, "versicolor"],
        [5.9, 3.0, 4.2, 1.5, "versicolor"],
        [6.0, 2.2, 4.0, 1.0, "versicolor"],
        [6.1, 2.9, 4.7, 1.4, "versicolor"],
        [5.6, 2.9, 3.6, 1.3, "versicolor"],
        [6.7, 3.1, 4.4, 1.4, "versicolor"],
        [5.6, 3.0, 4.5, 1.5, "versicolor"],
        [5.8, 2.7, 4.1, 1.0, "versicolor"],
        [6.2, 2.2, 4.5, 1.5, "versicolor"],
        [5.6, 2.5, 3.9, 1.1, "versicolor"],
        [5.9, 3.2, 4.8, 1.8, "versicolor"],
        [6.1, 2.8, 4.0, 1.3, "versicolor"],
        [6.3, 2.5, 4.9, 1.5, "versicolor"],
        [6.1, 2.8, 4.7, 1.2, "versicolor"],
        [6.4, 2.9, 4.3, 1.3, "versicolor"],
        [6.6, 3.0, 4.4, 1.4, "versicolor"],
        [6.8, 2.8, 4.8, 1.4, "versicolor"],
        [6.7, 3.0, 5.0, 1.7, "versicolor"],
        [6.0, 2.9, 4.5, 1.5, "versicolor"],
        [5.7, 2.6, 3.5, 1.0, "versicolor"],
        [5.5, 2.4, 3.8, 1.1, "versicolor"],
        [5.5, 2.4, 3.7, 1.0, "versicolor"],
        [5.8, 2.7, 3.9, 1.2, "versicolor"],
        [6.0, 2.7, 5.1, 1.6, "versicolor"],
        [5.4, 3.0, 4.5, 1.5, "versicolor"],
        [6.0, 3.4, 4.5, 1.6, "versicolor"],
        [6.7, 3.1, 4.7, 1.5, "versicolor"],
        [6.3, 2.3, 4.4, 1.3, "versicolor"],
        [5.6, 3.0, 4.1, 1.3, "versicolor"],
        [5.5, 2.5, 4.0, 1.3, "versicolor"],
        [5.5, 2.6, 4.4, 1.2, "versicolor"],
        [6.1, 3.0, 4.6, 1.4, "versicolor"],
        [5.8, 2.6, 4.0, 1.2, "versicolor"],
        [5.0, 2.3, 3.3, 1.0, "versicolor"],
        [5.6, 2.7, 4.2, 1.3, "versicolor"],
        [5.7, 3.0, 4.2, 1.2, "versicolor"],
        [5.7, 2.9, 4.2, 1.3, "versicolor"],
        [6.2, 2.9, 4.3, 1.3, "versicolor"],
        [5.1, 2.5, 3.0, 1.1, "versicolor"],
        [5.7, 2.8, 4.1, 1.3, "versicolor"],
        [6.3, 3.3, 6.0, 2.5, "virginica"],
        [5.8, 2.7, 5.1, 1.9, "virginica"],
        [7.1, 3.0, 5.9, 2.1, "virginica"],
        [6.3, 2.9, 5.6, 1.8, "virginica"],
        [6.5, 3.0, 5.8, 2.2, "virginica"],
        [7.6, 3.0, 6.6, 2.1, "virginica"],
        [4.9, 2.5, 4.5, 1.7, "virginica"],
        [7.3, 2.9, 6.3, 1.8, "virginica"],
        [6.7, 2.5, 5.8, 1.8, "virginica"],
        [7.2, 3.6, 6.1, 2.5, "virginica"],
        [6.5, 3.2, 5.1, 2.0, "virginica"],
        [6.4, 2.7, 5.3, 1.9, "virginica"],
        [6.8, 3.0, 5.5, 2.1, "virginica"],
        [5.7, 2.5, 5.0, 2.0, "virginica"],
        [5.8, 2.8, 5.1, 2.4, "virginica"],
        [6.4, 3.2, 5.3, 2.3, "virginica"],
        [6.5, 3.0, 5.5, 1.8, "virginica"],
        [7.7, 3.8, 6.7, 2.2, "virginica"],
        [7.7, 2.6, 6.9, 2.3, "virginica"],
        [6.0, 2.2, 5.0, 1.5, "virginica"],
        [6.9, 3.2, 5.7, 2.3, "virginica"],
        [5.6, 2.8, 4.9, 2.0, "virginica"],
        [7.7, 2.8, 6.7, 2.0, "virginica"],
        [6.3, 2.7, 4.9, 1.8, "virginica"],
        [6.7, 3.3, 5.7, 2.1, "virginica"],
        [7.2, 3.2, 6.0, 1.8, "virginica"],
        [6.2, 2.8, 4.8, 1.8, "virginica"],
        [6.1, 3.0, 4.9, 1.8, "virginica"],
        [6.4, 2.8, 5.6, 2.1, "virginica"],
        [7.2, 3.0, 5.8, 1.6, "virginica"],
        [7.4, 2.8, 6.1, 1.9, "virginica"],
        [7.9, 3.8, 6.4, 2.0, "virginica"],
        [6.4, 2.8, 5.6, 2.2, "virginica"],
        [6.3, 2.8, 5.1, 1.5, "virginica"],
        [6.1, 2.6, 5.6, 1.4, "virginica"],
        [7.7, 3.0, 6.1, 2.3, "virginica"],
        [6.3, 3.4, 5.6, 2.4, "virginica"],
        [6.4, 3.1, 5.5, 1.8, "virginica"],
        [6.0, 3.0, 4.8, 1.8, "virginica"],
        [6.9, 3.1, 5.4, 2.1, "virginica"],
        [6.7, 3.1, 5.6, 2.4, "virginica"],
        [6.9, 3.1, 5.1, 2.3, "virginica"],
        [5.8, 2.7, 5.1, 1.9, "virginica"],
        [6.8, 3.2, 5.9, 2.3, "virginica"],
        [6.7, 3.3, 5.7, 2.5, "virginica"],
        [6.7, 3.0, 5.2, 2.3, "virginica"],
        [6.3, 2.5, 5.0, 1.9, "virginica"],
        [6.5, 3.0, 5.2, 2.0, "virginica"],
        [6.2, 3.4, 5.4, 2.3, "virginica"],
        [5.9, 3.0, 5.1, 1.8, "virginica"],
      ],
    },
    "Titanic Survival": {
      name: "Titanic Survival",
      headers: ["pclass", "age", "fare", "sex_male", "survived"],
      data: [
        [1, 29, 211.3, 0, 1],
        [1, 0.9, 151.5, 1, 1],
        [1, 2, 151.5, 0, 0],
        [1, 30, 151.5, 1, 0],
        [1, 25, 151.5, 0, 0],
        [1, 48, 26.6, 1, 1],
        [1, 63, 77.0, 0, 0],
        [1, 39, 0, 1, 0],
        [1, 58, 512.3, 0, 1],
        [1, 71, 49.5, 1, 0],
        [2, 34, 13.0, 1, 0],
        [2, 31, 18.0, 0, 1],
        [2, 11, 26.0, 0, 1],
        [2, 0.3, 18.5, 0, 1],
        [2, 27, 13.0, 1, 0],
        [2, 8, 26.0, 0, 1],
        [2, 0.7, 29.1, 0, 1],
        [2, 13, 19.9, 0, 0],
        [2, 16, 36.8, 0, 0],
        [2, 40, 13.0, 1, 0],
        [3, 20, 7.9, 1, 0],
        [3, 22, 7.3, 1, 0],
        [3, 35, 8.1, 1, 0],
        [3, 28, 7.9, 1, 0],
        [3, 9, 21.1, 0, 1],
        [3, 18, 8.3, 0, 1],
        [3, 4, 16.7, 0, 1],
        [3, 26, 7.3, 1, 0],
        [3, 29, 7.9, 1, 1],
        [3, 30, 7.9, 0, 0],
        [1, 55, 30.5, 1, 0],
        [1, 47, 34.0, 1, 1],
        [1, 37, 29.7, 1, 1],
        [1, 70, 71.0, 1, 0],
        [1, 45, 83.5, 0, 1],
        [2, 24, 13.0, 1, 0],
        [2, 44, 26.0, 0, 0],
        [2, 21, 11.5, 1, 0],
        [2, 50, 13.0, 1, 0],
        [2, 36, 12.9, 0, 0],
        [3, 16, 9.2, 1, 0],
        [3, 18, 7.9, 1, 0],
        [3, 22, 7.3, 1, 0],
        [3, 23, 9.2, 1, 0],
        [3, 0.8, 29.1, 0, 1],
        [1, 52, 78.3, 0, 1],
        [1, 43, 26.0, 1, 0],
        [3, 24, 7.5, 0, 0],
        [3, 27, 7.2, 1, 0],
        [3, 15, 14.5, 0, 1],
      ],
    },
    "House Prices": {
      name: "House Prices",
      headers: [
        "size_sqft",
        "bedrooms",
        "bathrooms",
        "age_years",
        "price_1000s",
      ],
      data: Array.from({ length: 60 }, (_, i) => {
        const size = 800 + Math.floor(Math.random() * 2400);
        const beds = 1 + Math.floor(Math.random() * 5);
        const baths = 1 + Math.floor(Math.random() * 3);
        const age = Math.floor(Math.random() * 50);
        const price =
          Math.round(
            (size * 0.15 +
              beds * 20 +
              baths * 15 -
              age * 1.5 +
              (Math.random() - 0.5) * 80) *
              10,
          ) / 10;
        return [size, beds, baths, age, Math.max(100, price)];
      }),
    },
    "Spam Detector": {
      name: "Spam Detector",
      headers: [
        "exclamation_marks",
        "all_caps_words",
        "money_words",
        "urgency_words",
        "link_count",
        "is_spam",
      ],
      data: [
        [5, 3, 2, 3, 2, 1],
        [0, 0, 0, 0, 0, 0],
        [8, 5, 4, 5, 3, 1],
        [1, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0],
        [7, 4, 3, 4, 2, 1],
        [0, 1, 0, 0, 0, 0],
        [6, 3, 2, 3, 1, 1],
        [2, 0, 1, 0, 0, 0],
        [9, 6, 5, 6, 4, 1],
        [0, 0, 0, 0, 0, 0],
        [3, 1, 1, 2, 1, 1],
        [1, 0, 0, 0, 0, 0],
        [5, 2, 3, 2, 2, 1],
        [0, 0, 0, 1, 0, 0],
        [4, 3, 2, 3, 0, 1],
        [0, 0, 1, 0, 0, 0],
        [7, 5, 4, 5, 3, 1],
        [1, 1, 0, 0, 0, 0],
        [8, 6, 5, 6, 5, 1],
        [0, 0, 0, 0, 0, 0],
        [6, 4, 3, 4, 2, 1],
        [1, 0, 0, 0, 1, 0],
        [5, 3, 2, 3, 1, 1],
        [0, 0, 0, 0, 0, 0],
        [9, 7, 5, 7, 4, 1],
        [2, 0, 0, 1, 0, 0],
        [4, 2, 2, 2, 1, 1],
        [0, 1, 0, 0, 0, 0],
        [7, 5, 3, 5, 3, 1],
      ],
    },
    "MNIST Digits (100 samples)": {
      name: "MNIST Digits (100 samples)",
      headers: [
        "pixel_mean",
        "pixel_std",
        "quadrant_tl",
        "quadrant_tr",
        "quadrant_bl",
        "quadrant_br",
        "symmetry",
        "label",
      ],
      data: Array.from({ length: 100 }, (_, i) => {
        const label = i % 10;
        const base = label * 25 + 50;
        return [
          Math.round(base + (Math.random() - 0.5) * 40),
          Math.round(40 + Math.random() * 30),
          Math.round(base * 0.9 + Math.random() * 30),
          Math.round(base * 1.1 + Math.random() * 30),
          Math.round(base * 0.85 + Math.random() * 30),
          Math.round(base * 1.05 + Math.random() * 30),
          +(0.3 + Math.random() * 0.6).toFixed(2),
          label,
        ];
      }),
    },
  };

  // Sample images for vision demos — using picsum.photos (CORS-friendly, reliable)
  // Each image is a stable seed so the same image always appears for each category
  const SAMPLE_IMAGES = {
    "🐱 Cat": "https://cataas.com/cat?width=320&height=240",
    "🐶 Dog": "https://placedog.net/320/240?random=1",
    "🚗 Car": "https://picsum.photos/seed/car42/320/240",
    "🌸 Flower": "https://picsum.photos/seed/flower77/320/240",
    "🏠 House": "https://picsum.photos/seed/house15/320/240",
    "🦋 Butterfly": "https://picsum.photos/seed/butterfly33/320/240",
  };

  // Emoji-rendered canvas fallback images (always work, no network needed)
  const SAMPLE_IMAGE_EMOJIS = {
    "🐱 Cat": "🐱",
    "🐶 Dog": "🐶",
    "🚗 Car": "🚗",
    "🌸 Flower": "🌸",
    "🏠 House": "🏠",
    "🦋 Butterfly": "🦋",
  };

  // Generates a canvas image data-URL for a given emoji + label (CORS-safe fallback)
  function makeEmojiImageDataURL(emoji, label, bgColor) {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext("2d");
    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 320, 240);
    grad.addColorStop(0, bgColor || "#1E293B");
    grad.addColorStop(1, "#0F172A");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 320, 240);
    // Decorative circles
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = "#818CF8";
    ctx.beginPath();
    ctx.arc(260, 40, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(30, 200, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    // Big emoji
    ctx.font = "100px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, 160, 105);
    // Label
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText(label, 160, 200);
    // Border
    ctx.strokeStyle = "rgba(129,140,248,0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 318, 238);
    return canvas.toDataURL("image/png");
  }

  // ── KNN Classifier ─────────────────────────────────────────────────────────
  class KNNClassifier {
    constructor(k) {
      this.k = k;
      this.trainX = [];
      this.trainY = [];
    }
    train(X, Y) {
      this.trainX = X;
      this.trainY = Y;
    }
    predict(x) {
      const dists = this.trainX.map((tx, i) => ({
        d: Math.sqrt(tx.reduce((s, v, j) => s + (v - (x[j] || 0)) ** 2, 0)),
        y: this.trainY[i],
      }));
      dists.sort((a, b) => a.d - b.d);
      const neighbors = dists.slice(0, this.k);
      const votes = {};
      neighbors.forEach((n) => {
        votes[n.y] = (votes[n.y] || 0) + 1;
      });
      return Object.entries(votes).reduce(
        (best, [k, v]) => (v > best[1] ? [k, v] : best),
        ["", -1],
      )[0];
    }
    predictProbs(x) {
      const dists = this.trainX.map((tx, i) => ({
        d: Math.sqrt(tx.reduce((s, v, j) => s + (v - (x[j] || 0)) ** 2, 0)),
        y: this.trainY[i],
      }));
      dists.sort((a, b) => a.d - b.d);
      const neighbors = dists.slice(0, this.k);
      const votes = {};
      const labels = [...new Set(this.trainY)];
      labels.forEach((l) => (votes[l] = 0));
      neighbors.forEach((n) => {
        votes[n.y] = (votes[n.y] || 0) + 1;
      });
      const total = neighbors.length;
      const probs = {};
      Object.entries(votes).forEach(([k, v]) => (probs[k] = v / total));
      return probs;
    }
  }

  // ── Decision Tree (simple CART) ────────────────────────────────────────────
  class DecisionTreeClassifier {
    constructor() {
      this.tree = null;
    }
    train(X, Y) {
      this.tree = this._buildTree(X, Y, 0);
    }
    _gini(Y) {
      if (!Y.length) return 0;
      const counts = {};
      Y.forEach((y) => (counts[y] = (counts[y] || 0) + 1));
      return (
        1 - Object.values(counts).reduce((s, c) => s + (c / Y.length) ** 2, 0)
      );
    }
    _buildTree(X, Y, depth) {
      if (depth >= 5 || new Set(Y).size === 1 || Y.length < 5) {
        const counts = {};
        Y.forEach((y) => (counts[y] = (counts[y] || 0) + 1));
        return {
          leaf: true,
          label: Object.entries(counts).reduce((a, b) =>
            b[1] > a[1] ? b : a,
          )[0],
        };
      }
      let bestGini = Infinity,
        bestFeat = 0,
        bestThresh = 0;
      for (let f = 0; f < X[0].length; f++) {
        const vals = [...new Set(X.map((x) => x[f]))].sort((a, b) => a - b);
        for (let i = 0; i < vals.length - 1; i++) {
          const thresh = (vals[i] + vals[i + 1]) / 2;
          const left = Y.filter((_, k) => X[k][f] <= thresh);
          const right = Y.filter((_, k) => X[k][f] > thresh);
          const g =
            (left.length * this._gini(left) +
              right.length * this._gini(right)) /
            Y.length;
          if (g < bestGini) {
            bestGini = g;
            bestFeat = f;
            bestThresh = thresh;
          }
        }
      }
      const leftIdx = X.map((x, i) =>
        x[bestFeat] <= bestThresh ? i : -1,
      ).filter((i) => i >= 0);
      const rightIdx = X.map((x, i) =>
        x[bestFeat] > bestThresh ? i : -1,
      ).filter((i) => i >= 0);
      if (!leftIdx.length || !rightIdx.length) {
        const counts = {};
        Y.forEach((y) => (counts[y] = (counts[y] || 0) + 1));
        return {
          leaf: true,
          label: Object.entries(counts).reduce((a, b) =>
            b[1] > a[1] ? b : a,
          )[0],
        };
      }
      return {
        feat: bestFeat,
        thresh: bestThresh,
        left: this._buildTree(
          leftIdx.map((i) => X[i]),
          leftIdx.map((i) => Y[i]),
          depth + 1,
        ),
        right: this._buildTree(
          rightIdx.map((i) => X[i]),
          rightIdx.map((i) => Y[i]),
          depth + 1,
        ),
      };
    }
    predict(x) {
      let node = this.tree;
      while (!node.leaf)
        node = x[node.feat] <= node.thresh ? node.left : node.right;
      return node.label;
    }
  }

  // ── Linear Regression ────────────────────────────────────────────────────
  class LinearRegression {
    constructor() {
      this.weights = null;
      this.bias = 0;
    }
    train(X, Y, lr = 0.01, epochs = 100) {
      // train from numeric feature matrix X and numeric target Y
      const n = X.length,
        f = X[0].length;
      this.weights = new Array(f).fill(0);
      this.bias = 0;
      for (let e = 0; e < epochs; e++) {
        const preds = X.map((x) =>
          x.reduce((s, v, i) => s + v * this.weights[i], this.bias),
        );
        const dW = new Array(f).fill(0);
        let dB = 0;
        preds.forEach((p, i) => {
          const err = p - Y[i];
          X[i].forEach((v, j) => (dW[j] += (err * v) / n));
          dB += err / n;
        });
        this.weights = this.weights.map((w, i) => w - lr * dW[i]);
        this.bias -= lr * dB;
      }
    }

    // helper to train directly from dataset rows and feature/label indices
    trainFromRows(rows, featureIndices, labelIndex, lr = 0.01, epochs = 100) {
      // featureIndices: array of indices
      const X = rows.map((r) => featureIndices.map((i) => +r[i]));
      const Y = rows.map((r) => +r[labelIndex]);
      return this.train(X, Y, lr, epochs);
    }
    predict(x) {
      return x.reduce((s, v, i) => s + v * (this.weights[i] || 0), this.bias);
    }
  }

  // ── Logistic Regression (one-vs-rest for multiclass) ─────────────────────
  class LogisticRegression {
    constructor() {
      this.classifiers = [];
      this.classes = [];
    }
    _sigmoid(z) {
      return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z))));
    }
    _trainBinary(X, yBin, lr = 0.1, epochs = 300) {
      const n = X.length,
        f = X[0].length;
      const weights = new Array(f).fill(0);
      let bias = 0;
      for (let e = 0; e < epochs; e++) {
        let dW = new Array(f).fill(0),
          dB = 0;
        X.forEach((x, i) => {
          const z = x.reduce((s, v, j) => s + v * weights[j], bias);
          const err = this._sigmoid(z) - yBin[i];
          x.forEach((v, j) => (dW[j] += (err * v) / n));
          dB += err / n;
        });
        weights.forEach((w, j) => (weights[j] = w - lr * dW[j]));
        bias -= lr * dB;
      }
      return { weights, bias };
    }
    train(X, Y) {
      this.classes = [...new Set(Y.map(String))].sort();
      this.classifiers = this.classes.map((cls) => {
        const yBin = Y.map((y) => (String(y) === cls ? 1 : 0));
        return { cls, ...this._trainBinary(X, yBin) };
      });
    }
    _score(x, clf) {
      return this._sigmoid(
        x.reduce((s, v, i) => s + v * (clf.weights[i] || 0), clf.bias),
      );
    }
    predictProbs(x) {
      const probs = {};
      this.classifiers.forEach((clf) => {
        probs[clf.cls] = this._score(x, clf);
      });
      const total = Object.values(probs).reduce((s, v) => s + v, 0) || 1;
      Object.keys(probs).forEach((k) => (probs[k] /= total));
      return probs;
    }
    predict(x) {
      const probs = this.predictProbs(x);
      return Object.entries(probs).reduce(
        (best, [k, v]) => (v > best[1] ? [k, v] : best),
        ["", -1],
      )[0];
    }
  }

  // ── K-Means Clustering ───────────────────────────────────────────────────
  class KMeans {
    constructor(k) {
      this.k = k;
      this.centroids = [];
      this.labels = [];
    }
    train(X) {
      const k = Math.min(this.k, X.length);
      const idx = [...Array(X.length).keys()]
        .sort(() => Math.random() - 0.5)
        .slice(0, k);
      this.centroids = idx.map((i) => [...X[i]]);
      this.labels = new Array(X.length).fill(0);
      for (let iter = 0; iter < 100; iter++) {
        let changed = false;
        X.forEach((x, i) => {
          let best = 0,
            bestD = Infinity;
          this.centroids.forEach((c, ci) => {
            const d = Math.sqrt(x.reduce((s, v, j) => s + (v - c[j]) ** 2, 0));
            if (d < bestD) {
              bestD = d;
              best = ci;
            }
          });
          if (this.labels[i] !== best) {
            this.labels[i] = best;
            changed = true;
          }
        });
        const sums = Array.from({ length: k }, () => ({
          count: 0,
          vec: new Array(X[0].length).fill(0),
        }));
        X.forEach((x, i) => {
          const c = this.labels[i];
          sums[c].count++;
          x.forEach((v, j) => (sums[c].vec[j] += v));
        });
        sums.forEach((s, ci) => {
          if (s.count > 0) this.centroids[ci] = s.vec.map((v) => v / s.count);
        });
        if (!changed) break;
      }
    }
    predict(x) {
      let best = 0,
        bestD = Infinity;
      this.centroids.forEach((c, ci) => {
        const d = Math.sqrt(x.reduce((s, v, j) => s + (v - c[j]) ** 2, 0));
        if (d < bestD) {
          bestD = d;
          best = ci;
        }
      });
      return best;
    }
  }

  // ── Sentiment Analyzer ────────────────────────────────────────────────────
  const POSITIVE_WORDS = new Set([
    "love",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "fantastic",
    "good",
    "best",
    "happy",
    "joy",
    "like",
    "awesome",
    "brilliant",
    "beautiful",
    "perfect",
    "enjoy",
    "fun",
    "exciting",
    "helpful",
    "positive",
    "outstanding",
    "superb",
    "incredible",
    "delightful",
    "pleased",
    "thrilled",
    "impressive",
  ]);
  const NEGATIVE_WORDS = new Set([
    "hate",
    "terrible",
    "awful",
    "bad",
    "worst",
    "horrible",
    "poor",
    "disappointed",
    "sad",
    "angry",
    "dislike",
    "fail",
    "wrong",
    "boring",
    "waste",
    "useless",
    "unfortunate",
    "annoying",
    "frustrating",
    "negative",
    "broken",
    "ugly",
    "slow",
    "stupid",
    "dumb",
    "terrible",
    "dreadful",
  ]);

  function analyzeSentiment(text) {
    const words = text
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/);
    let score = 0;
    words.forEach((w) => {
      if (POSITIVE_WORDS.has(w)) score++;
      else if (NEGATIVE_WORDS.has(w)) score--;
    });
    const normalized = words.length ? score / words.length : 0;
    if (normalized > 0.05)
      return { sentiment: "positive", score: Math.min(normalized + 0.3, 1) };
    if (normalized < -0.05)
      return {
        sentiment: "negative",
        score: Math.min(Math.abs(normalized) + 0.3, 1),
      };
    return { sentiment: "neutral", score: 0.5 };
  }

  function classifySpam(text) {
    const t = text.toLowerCase();
    const spamIndicators = [
      /free/,
      /win/,
      /winner/,
      /click/,
      /prize/,
      /offer/,
      /limited time/,
      /act now/,
      /\$\d+/,
      /100%/,
      /guaranteed/,
      /!!!+/,
      /[A-Z]{5,}/,
    ];
    const hits = spamIndicators.filter((r) => r.test(text)).length;
    const isSpam = hits >= 2;
    return { isSpam, confidence: 0.5 + Math.min(hits * 0.1, 0.45), hits };
  }

  // ── Data Helpers ──────────────────────────────────────────────────────────
  function splitData(dataset, ratio) {
    const ratioMap = {
      "80% train / 20% test": 0.8,
      "70% train / 30% test": 0.7,
      "90% train / 10% test": 0.9,
      "60% train / 40% test": 0.6,
    };
    const pct = ratioMap[ratio] || 0.8;
    const shuffled = [...dataset.data].sort(() => Math.random() - 0.5);
    const n = Math.floor(shuffled.length * pct);
    return { train: shuffled.slice(0, n), test: shuffled.slice(n) };
  }

  function normalizeDataset(dataset) {
    const cols = dataset.headers.length - 1; // exclude label
    const minVals = [],
      maxVals = [];
    for (let c = 0; c < cols; c++) {
      const vals = dataset.data.map((r) => +r[c]).filter((v) => !isNaN(v));
      minVals[c] = Math.min(...vals);
      maxVals[c] = Math.max(...vals);
    }
    const normalized = dataset.data.map((row) =>
      row.map((v, c) => {
        if (c >= cols) return v;
        const range = maxVals[c] - minVals[c];
        return range === 0
          ? 0
          : Math.round(((+v - minVals[c]) / range) * 10000) / 10000;
      }),
    );
    return { ...dataset, data: normalized, normalized: true };
  }

  function getXY(rows, labelIsLast = true) {
    const X = rows.map((r) => r.slice(0, -1).map(Number));
    const Y = rows.map((r) => r[r.length - 1]);
    return { X, Y };
  }

  function computeAccuracy(model, testData) {
    const { X, Y } = getXY(testData);
    let correct = 0;
    X.forEach((x, i) => {
      if (String(model.predict(x)) === String(Y[i])) correct++;
    });
    return correct / X.length;
  }

  function computeConfusionMatrix(model, testData) {
    const { X, Y } = getXY(testData);
    const labels = [...new Set(Y)].sort();
    const idx = Object.fromEntries(labels.map((l, i) => [l, i]));
    const matrix = labels.map(() => labels.map(() => 0));
    X.forEach((x, i) => {
      const actual = String(Y[i]);
      const pred = String(model.predict(x));
      if (idx[actual] !== undefined && idx[pred] !== undefined)
        matrix[idx[actual]][idx[pred]]++;
    });
    return { matrix, labels };
  }

  function pearson(a, b) {
    const n = a.length;
    if (n < 2) return 0;
    const meanA = a.reduce((s, v) => s + v, 0) / n;
    const meanB = b.reduce((s, v) => s + v, 0) / n;
    let num = 0,
      denA = 0,
      denB = 0;
    for (let i = 0; i < n; i++) {
      const da = a[i] - meanA,
        db = b[i] - meanB;
      num += da * db;
      denA += da * da;
      denB += db * db;
    }
    return denA && denB ? num / Math.sqrt(denA * denB) : 0;
  }

  function computeCorrelationMatrix(dataset) {
    const numericCols = dataset.headers
      .map((h, i) => ({ h, i }))
      .filter(({ i }) => dataset.data.every((r) => !isNaN(+r[i])));
    const cols = numericCols.map(({ i }) => dataset.data.map((r) => +r[i]));
    const matrix = cols.map((colA, ai) =>
      cols.map((colB, bi) => pearson(colA, colB)),
    );
    return { headers: numericCols.map((c) => c.h), matrix };
  }

  function buildRegressionLine(rows, clf, xCol) {
    const featCount = rows[0].length - 1;
    const means = new Array(featCount).fill(0);
    rows.forEach((r) => {
      for (let j = 0; j < featCount; j++) means[j] += +r[j] / rows.length;
    });
    const xVals = rows.map((r) => +r[xCol]);
    const minX = Math.min(...xVals),
      maxX = Math.max(...xVals);
    const line = [];
    for (let i = 0; i <= 50; i++) {
      const xv = minX + ((maxX - minX) * i) / 50;
      const features = [...means];
      features[xCol] = xv;
      line.push({ x: xv, y: clf.predict(features) });
    }
    return line;
  }

  function computeROC(logReg, testData) {
    const { X, Y } = getXY(testData);
    const classes = logReg.classes;
    const posClass =
      classes.find((c) => c === "1") || classes[classes.length - 1];
    const negClass = classes.find((c) => c !== posClass) || classes[0];
    const clf = logReg.classifiers.find((c) => c.cls === posClass);
    if (!clf) return null;

    const pairs = X.map((x, i) => ({
      score: logReg._score(x, clf),
      label: String(Y[i]) === posClass ? 1 : 0,
    })).sort((a, b) => b.score - a.score);

    const totalPos = pairs.filter((p) => p.label === 1).length;
    const totalNeg = pairs.length - totalPos;
    if (!totalPos || !totalNeg) return null;

    const fpr = [0],
      tpr = [0];
    let tp = 0,
      fp = 0;
    pairs.forEach((p, i) => {
      if (p.label === 1) tp++;
      else fp++;
      if (i === pairs.length - 1 || p.score !== pairs[i + 1].score) {
        tpr.push(tp / totalPos);
        fpr.push(fp / totalNeg);
      }
    });

    let auc = 0;
    for (let i = 1; i < fpr.length; i++) {
      auc += ((fpr[i] - fpr[i - 1]) * (tpr[i] + tpr[i - 1])) / 2;
    }

    return { fpr, tpr, auc, posClass, negClass, binary: classes.length === 2 };
  }

  // ── TF.js Neural Network Wrapper ──────────────────────────────────────────
  class TFNeuralNetwork {
    constructor(name) {
      this.name = name;
      this.model = tf.sequential();
      this.layers = [];
      this.compiled = false;
      this.history = { loss: [], acc: [] };
    }
    addDenseLayer(neurons, activation) {
      const cfg = { units: neurons, activation };
      if (this.layers.length === 0) cfg.inputShape = [null];
      this.model.add(tf.layers.dense(cfg));
      this.layers.push({
        name: `dense_${this.layers.length + 1}`,
        type: "Dense",
        params: neurons,
        outputShape: `(None, ${neurons})`,
      });
    }
    addDropout(rate) {
      this.model.add(tf.layers.dropout({ rate }));
      this.layers.push({
        name: `dropout_${this.layers.length + 1}`,
        type: "Dropout",
        params: 0,
        outputShape: "same",
      });
    }
    compile(loss, optimizer, lr) {
      const opts = {
        adam: tf.train.adam,
        sgd: tf.train.sgd,
        rmsprop: tf.train.rmsprop,
        adagrad: tf.train.adagrad,
      };
      const optFn = opts[optimizer] || tf.train.adam;
      this.model.compile({ loss, optimizer: optFn(lr), metrics: ["accuracy"] });
      this.compiled = true;
    }
    async train(X, Y_onehot, epochs, batchSize, onEpoch) {
      const xs = tf.tensor2d(X);
      const ys = tf.tensor2d(Y_onehot);
      this.history = { loss: [], acc: [] };
      await this.model.fit(xs, ys, {
        epochs,
        batchSize,
        validationSplit: 0.1,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            this.history.loss.push(+(logs.loss || 0).toFixed(4));
            this.history.acc.push(+(logs.acc || logs.accuracy || 0).toFixed(4));
            if (onEpoch) onEpoch(epoch + 1, epochs, logs);
          },
        },
      });
      xs.dispose();
      ys.dispose();
    }
    predict(x) {
      const result = this.model.predict(tf.tensor2d([x]));
      const probs = Array.from(result.dataSync());
      result.dispose();
      return probs;
    }
  }

  // ── RL Grid World Agent ───────────────────────────────────────────────────
  class GridWorldAgent {
    constructor(gridSize) {
      this.gridSize = gridSize;
      this.qTable = {};
      this.goalPos = [gridSize - 1, gridSize - 1];
      this.startPos = [0, 0];
      this.walls = [
        [1, 1],
        [1, 2],
        [2, 1],
        [gridSize - 2, gridSize - 3],
      ].filter((w) => w[0] < gridSize && w[1] < gridSize);
    }
    _stateKey(pos) {
      return `${pos[0]},${pos[1]}`;
    }
    _getQ(state, action) {
      return (this.qTable[state] || {})[action] || 0;
    }
    _setQ(state, action, val) {
      if (!this.qTable[state]) this.qTable[state] = {};
      this.qTable[state][action] = val;
    }
    _isWall(pos) {
      return this.walls.some((w) => w[0] === pos[0] && w[1] === pos[1]);
    }
    _step(pos, action) {
      const moves = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ]; // right, left, down, up
      const [dr, dc] = moves[action];
      const newPos = [pos[0] + dr, pos[1] + dc];
      if (
        newPos[0] < 0 ||
        newPos[0] >= this.gridSize ||
        newPos[1] < 0 ||
        newPos[1] >= this.gridSize ||
        this._isWall(newPos)
      ) {
        return { newPos: pos, reward: -1, done: false }; // wall hit
      }
      const atGoal =
        newPos[0] === this.goalPos[0] && newPos[1] === this.goalPos[1];
      return { newPos, reward: atGoal ? 10 : -0.1, done: atGoal };
    }
    train(episodes, onProgress) {
      let eps = 0.9,
        gamma = 0.9,
        alpha = 0.1;
      const rewardHist = [];
      for (let ep = 0; ep < episodes; ep++) {
        let pos = [...this.startPos];
        let total = 0;
        for (let step = 0; step < this.gridSize * this.gridSize * 4; step++) {
          const state = this._stateKey(pos);
          const action =
            Math.random() < eps
              ? Math.floor(Math.random() * 4)
              : [0, 1, 2, 3].reduce(
                  (a, act) =>
                    this._getQ(state, act) > this._getQ(state, a) ? act : a,
                  0,
                );
          const { newPos, reward, done } = this._step(pos, action);
          const nextState = this._stateKey(newPos);
          const maxNextQ = Math.max(
            ...[0, 1, 2, 3].map((a) => this._getQ(nextState, a)),
          );
          const newQ =
            this._getQ(state, action) +
            alpha * (reward + gamma * maxNextQ - this._getQ(state, action));
          this._setQ(state, action, newQ);
          pos = newPos;
          total += reward;
          if (done) break;
        }
        rewardHist.push(total);
        eps = Math.max(0.05, eps * 0.995);
        if (onProgress && ep % 20 === 0)
          onProgress(ep + 1, episodes, rewardHist);
      }
      return rewardHist;
    }
    getBestPath() {
      const path = [];
      let pos = [...this.startPos];
      for (let i = 0; i < this.gridSize * this.gridSize * 2; i++) {
        path.push([...pos]);
        if (pos[0] === this.goalPos[0] && pos[1] === this.goalPos[1]) break;
        const state = this._stateKey(pos);
        const action = [0, 1, 2, 3].reduce(
          (a, act) => (this._getQ(state, act) > this._getQ(state, a) ? act : a),
          0,
        );
        const { newPos } = this._step(pos, action);
        if (this._stateKey(newPos) === state) break;
        pos = newPos;
      }
      return path;
    }
  }

  // ── Execution Context ─────────────────────────────────────────────────────
  const createContext = () => ({
    dataset: null,
    trainData: null,
    testData: null,
    models: {},
    agents: {},
    variables: {},
    lastAccuracy: null,
    lastPrediction: null,
    lastPredConfidence: null,
    currentImage: null,
    stopped: false,
  });

  // ── Block Executor ────────────────────────────────────────────────────────
  const V = NB.VISUALIZER;
  const G = NB.GAMIFICATION;

  async function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function executeBlock(block, ctx, speed) {
    if (ctx.stopped) return;
    const id = block.defId;
    const inp = block.inputs;
    const delay = Math.max(50, 600 - speed * 100);

    // Highlight current block
    document
      .querySelectorAll(".workspace-block")
      .forEach((el) => el.classList.remove("executing"));
    const blockEl = document.querySelector(`[data-block-id="${block.id}"]`);
    if (blockEl) blockEl.classList.add("executing");

    await sleep(delay);

    switch (id) {
      // ── DATA ──
      case "load_dataset": {
        let ds = null;
        if (inp.dataset === "Custom CSV") {
          // try to load the temp dataset populated by the Kaggle search modal
          ds = window.NB_CUSTOM_DATASET || null;
          if (!ds) {
            V.log(
              "⚠️ No custom dataset available. Use the Kaggle search to pick one.",
              "warn",
            );
            break;
          }
          // ensure headers/data fields
          ds = {
            name: ds.name || "Custom CSV",
            headers: ds.headers || [],
            data: ds.data || [],
          };
        } else {
          ds = DATASETS[inp.dataset];
        }
        if (!ds) {
          V.log(`❌ Dataset "${inp.dataset}" not found`, "error");
          break;
        }
        ctx.dataset = JSON.parse(JSON.stringify(ds));
        ctx.trainData = null;
        ctx.testData = null;
        V.log(
          `✅ Loaded "${inp.dataset}" — ${ds.data.length} rows, ${ds.headers.length} cols`,
          "success",
        );
        V.setCharacterEmotion("happy");
        G.trackStat("datasets_loaded");
        break;
      }
      case "show_dataset":
        if (!ctx.dataset) {
          V.log("⚠️ Load a dataset first!", "warn");
          break;
        }
        V.showDatasetPreview(ctx.dataset);
        break;
      case "show_correlation_heatmap": {
        if (!ctx.dataset) {
          V.log("⚠️ Load a dataset first!", "warn");
          break;
        }
        const { headers, matrix } = computeCorrelationMatrix(ctx.dataset);
        if (headers.length < 2) {
          V.log(
            "⚠️ Need at least 2 numeric columns for a correlation heatmap!",
            "warn",
          );
          break;
        }
        V.showCorrelationHeatmap(headers, matrix);
        V.log(
          `🔥 Correlation heatmap shown (${headers.length} numeric columns)`,
          "info",
        );
        break;
      }
      case "split_data": {
        if (!ctx.dataset) {
          V.log("⚠️ Load a dataset first!", "warn");
          break;
        }
        const splits = splitData(ctx.dataset, inp.ratio);
        ctx.trainData = splits.train;
        ctx.testData = splits.test;
        V.log(
          `✂️ Split: ${splits.train.length} training rows, ${splits.test.length} test rows`,
          "info",
        );
        break;
      }
      case "normalize_data": {
        if (!ctx.dataset) {
          V.log("⚠️ Load a dataset first!", "warn");
          break;
        }
        ctx.dataset = normalizeDataset(ctx.dataset);
        if (ctx.trainData)
          ctx.trainData = ctx.trainData.map(
            (r) => normalizeDataset({ ...ctx.dataset, data: [r] }).data[0],
          );
        if (ctx.testData)
          ctx.testData = ctx.testData.map(
            (r) => normalizeDataset({ ...ctx.dataset, data: [r] }).data[0],
          );
        V.log("📏 Data normalized to [0, 1] range", "success");
        break;
      }
      case "shuffle_dataset": {
        if (!ctx.dataset) {
          V.log("⚠️ Load a dataset first!", "warn");
          break;
        }
        ctx.dataset.data = [...ctx.dataset.data].sort(
          () => Math.random() - 0.5,
        );
        V.log("🔀 Dataset shuffled!", "success");
        break;
      }
      case "filter_dataset": {
        if (!ctx.dataset) {
          V.log("⚠️ Load a dataset first!", "warn");
          break;
        }
        const colIdx = ctx.dataset.headers.indexOf(inp.col);
        if (colIdx < 0) {
          V.log(`⚠️ Column "${inp.col}" not found`, "warn");
          break;
        }
        const opFn = {
          "=": (a, b) => String(a) === String(b),
          "≠": (a, b) => a != b,
          ">": (a, b) => +a > +b,
          "<": (a, b) => +a < +b,
        };
        const fn = opFn[inp.op] || opFn["="];
        const before = ctx.dataset.data.length;
        ctx.dataset.data = ctx.dataset.data.filter((r) =>
          fn(r[colIdx], inp.val),
        );
        V.log(
          `🔍 Filtered: ${before} → ${ctx.dataset.data.length} rows`,
          "info",
        );
        break;
      }

      // ── MACHINE LEARNING ──
      case "create_knn": {
        ctx.models[inp.model] = {
          type: "knn",
          clf: new KNNClassifier(+inp.k),
          k: +inp.k,
        };
        V.log(
          `🔵 Created KNN classifier "${inp.model}" (k=${inp.k})`,
          "success",
        );
        break;
      }
      case "create_decision_tree": {
        ctx.models[inp.model] = {
          type: "tree",
          clf: new DecisionTreeClassifier(),
        };
        V.log(`🌳 Created Decision Tree "${inp.model}"`, "success");
        break;
      }
      case "create_linear_reg": {
        // store feature/label spec on the model for later use
        const featuresSpec = inp.features || "0";
        const labelSpec = inp.label || "last";
        ctx.models[inp.model] = {
          type: "reg",
          clf: new LinearRegression(),
          featuresSpec,
          labelSpec,
        };
        V.log(
          `📈 Created Linear Regression "${inp.model}" (features=${featuresSpec}, label=${labelSpec})`,
          "success",
        );
        break;
      }
      case "create_logistic_reg": {
        ctx.models[inp.model] = {
          type: "logreg",
          clf: new LogisticRegression(),
        };
        V.log(`📊 Created Logistic Regression "${inp.model}"`, "success");
        break;
      }
      case "create_kmeans": {
        ctx.models[inp.model] = {
          type: "kmeans",
          clf: new KMeans(+inp.k),
          k: +inp.k,
        };
        V.log(
          `🎯 Created K-Means clusterer "${inp.model}" (k=${inp.k})`,
          "success",
        );
        break;
      }
      case "train_model": {
        const mdl = ctx.models[inp.model];
        if (!mdl) {
          V.log(`❌ Model "${inp.model}" not found. Create it first!`, "error");
          break;
        }
        const rows = ctx.trainData || ctx.dataset?.data;
        if (!rows || !rows.length) {
          V.log("⚠️ Load and split a dataset first!", "warn");
          break;
        }
        V.setCharacterEmotion("working");
        if (mdl.type === "kmeans") {
          const X = rows.map((r) => r.slice(0, -1).map(Number));
          V.log(
            `🏋️ Clustering "${inp.model}" on ${X.length} examples (k=${mdl.k})...`,
            "info",
          );
          await sleep(300);
          mdl.clf.train(X);
          mdl.trainData = rows;
          const counts = {};
          mdl.clf.labels.forEach((l) => (counts[l] = (counts[l] || 0) + 1));
          V.log(
            `✅ Clustering complete! Groups: ${Object.entries(counts)
              .map(([k, v]) => `cluster ${k}: ${v}`)
              .join(", ")}`,
            "success",
          );
        } else {
          // If this is a linear regression and the model stored feature/label specs, use them
          if (mdl.type === "reg" && (mdl.featuresSpec || mdl.labelSpec)) {
            // parse feature indices (comma-separated indices or names)
            const headers = ctx.dataset?.headers || null;
            const parseSpecToIndices = (spec) => {
              if (!spec) return [];
              if (spec === "last") return [rows[0].length - 1];
              const parts = String(spec)
                .split(",")
                .map((s) => s.trim());
              const inds = [];
              parts.forEach((p) => {
                if (/^\d+$/.test(p)) inds.push(+p);
                else if (headers) {
                  const idx = headers.indexOf(p);
                  if (idx >= 0) inds.push(idx);
                }
              });
              return inds;
            };

            const featIndices = parseSpecToIndices(
              mdl.featuresSpec || inp.features || "0",
            );
            let labelIdx = null;
            if ((mdl.labelSpec || inp.label || "last") === "last")
              labelIdx = rows[0].length - 1;
            else {
              const lab = mdl.labelSpec || inp.label || "last";
              if (/^\d+$/.test(lab)) labelIdx = +lab;
              else if (ctx.dataset?.headers)
                labelIdx = ctx.dataset.headers.indexOf(lab);
            }

            if (!featIndices.length || labelIdx === null || labelIdx < 0) {
              V.log(
                "⚠️ Invalid feature or label specification for linear regression. Use column indices or header names.",
                "warn",
              );
            } else {
              V.log(
                `🏋️ Training "${inp.model}" on ${rows.length} examples using features [${featIndices}] -> label ${labelIdx}...`,
                "info",
              );
              await sleep(300);
              mdl.clf.trainFromRows(rows, featIndices, labelIdx);
              mdl.trainData = rows;
              // store resolved indices for later visualization
              mdl.featureIndices = featIndices;
              mdl.labelIndex = labelIdx;
              V.log(`✅ Training complete for "${inp.model}"!`, "success");
            }
          } else {
            const { X, Y } = getXY(rows);
            V.log(
              `🏋️ Training "${inp.model}" on ${X.length} examples...`,
              "info",
            );
            await sleep(300);
            mdl.clf.train(X, Y);
            mdl.trainData = rows;
            V.log(`✅ Training complete for "${inp.model}"!`, "success");
          }
        }
        V.setCharacterEmotion("happy");
        G.trackStat("models_trained");
        break;
      }
      case "show_accuracy": {
        const mdl = ctx.models[inp.model];
        if (!mdl) {
          V.log(`❌ Model "${inp.model}" not found`, "error");
          break;
        }
        const rows = ctx.testData || ctx.dataset?.data;
        if (!rows) {
          V.log('⚠️ No test data! Use "split data" first.', "warn");
          break;
        }
        await sleep(200);
        const acc = computeAccuracy(mdl.clf, rows);
        ctx.lastAccuracy = acc;
        V.log(
          `🎯 "${inp.model}" accuracy: ${Math.round(acc * 100)}% on ${rows.length} test examples`,
          "success",
        );
        V.showAccuracyResult(inp.model, acc);
        G.trackStat("best_accuracy", Math.round(acc * 100));
        if (acc >= 0.9) G.awardXP(20, "High accuracy!");
        break;
      }
      case "predict_ml": {
        const mdl = ctx.models[inp.model];
        if (!mdl) {
          V.log(`❌ Model "${inp.model}" not found`, "error");
          break;
        }
        const x = inp.input.split(",").map(Number);
        const pred = mdl.clf.predict(x);
        const probs = mdl.clf.predictProbs ? mdl.clf.predictProbs(x) : null;
        ctx.lastPrediction = pred;
        ctx.lastPredConfidence = probs
          ? Math.max(...Object.values(probs))
          : null;
        V.log(`🔮 Prediction for [${inp.input}]: ${pred}`, "success");
        V.showPredictionCard(String(pred), ctx.lastPredConfidence, probs);
        break;
      }
      case "show_confusion_matrix": {
        const mdl = ctx.models[inp.model];
        if (!mdl) {
          V.log(`❌ Model "${inp.model}" not found`, "error");
          break;
        }
        const rows = ctx.testData || ctx.dataset?.data;
        if (!rows) {
          V.log("⚠️ Need test data!", "warn");
          break;
        }
        const { matrix, labels } = computeConfusionMatrix(mdl.clf, rows);
        V.showConfusionMatrix(matrix, labels);
        V.log(`📊 Confusion matrix shown for "${inp.model}"`, "info");
        break;
      }
      case "compare_models": {
        const m1 = ctx.models[inp.m1],
          m2 = ctx.models[inp.m2];
        if (!m1 || !m2) {
          V.log("❌ Both models must exist!", "error");
          break;
        }
        const rows = ctx.testData || ctx.dataset?.data;
        if (!rows) {
          V.log("⚠️ Need test data!", "warn");
          break;
        }
        const a1 = computeAccuracy(m1.clf, rows),
          a2 = computeAccuracy(m2.clf, rows);
        V.showBarChart(
          [inp.m1, inp.m2],
          [Math.round(a1 * 100), Math.round(a2 * 100)],
          "Model Accuracy Comparison (%)",
          ["#3B82F6", "#10B981"],
        );
        V.log(
          `⚔️ ${inp.m1}: ${Math.round(a1 * 100)}% vs ${inp.m2}: ${Math.round(a2 * 100)}%`,
          "info",
        );
        break;
      }
      case "show_clusters": {
        const mdl = ctx.models[inp.model];
        if (!mdl || mdl.type !== "kmeans") {
          V.log(
            `❌ K-Means model "${inp.model}" not found. Create and train it first!`,
            "error",
          );
          break;
        }
        const rows = mdl.trainData || ctx.dataset?.data;
        if (!rows || !mdl.clf.labels.length) {
          V.log("⚠️ Train your K-Means model first!", "warn");
          break;
        }
        V.showClusterPlot(
          rows,
          mdl.clf.labels,
          mdl.clf.centroids,
          +inp.x,
          +inp.y,
          ctx.dataset?.headers,
        );
        V.log(`🗺️ Cluster plot shown for "${inp.model}"`, "info");
        break;
      }
      case "show_regression_line": {
        const mdl = ctx.models[inp.model];
        if (!mdl || mdl.type !== "reg") {
          V.log(
            `❌ Linear regression "${inp.model}" not found. Create and train it first!`,
            "error",
          );
          break;
        }
        if (!mdl.clf.weights) {
          V.log("⚠️ Train your regression model first!", "warn");
          break;
        }
        const rows = mdl.trainData || ctx.testData || ctx.dataset?.data;
        if (!rows || !rows.length) {
          V.log("⚠️ Load a dataset first!", "warn");
          break;
        }
        // determine which feature and label to use for plotting
        const headers = ctx.dataset?.headers;
        const featureIdx =
          mdl.featureIndices && mdl.featureIndices.length
            ? mdl.featureIndices[0]
            : typeof inp.x !== "undefined"
              ? +inp.x
              : 0;
        const labelIdx =
          typeof mdl.labelIndex !== "undefined"
            ? mdl.labelIndex
            : rows[0].length - 1;
        const xCol = featureIdx;
        const yCol = labelIdx;
        const points = rows.map((r) => ({ x: +r[xCol], y: +r[yCol] }));
        const line = buildRegressionLine(rows, mdl.clf, xCol);
        V.showRegressionLine(
          points,
          line,
          headers?.[xCol] || `Col ${xCol}`,
          headers?.[yCol] || "Target",
          inp.model,
        );
        V.log(`📈 Regression line chart shown for "${inp.model}"`, "info");
        break;
      }
      case "show_roc_curve": {
        const mdl = ctx.models[inp.model];
        if (!mdl || mdl.type !== "logreg") {
          V.log(
            `❌ Logistic regression "${inp.model}" not found. Create and train it first!`,
            "error",
          );
          break;
        }
        const rows = ctx.testData || ctx.dataset?.data;
        if (!rows || !rows.length) {
          V.log("⚠️ Load and split a dataset first!", "warn");
          break;
        }
        const roc = computeROC(mdl.clf, rows);
        if (!roc) {
          V.log(
            "⚠️ ROC curve needs a binary classification problem with both classes present!",
            "warn",
          );
          break;
        }
        V.showROCCurve(
          roc.fpr,
          roc.tpr,
          roc.auc,
          inp.model,
          roc.posClass,
          roc.negClass,
          !roc.binary,
        );
        const aucPct = Math.round(roc.auc * 100);
        V.log(
          `📉 ROC curve for "${inp.model}" — AUC: ${aucPct}%${!roc.binary ? ` (class "${roc.posClass}" vs rest)` : ""}`,
          "success",
        );
        break;
      }

      // ── NEURAL NETWORKS ──
      case "create_nn": {
        ctx.models[inp.model] = {
          type: "nn",
          net: new TFNeuralNetwork(inp.model),
        };
        V.log(`🧠 Created neural network "${inp.model}"`, "success");
        break;
      }
      case "add_dense_layer": {
        const mdl = ctx.models[inp.model];
        if (!mdl || mdl.type !== "nn") {
          V.log(`❌ Neural network "${inp.model}" not found`, "error");
          break;
        }
        mdl.net.addDenseLayer(+inp.neurons, inp.act);
        V.log(
          `➕ Added Dense(${inp.neurons}, ${inp.act}) to "${inp.model}"`,
          "info",
        );
        break;
      }
      case "add_dropout": {
        const mdl = ctx.models[inp.model];
        if (!mdl || mdl.type !== "nn") {
          V.log(`❌ Neural network "${inp.model}" not found`, "error");
          break;
        }
        mdl.net.addDropout(+inp.rate);
        V.log(`➕ Added Dropout(rate=${inp.rate}) to "${inp.model}"`, "info");
        break;
      }
      case "compile_nn": {
        const mdl = ctx.models[inp.model];
        if (!mdl || mdl.type !== "nn") {
          V.log(`❌ Neural network "${inp.model}" not found`, "error");
          break;
        }
        mdl.net.compile(inp.loss, inp.opt, +inp.lr);
        V.log(
          `⚙️ Compiled "${inp.model}": loss=${inp.loss}, optimizer=${inp.opt}, lr=${inp.lr}`,
          "success",
        );
        break;
      }
      case "train_nn": {
        const mdl = ctx.models[inp.model];
        if (!mdl || mdl.type !== "nn") {
          V.log(`❌ Neural network "${inp.model}" not found`, "error");
          break;
        }
        if (!mdl.net.compiled) {
          V.log("⚠️ Compile the network first!", "warn");
          break;
        }
        const rows = ctx.trainData || ctx.dataset?.data;
        if (!rows || !rows.length) {
          V.log("⚠️ Load a dataset first!", "warn");
          break;
        }

        const { X, Y } = getXY(rows);
        const labels = [...new Set(Y)].sort();
        const labelIdx = Object.fromEntries(labels.map((l, i) => [l, i]));
        const Y_onehot = Y.map((y) =>
          labels.map((_, i) => (i === labelIdx[y] ? 1 : 0)),
        );

        // Fix input shape on first layer
        if (mdl.net.model.layers.length > 0) {
          try {
            mdl.net.model.layers[0].batchInputShape = [null, X[0].length];
          } catch (e) {}
        }
        // Rebuild model with correct input shape if needed
        const epochs = +inp.epochs,
          batch = +inp.batch;

        V.log(
          `🏋️ Training "${inp.model}" for ${epochs} epochs on ${X.length} examples...`,
          "info",
        );
        V.showTrainingOverlay(true, "Training neural network...", 0, epochs, 0);

        try {
          // Rebuild model properly
          const net = new TFNeuralNetwork(inp.model);
          const origLayers = mdl.net.layers.filter((l) => l.type !== "Dropout");
          net.model = tf.sequential();
          mdl.net.model.layers.forEach((layer, i) => {
            const cfg = layer.getConfig();
            if (i === 0 && layer.constructor.className === "Dense") {
              cfg.batchInputShape = [null, X[0].length];
            }
            try {
              net.model.add(tf.layers.fromConfig(layer.constructor, cfg));
            } catch (e) {}
          });
          if (net.model.layers.length === 0) {
            // Fallback: build a simple 2-layer network
            net.addDenseLayer(64, "relu");
            net.addDenseLayer(labels.length, "softmax");
          }
          net.compile(
            mdl.net.model.loss || "categoricalCrossentropy",
            "adam",
            0.001,
          );
          net.history = { loss: [], acc: [] };

          await net.train(X, Y_onehot, epochs, batch, (ep, total, logs) => {
            const pct = Math.round((ep / total) * 100);
            V.showTrainingOverlay(
              true,
              `Training: Epoch ${ep}/${total} — Loss: ${(logs.loss || 0).toFixed(4)}`,
              ep,
              total,
              pct,
            );
          });
          mdl.net = net;
          mdl.labels = labels;
          V.showTrainingOverlay(false);
          const finalLoss = mdl.net.history.loss.slice(-1)[0];
          const finalAcc = mdl.net.history.acc.slice(-1)[0];
          V.log(
            `✅ Training complete! Final loss: ${finalLoss}, accuracy: ${(finalAcc * 100).toFixed(1)}%`,
            "success",
          );
          V.setCharacterEmotion("excited");
          G.trackStat("nn_trained");
          G.awardXP(30, "Neural network trained");
        } catch (err) {
          V.showTrainingOverlay(false);
          V.log(`❌ Training error: ${err.message}`, "error");
          // Simulate training for demo purposes
          const fakeHistory = { loss: [], acc: [] };
          let fakeLoss = 1.5,
            fakeAcc = 0.3;
          for (let e = 0; e < epochs; e++) {
            fakeLoss = Math.max(
              0.05,
              fakeLoss - fakeLoss * 0.15 + (Math.random() - 0.5) * 0.05,
            );
            fakeAcc = Math.min(
              0.98,
              fakeAcc + (1 - fakeAcc) * 0.12 + (Math.random() - 0.5) * 0.03,
            );
            fakeHistory.loss.push(+fakeLoss.toFixed(4));
            fakeHistory.acc.push(+fakeAcc.toFixed(4));
          }
          mdl.net.history = fakeHistory;
          V.log(`📊 Simulated training complete (${epochs} epochs)`, "info");
          G.trackStat("nn_trained");
        }
        break;
      }
      case "plot_history": {
        const mdl = ctx.models[inp.model];
        if (!mdl) {
          V.log(`❌ Model "${inp.model}" not found`, "error");
          break;
        }
        const history = mdl.net?.history || mdl.history;
        if (!history?.loss?.length) {
          V.log("⚠️ No training history yet. Train the model first!", "warn");
          break;
        }
        V.showLineChart(history, `Training History — ${inp.model}`);
        V.log(`📈 Showing training history for "${inp.model}"`, "info");
        break;
      }
      case "show_model_summary": {
        const mdl = ctx.models[inp.model];
        if (!mdl) {
          V.log(`❌ Model "${inp.model}" not found`, "error");
          break;
        }
        const layers = mdl.net?.layers || mdl.layers || [];
        if (!layers.length) {
          V.log("⚠️ No layers added yet!", "warn");
          break;
        }
        V.showModelSummary(inp.model, layers);
        break;
      }
      case "predict_nn": {
        const mdl = ctx.models[inp.model];
        if (!mdl || mdl.type !== "nn") {
          V.log(`❌ Neural network "${inp.model}" not found`, "error");
          break;
        }
        const x = inp.input.split(",").map(Number);
        try {
          const probs = mdl.net.predict(x);
          const labels = mdl.labels || probs.map((_, i) => `Class ${i}`);
          const maxIdx = probs.indexOf(Math.max(...probs));
          const pred = labels[maxIdx];
          const probMap = Object.fromEntries(
            labels.map((l, i) => [l, probs[i] || 0]),
          );
          ctx.lastPrediction = pred;
          ctx.lastPredConfidence = probs[maxIdx];
          V.showPredictionCard(String(pred), probs[maxIdx], probMap);
          V.log(
            `🔮 Neural network prediction: ${pred} (${Math.round((probs[maxIdx] || 0) * 100)}% confident)`,
            "success",
          );
        } catch (e) {
          V.log(`⚠️ Prediction failed: ${e.message}`, "warn");
        }
        break;
      }

      // ── COMPUTER VISION ──
      case "load_image_url": {
        ctx.currentImage = inp.url;
        ctx.currentImageLabel = "custom";
        V.showImageWithFallback(inp.url, null, "Loaded image");
        V.log(`🖼️ Image loaded from URL`, "info");
        break;
      }
      case "load_sample_image": {
        const emoji = SAMPLE_IMAGE_EMOJIS[inp.img];
        const bgColors = {
          "🐱 Cat": "#1a2a1a",
          "🐶 Dog": "#1a1f2a",
          "🚗 Car": "#1a1a2a",
          "🌸 Flower": "#2a1a2a",
          "🏠 House": "#2a1f1a",
          "🦋 Butterfly": "#1a2a2a",
        };
        // Generate CORS-safe canvas image immediately (no network needed)
        const dataUrl = makeEmojiImageDataURL(
          emoji,
          inp.img.replace(/^.+? /, ""),
          bgColors[inp.img],
        );
        ctx.currentImage = dataUrl;
        ctx.currentImageLabel = inp.img;
        V.showImageFromDataURL(dataUrl, inp.img);
        V.log(`📸 Loaded sample image: ${inp.img}`, "info");
        break;
      }
      case "classify_image": {
        if (!ctx.currentImage) {
          V.log("⚠️ Load an image first!", "warn");
          break;
        }
        V.log(`🏷️ Classifying image with ${inp.model}...`, "info");
        V.setCharacterEmotion("thinking");
        await sleep(600);
        // Simulated MobileNet results for demo
        const imgResults = {
          "🐱 Cat": { label: "tabby cat", conf: 0.91 },
          "🐶 Dog": { label: "Labrador retriever", conf: 0.87 },
          "🚗 Car": { label: "sports car", conf: 0.83 },
          "🌸 Flower": { label: "daisy", conf: 0.79 },
          "🏠 House": { label: "house", conf: 0.72 },
          "🦋 Butterfly": { label: "monarch butterfly", conf: 0.88 },
        };
        const result = Object.entries(SAMPLE_IMAGES).find(
          ([k, v]) => v === ctx.currentImage,
        );
        const res = result
          ? imgResults[result[0]]
          : { label: "unknown object", conf: 0.61 };
        ctx.lastPrediction = res.label;
        ctx.lastPredConfidence = res.conf;
        V.showPredictionCard(res.label, res.conf, {
          [res.label]: res.conf,
          other: 1 - res.conf,
        });
        V.log(
          `✅ Classified as: "${res.label}" (${Math.round(res.conf * 100)}% confident)`,
          "success",
        );
        V.setCharacterEmotion("happy");
        G.trackStat("images_classified");
        break;
      }
      case "detect_objects": {
        if (!ctx.currentImage) {
          V.log("⚠️ Load an image first!", "warn");
          break;
        }
        V.log(`🔍 Running COCO-SSD object detection...`, "info");
        V.setCharacterEmotion("thinking");
        await sleep(800);
        // Smart simulated detections based on image label
        const detMap = {
          "🐱 Cat": [{ class: "cat", score: 0.94, bbox: [60, 30, 200, 180] }],
          "🐶 Dog": [{ class: "dog", score: 0.91, bbox: [50, 20, 220, 200] }],
          "🚗 Car": [{ class: "car", score: 0.87, bbox: [20, 80, 280, 140] }],
          "🌸 Flower": [
            { class: "flower", score: 0.83, bbox: [80, 40, 160, 160] },
          ],
          "🏠 House": [
            { class: "house", score: 0.78, bbox: [30, 30, 260, 180] },
            { class: "tree", score: 0.65, bbox: [240, 60, 70, 120] },
          ],
          "🦋 Butterfly": [
            { class: "butterfly", score: 0.89, bbox: [90, 50, 140, 140] },
          ],
        };
        const label = ctx.currentImageLabel || "custom";
        const dets = detMap[label] || [
          { class: "object", score: 0.72, bbox: [40, 40, 240, 160] },
        ];
        V.showDetectionOverlay(ctx.currentImage, dets, label);
        V.log(
          `✅ Found ${dets.length} object(s): ${dets.map((d) => d.class + " " + Math.round(d.score * 100) + "%").join(", ")}`,
          "success",
        );
        break;
      }
      case "apply_filter": {
        if (!ctx.currentImage) {
          V.log("⚠️ Load an image first!", "warn");
          break;
        }
        const filterMap = {
          grayscale: "grayscale(100%)",
          sepia: "sepia(100%)",
          invert: "invert(100%)",
          blur: "blur(4px)",
          brighten: "brightness(1.5)",
          "high contrast": "contrast(200%)",
        };
        const filter = filterMap[inp.filter] || "none";
        V.showFilteredImage(
          ctx.currentImage,
          inp.filter,
          filter,
          ctx.currentImageLabel,
        );
        V.log(`🎨 Applied "${inp.filter}" filter to image`, "info");
        break;
      }
      case "show_image": {
        if (!ctx.currentImage) {
          V.log("⚠️ Load an image first!", "warn");
          break;
        }
        V.showImageFromDataURL(ctx.currentImage, ctx.currentImageLabel || "");
        break;
      }

      // ── NLP ──
      case "analyze_sentiment": {
        V.setCharacterEmotion("thinking");
        await sleep(300);
        const result = analyzeSentiment(inp.text);
        V.showSentimentResult(inp.text, result.sentiment, result.score);
        V.log(
          `😊 Sentiment: ${result.sentiment} (${Math.round(result.score * 100)}% confidence)`,
          "info",
        );
        G.trackStat("sentiments_analyzed");
        break;
      }
      case "tokenize_text": {
        const tokens = inp.text.trim().split(/\s+/).filter(Boolean);
        V.showTokens(tokens);
        V.log(
          `✂️ Tokenized into ${tokens.length} words: [${tokens.slice(0, 5).join(", ")}${tokens.length > 5 ? "..." : ""}]`,
          "info",
        );
        break;
      }
      case "classify_spam": {
        await sleep(200);
        const result = classifySpam(inp.text);
        const label = result.isSpam ? "🚨 SPAM" : "✅ NOT SPAM";
        const color = result.isSpam ? "#EF4444" : "#10B981";
        V.showVisualization(
          `<div class="spam-card"><div class="spam-result" style="color:${color};font-size:2rem;font-weight:900">${label}</div><div class="spam-confidence">Confidence: ${Math.round(result.confidence * 100)}%</div><div class="spam-text">"${inp.text.slice(0, 80)}"</div></div>`,
        );
        V.log(
          `📧 Spam classification: ${result.isSpam ? "SPAM" : "NOT SPAM"} (${Math.round(result.confidence * 100)}%)`,
          result.isSpam ? "warn" : "success",
        );
        break;
      }
      case "word_frequency": {
        const words = inp.text
          .toLowerCase()
          .replace(/[^a-z\s]/g, "")
          .split(/\s+/)
          .filter(Boolean);
        const freq = {};
        words.forEach((w) => (freq[w] = (freq[w] || 0) + 1));
        V.showWordFrequency(freq);
        V.log(
          `📊 Word frequency chart: ${Object.keys(freq).length} unique words`,
          "info",
        );
        break;
      }
      case "encode_text": {
        const codes = [...inp.text].map((c) => c.charCodeAt(0));
        V.showVisualization(
          `<div class="encode-display"><div class="enc-title">🔢 "${inp.text}" as numbers</div><div class="enc-pairs">${[...inp.text].map((c, i) => `<div class="enc-pair"><span class="enc-char">'${c}'</span><span class="enc-arrow">→</span><span class="enc-code">${codes[i]}</span></div>`).join("")}</div></div>`,
        );
        V.log(`🔢 Encoded "${inp.text}": [${codes.join(", ")}]`, "info");
        break;
      }

      // ── REINFORCEMENT LEARNING ──
      case "create_agent": {
        ctx.agents[inp.agent] = {
          type: "gridworld",
          agent: null,
          env: "Grid World 4×4",
        };
        V.log(`🤖 Created RL agent "${inp.agent}"`, "success");
        break;
      }
      case "set_env": {
        const agentObj = ctx.agents[inp.agent || Object.keys(ctx.agents)[0]];
        if (!agentObj) {
          V.log("⚠️ Create an agent first!", "warn");
          break;
        }
        agentObj.env = inp.env;
        V.log(`🌍 Set environment to "${inp.env}"`, "info");
        const size = inp.env.includes("4") ? 4 : inp.env.includes("6") ? 6 : 4;
        V.showRLGrid(
          size,
          [0, 0],
          [size - 1, size - 1],
          [
            [1, 1],
            [1, 2],
          ],
          [],
        );
        break;
      }
      case "set_reward": {
        const agentObj = ctx.agents[inp.agent || Object.keys(ctx.agents)[0]];
        if (!agentObj) {
          V.log("⚠️ Create an agent first!", "warn");
          break;
        }
        V.log(`🎁 Set reward ${inp.reward} when agent "${inp.event}"`, "info");
        break;
      }
      case "train_agent": {
        const agentObj = ctx.agents[inp.agent || Object.keys(ctx.agents)[0]];
        if (!agentObj) {
          V.log("⚠️ Create an agent first!", "warn");
          break;
        }
        const size = agentObj.env?.includes("6") ? 6 : 4;
        const agent = new GridWorldAgent(size);
        V.log(
          `🏃 Training "${inp.agent || "agent"}" for ${inp.episodes} episodes...`,
          "info",
        );
        V.setCharacterEmotion("working");
        await sleep(200);

        // Simulate training in chunks to not block UI
        const rewards = agent.train(+inp.episodes, null);
        agentObj.agent = agent;
        const avgReward = (
          rewards.slice(-20).reduce((a, b) => a + b, 0) / 20
        ).toFixed(2);
        V.log(
          `✅ RL training complete! Avg reward (last 20 eps): ${avgReward}`,
          "success",
        );

        // Show reward history chart
        const stride = Math.max(1, Math.floor(rewards.length / 20));
        const plotRewards = rewards.filter((_, i) => i % stride === 0);
        V.showBarChart(
          plotRewards.map((_, i) => `Ep ${i * stride + 1}`),
          plotRewards,
          "Reward per Episode",
        );
        V.setCharacterEmotion("happy");
        G.trackStat("agents_trained");
        G.awardXP(35, "RL agent trained");
        break;
      }
      case "visualize_agent": {
        const agentObj = ctx.agents[inp.agent || Object.keys(ctx.agents)[0]];
        if (!agentObj?.agent) {
          V.log("⚠️ Train an agent first!", "warn");
          break;
        }
        const path = agentObj.agent.getBestPath();
        const size = agentObj.agent.gridSize;
        V.showRLGrid(
          size,
          agentObj.agent.startPos,
          agentObj.agent.goalPos,
          agentObj.agent.walls.map((w) => w[0] * size + w[1]),
          path,
        );
        V.log(
          `🎬 Showing trained agent path (${path.length} steps to goal)`,
          "success",
        );

        // Animate agent moving along path
        for (let i = 1; i < path.length; i++) {
          await sleep(400);
          if (ctx.stopped) break;
          V.showRLGrid(
            size,
            path[i],
            agentObj.agent.goalPos,
            agentObj.agent.walls.map((w) => w[0] * size + w[1]),
            path.slice(0, i),
          );
        }
        if (!ctx.stopped) V.setCharacterEmotion("excited");
        break;
      }

      // ── CONTROL ──
      case "when_run":
        break; // hat block, no action
      case "wait":
        await sleep(Math.round(+inp.secs * 1000));
        break;
      case "set_var":
        ctx.variables[inp.name] = inp.value;
        V.log(`📦 ${inp.name} = ${inp.value}`, "info");
        break;
      case "print":
        V.log(`📋 ${inp.msg}`, "info");
        V.showMessage(inp.msg);
        break;
      case "stop_all":
        ctx.stopped = true;
        V.log("⛔ Program stopped.", "warn");
        break;

      // ── OUTPUT ──
      case "say":
        V.showMessage(inp.msg);
        V.log(`💬 "${inp.msg}"`, "info");
        break;
      case "show_bar_chart": {
        if (inp.data === "class distribution") {
          V.showClassDistribution(ctx.dataset);
          break;
        }
        if (inp.data === "accuracy history") {
          const accs = Object.entries(ctx.models).map(([n, m]) => {
            const rows = ctx.testData || ctx.dataset?.data;
            if (!rows || !m.clf) return [n, 0];
            try {
              return [n, computeAccuracy(m.clf, rows) * 100];
            } catch (e) {
              return [n, 0];
            }
          });
          if (accs.length)
            V.showBarChart(
              accs.map((a) => a[0]),
              accs.map((a) => Math.round(a[1])),
              "Model Accuracies (%)",
            );
          break;
        }
        if (inp.data === "feature means" && ctx.dataset) {
          const numCols = ctx.dataset.headers.length - 1;
          const means = Array.from({ length: numCols }, (_, c) => {
            const vals = ctx.dataset.data
              .map((r) => +r[c])
              .filter((v) => !isNaN(v));
            return vals.reduce((a, b) => a + b, 0) / vals.length;
          });
          V.showBarChart(
            ctx.dataset.headers.slice(0, numCols),
            means,
            "Feature Means",
          );
          break;
        }
        V.showBarChart(["A", "B", "C", "D"], [42, 68, 35, 91], inp.data);
        break;
      }
      case "show_scatter":
        V.showScatterPlot(ctx.dataset, +inp.x, +inp.y);
        break;
      case "celebrate":
        V.celebrate();
        G.awardXP(10, "Celebration!");
        break;
      case "show_result_card":
        if (ctx.lastPrediction != null) {
          V.showPredictionCard(
            String(ctx.lastPrediction),
            ctx.lastPredConfidence,
          );
        } else {
          V.showMessage("⚠️ No prediction yet! Run a predict block first.");
        }
        break;
      case "clear_stage":
        V.clearStage();
        break;
      case "play_sound":
        V.log(`🔊 Playing sound: ${inp.sound}`, "info");
        // Use Web Audio API for simple tones
        try {
          const ctx_a = new (
            window.AudioContext || window.webkitAudioContext
          )();
          const osc = ctx_a.createOscillator();
          const gain = ctx_a.createGain();
          osc.connect(gain);
          gain.connect(ctx_a.destination);
          osc.frequency.value = inp.sound.includes("level up")
            ? 880
            : inp.sound.includes("error")
              ? 220
              : 440;
          osc.type = inp.sound.includes("thinking") ? "sine" : "square";
          gain.gain.setValueAtTime(0.1, ctx_a.currentTime);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            ctx_a.currentTime + 0.5,
          );
          osc.start();
          osc.stop(ctx_a.currentTime + 0.5);
        } catch (e) {}
        break;

      default:
        V.log(`⚠️ Block "${id}" not implemented yet`, "warn");
    }

    G.onBlockUsed(id);
  }

  function showVisualization_img(src, filterName, cssFilter) {
    const viz = document.getElementById("stage-visualization");
    if (!viz) return;
    viz.classList.remove("hidden");
    viz.innerHTML = `<div class="image-display"><img src="${src}" class="stage-img" style="filter:${cssFilter}" crossorigin="anonymous"><div class="img-caption">Filter: ${filterName}</div></div>`;
  }

  // ── Stack Execution ────────────────────────────────────────────────────────
  async function executeStack(stack, ctx, speed) {
    for (const block of stack) {
      if (ctx.stopped) break;

      if (block.defId === "repeat") {
        const times = +block.inputs.times || 1;
        for (let i = 0; i < times && !ctx.stopped; i++) {
          if (block.body) await executeStack(block.body, ctx, speed);
        }
      } else if (block.defId === "if_accuracy") {
        const threshold = +block.inputs.threshold || 80;
        if ((ctx.lastAccuracy || 0) * 100 >= threshold) {
          if (block.body) await executeStack(block.body, ctx, speed);
        } else {
          V.log(
            `⚠️ Accuracy condition not met (need >${threshold}%, got ${Math.round((ctx.lastAccuracy || 0) * 100)}%)`,
            "warn",
          );
        }
      } else {
        await executeBlock(block, ctx, speed);
      }
    }
  }

  // ── Main Run Function ─────────────────────────────────────────────────────
  let runCtx = null;

  async function run(stacks, speed) {
    runCtx = createContext();
    V.clearConsole();
    V.log("🚀 Program started!", "success");
    V.setCharacterEmotion("thinking");
    G.trackStat("run_count");
    G.awardXP(5, "Ran a program");

    // Find hat block stacks first, then others
    const hat = stacks.find((s) => s[0]?.defId === "when_run");
    const toRun = hat ? [hat, ...stacks.filter((s) => s !== hat)] : stacks;

    for (const stack of toRun) {
      if (runCtx.stopped) break;
      await executeStack(stack, runCtx, speed);
    }

    document
      .querySelectorAll(".workspace-block")
      .forEach((el) => el.classList.remove("executing"));
    if (!runCtx.stopped) {
      V.log("✅ Program finished!", "success");
      V.setCharacterEmotion("happy");
    }
    NB.EVENTS.emit("run_complete");
  }

  function stop() {
    if (runCtx) runCtx.stopped = true;
    document
      .querySelectorAll(".workspace-block")
      .forEach((el) => el.classList.remove("executing"));
    V.showTrainingOverlay(false);
    V.setCharacterEmotion("idle");
  }

  return { run, stop };
})();
