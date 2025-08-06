// THEME MANAGEMENT
// =============================================================================

/**
 * Sets application theme and updates localStorage
 * 
 * @param {string} theme - 'dark' or 'light'
 */
const setTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem(THEME_KEY, 'dark');
    elements.themeToggle.textContent = 'Light Mode';
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem(THEME_KEY, 'light');
    elements.themeToggle.textContent = 'Dark Mode';
  }
};

// =============================================================================
