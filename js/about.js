// ABOUT & DISCLAIMER MODAL - Enhanced
// =============================================================================

/**
 * Shows the about/disclaimer modal and populates it with current data
 */
const showAboutModal = () => {
  if (elements.aboutModal) {
    populateAboutModal();
    elements.aboutModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
};

/**
 * Hides the about/disclaimer modal
 */
const hideAboutModal = () => {
  if (elements.aboutModal) {
    elements.aboutModal.style.display = 'none';
    document.body.style.overflow = '';
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
 * Populates the about modal with current version and changelog information
 */
const populateAboutModal = () => {
  // Update version displays
  const aboutVersion = document.getElementById('aboutVersion');
  const aboutCurrentVersion = document.getElementById('aboutCurrentVersion');
  
  if (aboutVersion && typeof APP_VERSION !== 'undefined') {
    aboutVersion.textContent = `v${APP_VERSION}`;
  }
  
  if (aboutCurrentVersion && typeof APP_VERSION !== 'undefined') {
    aboutCurrentVersion.textContent = `v${APP_VERSION}`;
  }
  
  // Load changelog data
  loadChangelog();
};

/**
 * Loads changelog information from docs/CHANGELOG.md and populates the About modal
 */
const loadChangelog = async () => {
  const latestList = document.getElementById('aboutChangelogLatest');
  const previousSection = document.getElementById('aboutChangelogPreviousSection');
  const prevTitle = document.getElementById('aboutChangelogPreviousTitle');
  const prevList = document.getElementById('aboutChangelogPrevious');
  
  if (!latestList) return;
  
  try {
    // Try to fetch from docs/CHANGELOG.md first, then fallback to README.md
    let res, text;
    try {
      res = await fetch('docs/CHANGELOG.md');
      if (!res.ok) throw new Error('CHANGELOG.md not found');
      text = await res.text();
    } catch (e) {
      res = await fetch('README.md');
      if (!res.ok) throw new Error('README.md not found');
      text = await res.text();
    }
    
    // Parse changelog sections - look for version headers
    const versionPattern = /###\s+Version\s+([\d.]+)[^\n]*\n([\s\S]*?)(?=###\s+Version|$)/g;
    const matches = [...text.matchAll(versionPattern)];
    
    if (matches.length > 0) {
      // Get the latest version changes
      const [, latestVersion, latestContent] = matches[0];
      const latestItems = extractChangelogItems(latestContent);
      
      if (latestItems.length > 0) {
        latestList.innerHTML = latestItems
          .slice(0, 5) // Show max 5 latest items
          .map(item => `<li>${sanitizeHtml(item)}</li>`)
          .join('');
      } else {
        latestList.innerHTML = '<li>Enhanced about modal and user interface improvements</li>';
      }
      
      // Get previous version if available
      if (matches.length > 1 && prevTitle && prevList && previousSection) {
        const [, prevVersion, prevContent] = matches[1];
        const prevItems = extractChangelogItems(prevContent);
        
        prevTitle.textContent = `📋 Changes in v${prevVersion}`;
        
        if (prevItems.length > 0) {
          prevList.innerHTML = prevItems
            .slice(0, 3) // Show max 3 previous items
            .map(item => `<li>${sanitizeHtml(item)}</li>`)
            .join('');
        } else {
          previousSection.style.display = 'none';
        }
      } else if (previousSection) {
        previousSection.style.display = 'none';
      }
    } else {
      // Fallback content if no versions found
      latestList.innerHTML = `
        <li>Comprehensive precious metals inventory tracking</li>
        <li>Multi-format import/export capabilities</li>
        <li>Advanced analytics with interactive charts</li>
        <li>Enhanced user interface and theming</li>
        <li>Improved data backup and security features</li>
      `;
      
      if (previousSection) {
        previousSection.style.display = 'none';
      }
    }
  } catch (e) {
    console.warn('Could not load changelog', e);
    // Provide fallback content
    latestList.innerHTML = `
      <li>Enhanced about modal with comprehensive information</li>
      <li>Improved user interface and documentation</li>
      <li>Better data backup and security features</li>
      <li>See documentation for complete feature list</li>
    `;
    
    if (previousSection) {
      previousSection.style.display = 'none';
    }
  }
};

/**
 * Extracts changelog items from content, filtering for meaningful changes
 */
const extractChangelogItems = (content) => {
  const lines = content.split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-') || line.startsWith('*'))
    .map(line => line.replace(/^[-*]\s*/, ''))
    .filter(line => line.length > 10) // Filter out very short items
    .map(line => {
      // Clean up markdown formatting
      return line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/`(.*?)`/g, '<code>$1</code>') // Code
        .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Remove links but keep text
    });
  
  return lines;
};

/**
 * Handles backup button click from about modal
 */
const handleAboutBackup = () => {
  if (typeof window.backupAllData === 'function') {
    window.backupAllData();
  } else {
    console.warn('Backup function not available');
  }
};

/**
 * Shows full changelog in a new window or navigates to documentation
 */
const showFullChangelog = () => {
  // Try to open changelog documentation
  const urls = [
    'docs/CHANGELOG.md',
    'https://github.com/lbruton/Precious-Metals-Inventory/blob/main/docs/CHANGELOG.md',
    'README.md'
  ];
  
  // Open the first available URL
  window.open(urls[1], '_blank', 'noopener,noreferrer');
};

/**
 * Sets up event listeners for about modal elements
 */
const setupAboutModalEvents = () => {
  const aboutCloseBtn = document.getElementById('aboutCloseBtn');
  const aboutAcceptBtn = document.getElementById('aboutAcceptBtn');
  const aboutBackupBtn = document.getElementById('aboutBackupBtn');
  const aboutShowChangelogBtn = document.getElementById('aboutShowChangelogBtn');
  const aboutModal = document.getElementById('aboutModal');
  
  // Close button
  if (aboutCloseBtn) {
    aboutCloseBtn.addEventListener('click', hideAboutModal);
  }
  
  // Accept button
  if (aboutAcceptBtn) {
    aboutAcceptBtn.addEventListener('click', acceptAbout);
  }
  
  // Backup button
  if (aboutBackupBtn) {
    aboutBackupBtn.addEventListener('click', handleAboutBackup);
  }
  
  // Show changelog button
  if (aboutShowChangelogBtn) {
    aboutShowChangelogBtn.addEventListener('click', showFullChangelog);
  }
  
  // Click outside to close
  if (aboutModal) {
    aboutModal.addEventListener('click', (e) => {
      if (e.target === aboutModal) {
        hideAboutModal();
      }
    });
  }
  
  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && aboutModal && aboutModal.style.display === 'flex') {
      hideAboutModal();
    }
  });
};

// Expose globally for access from other modules
if (typeof window !== 'undefined') {
  window.showAboutModal = showAboutModal;
  window.hideAboutModal = hideAboutModal;
  window.acceptAbout = acceptAbout;
  window.checkAboutAcceptance = checkAboutAcceptance;
  window.loadChangelog = loadChangelog;
  window.setupAboutModalEvents = setupAboutModalEvents;
  window.populateAboutModal = populateAboutModal;
}
