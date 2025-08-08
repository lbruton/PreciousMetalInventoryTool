// INITIALIZATION - FIXED VERSION
// =============================================================================

/**
 * Helper function to create dummy DOM elements to prevent null reference errors
 * @returns {Object} A dummy element object with basic properties
 */
function createDummyElement() {
  return {
    textContent: '',
    innerHTML: '',
    style: {},
    value: '',
    checked: false,
    disabled: false,
    addEventListener: () => {},
    removeEventListener: () => {},
    focus: () => {},
    click: () => {}
  };
}

/**
 * Safely retrieves a DOM element by ID with fallback to dummy element
 * @param {string} id - Element ID
 * @param {boolean} required - Whether to log warning if element missing
 * @returns {HTMLElement|Object} Element or dummy element
 */
function safeGetElement(id, required = false) {
  const element = document.getElementById(id);
  if (!element && required) {
    console.warn(`Required element '${id}' not found in DOM`);
  }
  return element || createDummyElement();
}

/**
 * Main application initialization function - FIXED VERSION
 * 
 * This function coordinates the complete application startup process with proper
 * error handling and DOM element validation.
 * 
 * @returns {void} Fully initializes the application interface
 */
document.addEventListener('DOMContentLoaded', () => {

  console.log(`=== APPLICATION INITIALIZATION STARTED (v${APP_VERSION}) ===`);

  try {
    // Phase 1: Initialize Core DOM Elements
    debugLog('Phase 1: Initializing core DOM elements...');
    
    // Core form elements
    elements.inventoryForm = safeGetElement('inventoryForm', true);
    
    const inventoryTableEl = safeGetElement('inventoryTable', true);
    elements.inventoryTable = inventoryTableEl ? inventoryTableEl.querySelector('tbody') : null;
    
    elements.itemMetal = safeGetElement('itemMetal', true);
    elements.itemName = safeGetElement('itemName', true);
    elements.itemQty = safeGetElement('itemQty', true);
    elements.itemType = safeGetElement('itemType', true);
    elements.itemWeight = safeGetElement('itemWeight', true);
    elements.itemPrice = safeGetElement('itemPrice', true);
    elements.purchaseLocation = safeGetElement('purchaseLocation', true);
    elements.storageLocation = safeGetElement('storageLocation');
    elements.itemNotes = safeGetElement('itemNotes');
    elements.itemDate = safeGetElement('itemDate', true);

    // Header buttons - CRITICAL
    debugLog('Phase 2: Initializing header buttons...');
    elements.apiBtn = safeGetElement('apiBtn', true);
    elements.aboutBtn = safeGetElement('aboutBtn');
    elements.themeToggle = safeGetElement('themeToggle', true);
    
    // Check if critical buttons exist
    debugLog('API Button found:', !!document.getElementById('apiBtn'));
    debugLog('Theme Toggle found:', !!document.getElementById('themeToggle'));

    // Import/Export elements
    debugLog('Phase 3: Initializing import/export elements...');
    elements.importCsvFile = safeGetElement('importCsvFile');
    elements.importJsonFile = safeGetElement('importJsonFile');
    elements.importExcelFile = safeGetElement('importExcelFile');
    elements.exportCsvBtn = safeGetElement('exportCsvBtn');
    elements.exportJsonBtn = safeGetElement('exportJsonBtn');
    elements.exportExcelBtn = safeGetElement('exportExcelBtn');
    elements.exportPdfBtn = safeGetElement('exportPdfBtn');
    elements.exportHtmlBtn = safeGetElement('exportHtmlBtn');
    elements.backupAllBtn = safeGetElement('backupAllBtn');
    elements.boatingAccidentBtn = safeGetElement('boatingAccidentBtn');

    // Modal elements
    debugLog('Phase 4: Initializing modal elements...');
    elements.apiModal = safeGetElement('apiModal');
    elements.aboutModal = safeGetElement('aboutModal');
    elements.ackModal = safeGetElement('ackModal');
    elements.ackAcceptBtn = safeGetElement('ackAcceptBtn');
    elements.editModal = safeGetElement('editModal');
    elements.editForm = safeGetElement('editForm');
    elements.cancelEditBtn = safeGetElement('cancelEdit');
    elements.editMetal = safeGetElement('editMetal');
    elements.editName = safeGetElement('editName');
    elements.editQty = safeGetElement('editQty');
    elements.editType = safeGetElement('editType');
    elements.editWeight = safeGetElement('editWeight');
    elements.editPrice = safeGetElement('editPrice');
    elements.editPurchaseLocation = safeGetElement('editPurchaseLocation');
    elements.editStorageLocation = safeGetElement('editStorageLocation');
    elements.editNotes = safeGetElement('editNotes');
    elements.editDate = safeGetElement('editDate');
    elements.editSpotPrice = safeGetElement('editSpotPrice');

    // Show acknowledgment modal immediately and set up modal events
    if (typeof setupAckModalEvents === 'function') {
      setupAckModalEvents();
    }
    if (typeof showAckModal === 'function') {
      showAckModal();
    }
    if (typeof setupAboutModalEvents === 'function') {
      setupAboutModalEvents();
    }

    // Notes modal elements
    elements.notesModal = safeGetElement('notesModal');
    elements.notesTextarea = safeGetElement('notesTextarea');
    elements.saveNotesBtn = safeGetElement('saveNotes');
    elements.cancelNotesBtn = safeGetElement('cancelNotes');
    
    // Pagination elements
    debugLog('Phase 5: Initializing pagination elements...');
    elements.itemsPerPage = safeGetElement('itemsPerPage');
    elements.prevPage = safeGetElement('prevPage');
    elements.nextPage = safeGetElement('nextPage');
    elements.firstPage = safeGetElement('firstPage');
    elements.lastPage = safeGetElement('lastPage');
    elements.pageNumbers = safeGetElement('pageNumbers');
    elements.paginationInfo = safeGetElement('paginationInfo');
    
    // Search elements
    debugLog('Phase 6: Initializing search elements...');
    elements.searchInput = safeGetElement('searchInput');
    elements.clearSearchBtn = safeGetElement('clearSearchBtn');
    elements.searchResultsInfo = safeGetElement('searchResultsInfo');

    // Details modal elements
    debugLog('Phase 7: Initializing details modal elements...');
    elements.detailsModal = safeGetElement('detailsModal');
    elements.detailsModalTitle = safeGetElement('detailsModalTitle');
    elements.typeBreakdown = safeGetElement('typeBreakdown');
    elements.locationBreakdown = safeGetElement('locationBreakdown');
    elements.closeDetailsBtn = safeGetElement('closeDetailsBtn');
    elements.detailsButtons = document.querySelectorAll('.details-btn');

    // Chart elements
    debugLog('Phase 8: Initializing chart elements...');
    elements.typeChart = safeGetElement('typeChart');
    elements.locationChart = safeGetElement('locationChart');

    // Phase 9: Initialize Metal-Specific Elements
    debugLog('Phase 9: Initializing metal-specific elements...');
    
    // Initialize nested objects
    elements.spotPriceDisplay = {};
    elements.userSpotPriceInput = {};
    elements.saveSpotBtn = {};
    elements.resetSpotBtn = {};
    
    Object.values(METALS).forEach(metalConfig => {
      const metalKey = metalConfig.key;
      const metalName = metalConfig.name;
      
      debugLog(`  Setting up ${metalName} elements...`);
      
      // Spot price display elements with CORRECT IDs
      elements.spotPriceDisplay[metalKey] = safeGetElement(`spotPriceDisplay${metalName}`);
      elements.userSpotPriceInput[metalKey] = safeGetElement(`userSpotPrice${metalName}`);
      elements.saveSpotBtn[metalKey] = safeGetElement(`saveSpotBtn${metalName}`);
      elements.resetSpotBtn[metalKey] = safeGetElement(`resetSpotBtn${metalName}`);
      
      // Debug log for each metal
      const displayEl = document.getElementById(`spotPriceDisplay${metalName}`);
      const inputEl = document.getElementById(`userSpotPrice${metalName}`);
      debugLog(`    - ${metalName} display element:`, !!displayEl);
      debugLog(`    - ${metalName} input element:`, !!inputEl);
    });

    // Phase 10: Initialize Totals Elements
    debugLog('Phase 10: Initializing totals elements...');
    
    if (!elements.totals) {
      elements.totals = {};
    }
    
    Object.values(METALS).forEach(metalConfig => {
      const metalKey = metalConfig.key;
      const metalName = metalConfig.name;
      
      elements.totals[metalKey] = {
        items: safeGetElement(`totalItems${metalName}`),
        weight: safeGetElement(`totalWeight${metalName}`),
        value: safeGetElement(`currentValue${metalName}`),
        purchased: safeGetElement(`totalPurchased${metalName}`),
        premium: safeGetElement(`totalPremium${metalName}`),
        lossProfit: safeGetElement(`lossProfit${metalName}`),
        avgPrice: safeGetElement(`avgPrice${metalName}`),
        avgPremium: safeGetElement(`avgPremium${metalName}`),
        avgCollectablePrice: safeGetElement(`avgCollectablePrice${metalName}`),
        avgNonCollectablePrice: safeGetElement(`avgNonCollectablePrice${metalName}`)
      };
    });

    // Initialize "All" totals
    elements.totals.all = {
      items: safeGetElement('totalItemsAll'),
      weight: safeGetElement('totalWeightAll'),
      value: safeGetElement('currentValueAll'),
      purchased: safeGetElement('totalPurchasedAll'),
      premium: safeGetElement('totalPremiumAll'),
      lossProfit: safeGetElement('lossProfitAll'),
      avgPrice: safeGetElement('avgPriceAll'),
      avgPremium: safeGetElement('avgPremiumAll'),
      avgCollectablePrice: safeGetElement('avgCollectablePriceAll'),
      avgNonCollectablePrice: safeGetElement('avgNonCollectablePriceAll')
    };

    // Phase 11: Version Management
    debugLog('Phase 11: Updating version information...');
    document.title = getAppTitle();
    const appHeader = document.querySelector('.app-header h1');
    if (appHeader) {
      appHeader.textContent = getAppTitle();
    }
    const aboutVersion = document.getElementById('aboutVersion');
    if (aboutVersion) {
      aboutVersion.textContent = `v${APP_VERSION}`;
    }
    if (typeof loadChangelog === 'function') {
      loadChangelog();
    }

    // Phase 12: Data Initialization
    debugLog('Phase 12: Loading application data...');
    
    // Set default date
    if (elements.itemDate && elements.itemDate.value !== undefined) {
      elements.itemDate.value = todayStr();
    }
    
    // Load data
    loadInventory();
    loadSpotHistory();
    
    // Initialize API system
    apiConfig = loadApiConfig();
    apiCache = loadApiCache();

    // Phase 13: Initial Rendering
    debugLog('Phase 13: Rendering initial display...');
    renderTable();
    fetchSpotPrice();
    updateSyncButtonStates();

    // Phase 14: Event Listeners Setup (Delayed)
    debugLog('Phase 14: Setting up event listeners...');
    
    // Use a small delay to ensure all DOM manipulation is complete
    setTimeout(() => {
      try {
        setupEventListeners();
        setupPagination();
        setupSearch();
        setupThemeToggle();
        setupColumnResizing();
        debugLog('✓ All event listeners setup complete');
      } catch (eventError) {
        console.error('❌ Error setting up event listeners:', eventError);
        
        // Try basic event setup as fallback
        setupBasicEventListeners();
      }
    }, 200); // Increased delay for better compatibility
    
    // Phase 15: Completion
    debugLog('=== INITIALIZATION COMPLETE ===');
    debugLog('✓ Version:', APP_VERSION);
    debugLog('✓ API configured:', !!apiConfig);
    debugLog('✓ Inventory items:', inventory.length);
    debugLog('✓ Critical elements check:');
    debugLog('  - API button:', !!elements.apiBtn);
    debugLog('  - Theme toggle:', !!elements.themeToggle);
    debugLog('  - Inventory form:', !!elements.inventoryForm);
    debugLog('  - Inventory table:', !!elements.inventoryTable);
    
  } catch (error) {
    console.error('=== CRITICAL INITIALIZATION ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    // Try to show a user-friendly error message
    setTimeout(() => {
      alert(`Application initialization failed: ${error.message}\n\nPlease refresh the page and try again. If the problem persists, check the browser console for more details.`);
    }, 100);
  }
});

/**
 * Basic event listener setup as fallback
 */
function setupBasicEventListeners() {
  debugLog('Setting up basic event listeners as fallback...');
  
  // Theme toggle
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.onclick = function() {
      const currentTheme = localStorage.getItem(THEME_KEY) || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem(THEME_KEY, 'dark');
        this.textContent = 'Light Mode';
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem(THEME_KEY, 'light');
        this.textContent = 'Dark Mode';
      }
    };
  }
  
  // API button
  const apiBtn = document.getElementById('apiBtn');
  if (apiBtn) {
    apiBtn.onclick = function() {
      if (typeof showApiModal === 'function') {
        showApiModal();
      } else {
        alert('API configuration interface');
      }
    };
  }
  
  debugLog('Basic event listeners setup complete');
}

// Make functions available globally for inline event handlers
window.toggleCollectable = toggleCollectable;
window.showDetailsModal = showDetailsModal;
window.closeDetailsModal = closeDetailsModal;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.showNotes = showNotes;
window.applyColumnFilter = applyColumnFilter;
