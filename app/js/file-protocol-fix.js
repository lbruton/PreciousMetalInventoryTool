// SIMPLIFIED FILE PROTOCOL COMPATIBILITY
// =============================================================================
// Minimal file:// protocol fixes without conflicts

console.log('Loading simplified file:// protocol compatibility...');

// Only provide essential localStorage fallback for file:// protocol
if (window.location.protocol === 'file:') {
  console.log('File protocol detected - enabling localStorage fallback');
  
  // Create memory storage fallback if localStorage fails
  window.tempStorage = window.tempStorage || {};
  
  // Override localStorage methods with fallback
  const originalSetItem = localStorage.setItem;
  const originalGetItem = localStorage.getItem;
  const originalRemoveItem = localStorage.removeItem;
  
  localStorage.setItem = function(key, value) {
    try {
      return originalSetItem.call(this, key, value);
    } catch (error) {
      console.warn('LocalStorage failed, using memory fallback');
      window.tempStorage[key] = value;
    }
  };
  
  localStorage.getItem = function(key) {
    try {
      return originalGetItem.call(this, key);
    } catch (error) {
      return window.tempStorage[key] || null;
    }
  };
  
  localStorage.removeItem = function(key) {
    try {
      return originalRemoveItem.call(this, key);
    } catch (error) {
      delete window.tempStorage[key];
    }
  };
}

console.log('File protocol compatibility loaded');

// =============================================================================
