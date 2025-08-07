// FILE PROTOCOL COMPATIBILITY FIXES
// =============================================================================
// This module ensures the application works reliably when loaded via file:// protocol
// without requiring a local server setup.

/**
 * Enhanced event listener attachment that works reliably with file:// protocol
 * Uses multiple fallback methods to ensure events are properly attached
 */
const attachEventListenerSafely = (element, event, handler, description) => {
  if (!element) {
    console.warn(`Cannot attach ${event} listener: ${description} element not found`);
    return false;
  }

  try {
    // Method 1: Standard addEventListener
    element.addEventListener(event, handler);
    console.log(`✓ Event listener attached: ${description} (${event})`);
    return true;
  } catch (error) {
    console.warn(`Standard addEventListener failed for ${description}:`, error);
    
    try {
      // Method 2: Legacy event handler (fallback for file:// issues)
      element['on' + event] = handler;
      console.log(`✓ Legacy event handler attached: ${description} (${event})`);
      return true;
    } catch (legacyError) {
      console.error(`All event attachment methods failed for ${description}:`, legacyError);
      return false;
    }
  }
};

/**
 * Critical button functionality with multiple attachment methods
 * Ensures API and Theme buttons work regardless of protocol restrictions
 */
const setupCriticalButtons = () => {
  console.log('Setting up critical buttons with file:// compatibility...');

  // API Button
  const apiBtn = document.getElementById('apiBtn');
  const themeBtn = document.getElementById('themeToggle');

  if (apiBtn) {
    // Multiple methods to ensure the API button works
    const apiHandler = function(e) {
      e.preventDefault();
      console.log('API button clicked via file:// compatible handler');
      if (typeof showApiModal === 'function') {
        showApiModal();
      } else {
        alert('API configuration coming soon!');
      }
    };

    // Try multiple attachment methods
    attachEventListenerSafely(apiBtn, 'click', apiHandler, 'API Button');
    
    // Additional backup: inline onclick as last resort
    apiBtn.onclick = apiHandler;
    
    // Verify it's working
    setTimeout(() => {
      if (!apiBtn.onclick && !apiBtn.click) {
        console.error('API button still not responsive, adding manual fallback');
        apiBtn.style.pointerEvents = 'auto';
        apiBtn.style.cursor = 'pointer';
      }
    }, 100);
  }

  if (themeBtn) {
    // Theme toggle with multiple attachment methods
    const themeHandler = function(e) {
      e.preventDefault();
      console.log('Theme button clicked via file:// compatible handler');
      
      try {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        if (typeof setTheme === 'function') {
          setTheme(newTheme);
        } else {
          // Fallback theme switching
          if (newTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('appTheme', 'dark');
            themeBtn.textContent = 'Light Mode';
          } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('appTheme', 'light');
            themeBtn.textContent = 'Dark Mode';
          }
        }
      } catch (error) {
        console.error('Theme switching error:', error);
        alert('Theme switching temporarily unavailable');
      }
    };

    // Try multiple attachment methods
    attachEventListenerSafely(themeBtn, 'click', themeHandler, 'Theme Toggle');
    
    // Additional backup: inline onclick
    themeBtn.onclick = themeHandler;
  }
};

/**
 * File protocol compatible initialization
 * Uses multiple DOM ready detection methods for maximum compatibility
 */
const initializeForFileProtocol = () => {
  console.log('Initializing file:// protocol compatibility...');

  // Method 1: If DOM is already ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(setupCriticalButtons, 0);
  }
  
  // Method 2: DOMContentLoaded (standard)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCriticalButtons);
  }
  
  // Method 3: window.onload (backup)
  window.addEventListener('load', setupCriticalButtons);
  
  // Method 4: Aggressive timeout fallback
  setTimeout(() => {
    if (!document.getElementById('apiBtn')?.onclick) {
      console.log('Using aggressive fallback for critical buttons');
      setupCriticalButtons();
    }
  }, 1000);
};

