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

/**
 * Loads changelog information from README and populates the About modal
 */
const loadChangelog = async () => {
  const latestList = document.getElementById('aboutChangelogLatest');
  const previousSection = document.getElementById('aboutChangelogPreviousSection');
  const prevTitle = document.getElementById('aboutChangelogPreviousTitle');
  const prevList = document.getElementById('aboutChangelogPrevious');
  if (!latestList) return;
  try {
    const res = await fetch('README.md');
    if (!res.ok) throw new Error('Failed to fetch README');
    const text = await res.text();
    const matches = [...text.matchAll(/##[^\n]*What's New in v([\d.]+)[^\n]*\n((?:- .*\n)+)/g)];
    if (matches.length > 0) {
      const [, , latestContent] = matches[0];
      latestList.innerHTML = latestContent
        .trim()
        .split('\n')
        .map(line => `<li>${sanitizeHtml(line.replace(/^-\s*/, ''))}</li>`) .join('');
    }
    if (matches.length > 1 && prevTitle && prevList && previousSection) {
      const [prevVersion, prevContent] = [matches[1][1], matches[1][2]];
      prevTitle.textContent = `Changes from v${prevVersion}`;
      prevList.innerHTML = prevContent
        .trim()
        .split('\n')
        .map(line => `<li>${sanitizeHtml(line.replace(/^-\s*/, ''))}</li>`) .join('');
    } else if (previousSection) {
      previousSection.style.display = 'none';
    }
  } catch (e) {
    console.warn('Could not load changelog from README', e);
    latestList.innerHTML = '<li>See README.md for recent changes</li>';
    if (previousSection) {
      previousSection.style.display = 'none';
    }
  }
};

// Expose globally for access from other modules
if (typeof window !== 'undefined') {
  window.showAboutModal = showAboutModal;
  window.hideAboutModal = hideAboutModal;
  window.acceptAbout = acceptAbout;
  window.checkAboutAcceptance = checkAboutAcceptance;
  window.loadChangelog = loadChangelog;
}
