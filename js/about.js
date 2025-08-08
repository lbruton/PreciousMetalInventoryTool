// ABOUT & DISCLAIMER MODAL
// =============================================================================

/**
 * Shows the about/disclaimer modal
 */
const showAboutModal = () => {
  if (elements.aboutModal) {
    elements.aboutModal.style.display = 'flex';
  }
};

/**
 * Hides the about/disclaimer modal
 */
const hideAboutModal = () => {
  if (elements.aboutModal) {
    elements.aboutModal.style.display = 'none';
  }
};

/**
 * Accepts the disclaimer and stores acceptance in localStorage
 */
const acceptAbout = () => {
  try {
    localStorage.setItem(ABOUT_ACCEPTED_KEY, 'true');
  } catch (e) {
    console.warn('Could not access localStorage for disclaimer acceptance', e);
  }
  hideAboutModal();
};

/**
 * Checks if the disclaimer has been accepted; shows modal if not
 */
const checkAboutAcceptance = () => {
  let accepted = false;
  try {
    accepted = localStorage.getItem(ABOUT_ACCEPTED_KEY) === 'true';
  } catch (e) {
    console.warn('Could not read disclaimer acceptance from localStorage', e);
  }
  if (!accepted) {
    showAboutModal();
  }
};

// Expose globally for access from other modules
if (typeof window !== 'undefined') {
  window.showAboutModal = showAboutModal;
  window.hideAboutModal = hideAboutModal;
  window.acceptAbout = acceptAbout;
  window.checkAboutAcceptance = checkAboutAcceptance;
}