/**
 * Enhanced LocalStorage wrapper that handles file:// protocol edge cases
 */
const fileProtocolStorage = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('LocalStorage not available, using fallback:', error);
      // Fallback to memory storage for file:// protocol issues
      window.tempStorage = window.tempStorage || {};
      window.tempStorage[key] = value;
      return false;
    }
  },
  
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('LocalStorage read failed, checking fallback:', error);
      return window.tempStorage?.[key] || null;
    }
  },
  
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('LocalStorage remove failed:', error);
      if (window.tempStorage) {
        delete window.tempStorage[key];
      }
    }
  }
};

/**
 * Event delegation for dynamic buttons (works better with file:// protocol)
 */
const setupEventDelegation = () => {
  document.body.addEventListener('click', function(event) {
    const target = event.target;
    
    // Handle API button clicks via delegation
    if (target.id === 'apiBtn' || target.closest('#apiBtn')) {
      event.preventDefault();
      console.log('API button clicked via event delegation');
      if (typeof showApiModal === 'function') {
        showApiModal();
      } else {
        alert('API Modal: Configuration interface would open here');
      }
      return;
    }
    
    // Handle theme toggle clicks via delegation
    if (target.id === 'themeToggle' || target.closest('#themeToggle')) {
      event.preventDefault();
      console.log('Theme button clicked via event delegation');
      
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        fileProtocolStorage.setItem('appTheme', 'dark');
        target.textContent = 'Light Mode';
      } else {
        document.documentElement.removeAttribute('data-theme');
        fileProtocolStorage.setItem('appTheme', 'light');
        target.textContent = 'Dark Mode';
      }
      return;
    }
    
    // Handle spot price action buttons
    if (target.classList.contains('spot-action-btn')) {
      event.preventDefault();
      const buttonId = target.id;
      console.log(`Spot price button clicked: ${buttonId}`);
      
     // if (buttonId.startsWith('addBtn')) {
     //   const metal = buttonId.replace('addBtn', '');
     //   const manualInput = document.getElementById(`manualInput${metal}`);
     //   if (manualInput) {
     //     manualInput.style.display = manualInput.style.display === 'none' ? 'block' : 'none';
     //   }
     // }
      
      if (buttonId.startsWith('resetBtn')) {
        const metal = buttonId.replace('resetBtn', '');
        console.log(`Reset spot price for ${metal}`);
        // Add reset functionality here
      }
      
      if (buttonId.startsWith('syncBtn')) {
        alert('Sync functionality requires API configuration');
      }
    }
  });
};

/**
 * Initialize file:// protocol fixes immediately
 */
console.log('Loading file:// protocol compatibility fixes...');

// Start initialization immediately
initializeForFileProtocol();

// Set up event delegation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupEventDelegation);
} else {
  setupEventDelegation();
}

// Override localStorage functions globally for file:// compatibility
if (window.location.protocol === 'file:') {
  console.log('File protocol detected, enabling compatibility mode');
  
  // Make enhanced storage available globally
  window.fileProtocolStorage = fileProtocolStorage;
  
  // Override common localStorage usage patterns
  const originalSetItem = localStorage.setItem;
  const originalGetItem = localStorage.getItem;
  const originalRemoveItem = localStorage.removeItem;
  
  localStorage.setItem = function(key, value) {
    return fileProtocolStorage.setItem(key, value);
  };
  
  localStorage.getItem = function(key) {
    return fileProtocolStorage.getItem(key);
  };
  
  localStorage.removeItem = function(key) {
    return fileProtocolStorage.removeItem(key);
  };
}

// Export functions for use by main application
window.fileProtocolFixes = {
  attachEventListenerSafely,
  setupCriticalButtons,
  fileProtocolStorage,
  setupEventDelegation
};

console.log('File:// protocol compatibility fixes loaded successfully');

// =============================================================================
