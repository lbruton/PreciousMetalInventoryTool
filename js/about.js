/**
 * ABOUT MODAL MODULE
 *
 * Handles display and acceptance of the About/Disclaimer modal.
 * Shows the modal on initial load until the user accepts the disclaimer.
 */

/**
 * Displays the about modal
 */
function showAboutModal() {
  const modal = document.getElementById('aboutModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

/**
 * Hides the about modal
 */
function hideAboutModal() {
  const modal = document.getElementById('aboutModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Handles acceptance of the disclaimer
 * Saves a timestamp to localStorage
 */
function acceptAboutModal() {
  try {
    localStorage.setItem('aboutAccepted', Date.now().toString());
  } catch (err) {
    console.warn('Unable to store about acceptance', err);
  }
  hideAboutModal();
}

/**
 * Loads the latest changelog entry into the modal
 */
async function loadLatestChangelog() {
  try {
    const res = await fetch('./docs/CHANGELOG.md');
    const text = await res.text();
    const match = text.match(/### Version[\s\S]*?(?=\n### Version|$)/);
    if (match) {
      const changelogEl = document.getElementById('aboutChangelog');
      if (changelogEl) {
        changelogEl.textContent = match[0].trim();
      }
    }
  } catch (err) {
    console.warn('Failed to load changelog', err);
  }
}

// Set up modal on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const versionEl = document.getElementById('aboutVersion');
    if (versionEl) {
      versionEl.textContent = typeof APP_VERSION !== 'undefined' ? APP_VERSION : '';
    }
    loadLatestChangelog();
    if (!localStorage.getItem('aboutAccepted')) {
      showAboutModal();
    }
  });
}

// Expose functions globally
if (typeof window !== 'undefined') {
  window.showAboutModal = showAboutModal;
  window.hideAboutModal = hideAboutModal;
  window.acceptAboutModal = acceptAboutModal;
}
