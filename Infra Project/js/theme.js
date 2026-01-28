/* ============================================
   THEME TOGGLE - DARK/LIGHT MODE
   ============================================ */

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  setupThemeToggle();
});

/**
 * Initialize theme based on localStorage or system preference
 */
function initializeTheme() {
  // Check localStorage first
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }
}

/**
 * Set up theme toggle button event listener
 */
function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  setTheme(newTheme);
}

/**
 * Set theme and update UI
 * @param {string} theme - 'light' or 'dark'
 */
function setTheme(theme) {
  // Update HTML attribute
  document.documentElement.setAttribute('data-theme', theme);
  
  // Save to localStorage
  localStorage.setItem('theme', theme);
  
  // Update toggle button
  updateThemeToggleButton(theme);
}

/**
 * Update theme toggle button icon and text
 * @param {string} theme - Current theme
 */
function updateThemeToggleButton(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  
  if (themeIcon && themeText) {
    if (theme === 'dark') {
      themeIcon.textContent = '☀️';
      themeText.textContent = 'Light';
    } else {
      themeIcon.textContent = '🌙';
      themeText.textContent = 'Dark';
    }
  }
}

/**
 * Listen for system theme changes
 */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  // Only update if user hasn't manually set a preference
  if (!localStorage.getItem('theme')) {
    setTheme(e.matches ? 'dark' : 'light');
  }
});
