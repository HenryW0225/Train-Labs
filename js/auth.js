'use strict';
// ============================================================================
// Train Labs — Authentication Module (NB.AUTH)
// Persists JWT tokens, manages registration, login, logout, and modal UI
// ============================================================================

window.NB = window.NB || {};

NB.AUTH = (() => {
  const API_BASE = 'http://localhost:8000/api/auth';
  const TOKEN_KEY = 'train_labs_token';

  let currentUser = null;

  // ── Helper: Get Headers ───────────────────────────────────────────────────
  function getAuthHeaders() {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // ── UI Updates ────────────────────────────────────────────────────────────
  function updateAccountBtnUI() {
    const btn = document.getElementById('account-btn');
    if (!btn) return;

    if (currentUser) {
      btn.innerHTML = `👤 ${currentUser.username}`;
      btn.classList.add('logged-in');
      btn.title = `Logged in as ${currentUser.username}`;
    } else {
      btn.innerHTML = `👤 Create Account`;
      btn.classList.remove('logged-in');
      btn.title = `Create Account or Log In`;
    }
  }

  function showFeedback(msg, isError = false) {
    const feedbackEl = document.getElementById('auth-feedback');
    if (!feedbackEl) return;
    feedbackEl.textContent = msg;
    feedbackEl.className = `auth-feedback ${isError ? 'error' : 'success'}`;
    feedbackEl.classList.remove('hidden');
  }

  function clearFeedback() {
    const feedbackEl = document.getElementById('auth-feedback');
    if (!feedbackEl) return;
    feedbackEl.textContent = '';
    feedbackEl.className = 'auth-feedback hidden';
  }

  function renderModalContent() {
    const loggedOutView = document.getElementById('auth-logged-out-view');
    const loggedInView = document.getElementById('auth-logged-in-view');

    if (currentUser) {
      if (loggedOutView) loggedOutView.classList.add('hidden');
      if (loggedInView) loggedInView.classList.remove('hidden');

      const nameEl = document.getElementById('user-profile-name');
      const emailEl = document.getElementById('user-profile-email');
      if (nameEl) nameEl.textContent = currentUser.full_name || currentUser.username;
      if (emailEl) emailEl.textContent = currentUser.email || 'No email registered';
    } else {
      if (loggedInView) loggedInView.classList.add('hidden');
      if (loggedOutView) loggedOutView.classList.remove('hidden');
    }
  }

  function switchTab(tabName) {
    clearFeedback();
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');

    if (tabName === 'login') {
      loginForm?.classList.remove('hidden');
      registerForm?.classList.add('hidden');
      tabLogin?.classList.add('active');
      tabRegister?.classList.remove('active');
    } else {
      registerForm?.classList.remove('hidden');
      loginForm?.classList.add('hidden');
      tabRegister?.classList.add('active');
      tabLogin?.classList.remove('active');
    }
  }

  // ── API Actions ───────────────────────────────────────────────────────────
  async function checkSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      currentUser = null;
      updateAccountBtnUI();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users/me/`, {
        headers: getAuthHeaders()
      });

      if (res.ok) {
        currentUser = await res.json();
        updateAccountBtnUI();
      } else {
        localStorage.removeItem(TOKEN_KEY);
        currentUser = null;
        updateAccountBtnUI();
      }
    } catch (err) {
      console.warn('Auth backend offline or unreachable:', err);
    }
  }

  async function register(username, email, fullName, password) {
    clearFeedback();
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email: email || null,
          full_name: fullName || null,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        showFeedback(data.detail || 'Registration failed', true);
        return false;
      }

      showFeedback('Account created successfully! Logging you in…', false);
      // Auto-login after registration
      setTimeout(() => {
        login(username, password);
      }, 600);
      return true;

    } catch (err) {
      showFeedback('Server connection error. Is backend running?', true);
      return false;
    }
  }

  async function login(username, password) {
    clearFeedback();
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const res = await fetch(`${API_BASE}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        showFeedback(data.detail || 'Incorrect username or password', true);
        return false;
      }

      localStorage.setItem(TOKEN_KEY, data.access_token);
      await checkSession();
      renderModalContent();
      showFeedback(`Welcome back, ${username}!`, false);

      setTimeout(() => {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.add('hidden');
      }, 1000);

      return true;

    } catch (err) {
      showFeedback('Server connection error. Is backend running?', true);
      return false;
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    currentUser = null;
    updateAccountBtnUI();
    renderModalContent();
    clearFeedback();
    showFeedback('Logged out successfully.');
  }

  // ── Init Module ───────────────────────────────────────────────────────────
  function init() {
    checkSession();

    // Event listeners
    const accountBtn = document.getElementById('account-btn');
    const modal = document.getElementById('auth-modal');

    accountBtn?.addEventListener('click', () => {
      renderModalContent();
      clearFeedback();
      if (modal) modal.classList.remove('hidden');
    });

    document.getElementById('tab-login')?.addEventListener('click', () => switchTab('login'));
    document.getElementById('tab-register')?.addEventListener('click', () => switchTab('register'));

    // Form Submissions
    document.getElementById('login-form-el')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = document.getElementById('login-username')?.value.trim();
      const p = document.getElementById('login-password')?.value;
      if (u && p) login(u, p);
    });

    document.getElementById('register-form-el')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = document.getElementById('reg-username')?.value.trim();
      const em = document.getElementById('reg-email')?.value.trim();
      const fn = document.getElementById('reg-fullname')?.value.trim();
      const p = document.getElementById('reg-password')?.value;
      if (u && p) register(u, em, fn, p);
    });

    document.getElementById('logout-btn')?.addEventListener('click', logout);
  }

  return {
    init,
    checkSession,
    register,
    login,
    logout,
    getCurrentUser: () => currentUser
  };
})();
