// INITIALIZATION
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
 * Main application initialization function - entry point for the application
 * 
 * This function coordinates the complete application startup process:
 * 
 * DOM ELEMENT INITIALIZATION:
 * - Caches all DOM elements in the global elements object for performance
 * - Maps metal configurations to their corresponding DOM elements
 * - Initializes totals display elements with null-safety for missing elements
 * 
 * VERSION MANAGEMENT:
 * - Updates page title and header with current version from constants.js
 * - Ensures consistent version display across application
 * 
 * DATA LOADING:
 * - Restores inventory from localStorage with migration
 * - Loads spot price history for analytics
 * - Sets default form values (today's date)
 * 
 * INTERFACE SETUP:
 * - Renders initial table display
 * - Fetches current spot prices (if implemented)
 * - Applies saved theme preference
 * 
 * EVENT BINDING:
 * - Establishes all event listeners for user interactions
 * - Sets up pagination, search, and theme controls
 * - Initializes column resizing functionality
 * 
 * GLOBAL EXPOSURE:
 * - Makes key functions available to inline event handlers
 * - Ensures compatibility with HTML onclick attributes
 * 
 * @returns {void} Fully initializes the application interface
 * 
 * @example
 * // Automatically called when DOM is ready
 * document.addEventListener('DOMContentLoaded', initFunction);
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('=== APPLICATION INITIALIZATION STARTED ===');
  
  try {
    // Initialize DOM elements after DOM is loaded
    console.log('Initializing basic form elements...');
    
    // Core form elements - using safe element retrieval
    elements.inventoryForm = document.getElementById('inventoryForm');
    elements.inventoryTable = document.getElementById('inventoryTable') ? document.getElementById('inventoryTable').querySelector('tbody') : null;
    elements.itemMetal = document.getElementById('itemMetal');
    elements.itemName = document.getElementById('itemName');
    elements.itemQty = document.getElementById('itemQty');
    elements.itemType = document.getElementById('itemType');
    elements.itemWeight = document.getElementById('itemWeight');
    elements.itemPrice = document.getElementById('itemPrice');
    elements.purchaseLocation = document.getElementById('purchaseLocation');
    elements.storageLocation = document.getElementById('storageLocation');
    elements.itemNotes = document.getElementById('itemNotes');
    elements.itemDate = document.getElementById('itemDate');

    console.log('Initializing import/export elements...');
    elements.importCsvFile = document.getElementById('importCsvFile');
    elements.importJsonFile = document.getElementById('importJsonFile');
    elements.importExcelFile = document.getElementById('importExcelFile');
    elements.exportCsvBtn = document.getElementById('exportCsvBtn');
    elements.exportJsonBtn = document.getElementById('exportJsonBtn');
    elements.exportExcelBtn = document.getElementById('exportExcelBtn');
    elements.exportPdfBtn = document.getElementById('exportPdfBtn');
    elements.exportHtmlBtn = document.getElementById('exportHtmlBtn');
    elements.backupAllBtn = document.getElementById('backupAllBtn');
    elements.boatingAccidentBtn = document.getElementById('boatingAccidentBtn');

    // CRITICAL: Initialize header buttons - these were missing!
    console.log('Initializing header buttons...');
    elements.apiBtn = document.getElementById('apiBtn');
    elements.themeToggle = document.getElementById('themeToggle');
    
    // Debug: Check if critical buttons were found
    console.log('API Button found:', elements.apiBtn ? 'YES' : 'NO');
    console.log('Theme Toggle found:', elements.themeToggle ? 'YES' : 'NO');
    
    if (!elements.apiBtn) {
      console.error('CRITICAL: API button (id="apiBtn") not found in DOM!');
    }
    
    if (!elements.themeToggle) {
      console.error('CRITICAL: Theme toggle button (id="themeToggle") not found in DOM!');
    }

    // API and modal elements
    console.log('Initializing modal elements...');
    elements.apiModal = document.getElementById('apiModal');
    elements.editModal = document.getElementById('editModal');
    elements.editForm = document.getElementById('editForm');
    elements.cancelEditBtn = document.getElementById('cancelEdit');
    elements.editMetal = document.getElementById('editMetal');
    elements.editName = document.getElementById('editName');
    elements.editQty = document.getElementById('editQty');
    elements.editType = document.getElementById('editType');
    elements.editWeight = document.getElementById('editWeight');
    elements.editPrice = document.getElementById('editPrice');
    elements.editPurchaseLocation = document.getElementById('editPurchaseLocation');
    elements.editStorageLocation = document.getElementById('editStorageLocation');
    elements.editNotes = document.getElementById('editNotes');
    elements.editDate = document.getElementById('editDate');
    elements.editSpotPrice = document.getElementById('editSpotPrice');
    
    console.log('Initializing pagination elements...');
    elements.itemsPerPage = document.getElementById('itemsPerPage');
    elements.prevPage = document.getElementById('prevPage');
    elements.nextPage = document.getElementById('nextPage');
    elements.firstPage = document.getElementById('firstPage');
    elements.lastPage = document.getElementById('lastPage');
    elements.pageNumbers = document.getElementById('pageNumbers');
    elements.paginationInfo = document.getElementById('paginationInfo');
    
    console.log('Initializing search elements...');
    elements.searchInput = document.getElementById('searchInput');
    elements.clearSearchBtn = document.getElementById('clearSearchBtn');
    elements.searchResultsInfo = document.getElementById('searchResultsInfo');

    // Initialize details modal elements
    console.log('Initializing details modal elements...');
    elements.detailsModal = document.getElementById('detailsModal');
    elements.detailsModalTitle = document.getElementById('detailsModalTitle');
    elements.typeBreakdown = document.getElementById('typeBreakdown');
    elements.locationBreakdown = document.getElementById('locationBreakdown');

    // Initialize chart canvas elements
    console.log('Initializing chart elements...');
    elements.typeChart = document.getElementById('typeChart');
    elements.locationChart = document.getElementById('locationChart');

    // Update version numbers dynamically
    console.log('Updating version information...');
    document.title = getAppTitle();
    const appHeader = document.querySelector('.app-header h1');
    if (appHeader) {
      appHeader.textContent = getAppTitle();
    }

    // Initialize spot price elements for all metals - WITH NULL SAFETY
    console.log('Initializing metal-specific elements...');
    
    // Initialize the nested objects first
    elements.spotPriceDisplay = {};
    elements.userSpotPriceInput = {};
    elements.saveSpotBtn = {};
    elements.resetSpotBtn = {};
    
    Object.values(METALS).forEach(metalConfig => {
      const metalKey = metalConfig.key;
      const metalName = metalConfig.name;
      
      console.log(`Initializing elements for ${metalName} (key: ${metalKey})`);
      
      // Spot price display elements
      elements.spotPriceDisplay[metalKey] = document.getElementById(`spotPriceDisplay${metalName}`);
      elements.userSpotPriceInput[metalKey] = document.getElementById(`userSpotPrice${metalName}`);
      elements.saveSpotBtn[metalKey] = document.getElementById(`saveSpotBtn${metalName}`);
      elements.resetSpotBtn[metalKey] = document.getElementById(`resetSpotBtn${metalName}`);
      
      // Debug: Check if elements were found
      console.log(`  - spotPriceDisplay${metalName}:`, elements.spotPriceDisplay[metalKey] ? '✓' : '✗');
      console.log(`  - userSpotPrice${metalName}:`, elements.userSpotPriceInput[metalKey] ? '✓' : '✗');
      console.log(`  - saveSpotBtn${metalName}:`, elements.saveSpotBtn[metalKey] ? '✓' : '✗');
      console.log(`  - resetSpotBtn${metalName}:`, elements.resetSpotBtn[metalKey] ? '✓' : '✗');
      
      // Create dummy elements for missing ones to prevent null errors
      if (!elements.spotPriceDisplay[metalKey]) {
        console.warn(`Creating dummy spotPriceDisplay for ${metalName}`);
        elements.spotPriceDisplay[metalKey] = { textContent: '$ -' };
      }
      
      if (!elements.userSpotPriceInput[metalKey]) {
        console.warn(`Creating dummy userSpotPriceInput for ${metalName}`);
        elements.userSpotPriceInput[metalKey] = { 
          value: '',
          addEventListener: () => {}
        };
      }
      
      if (!elements.saveSpotBtn[metalKey]) {
        console.warn(`Creating dummy saveSpotBtn for ${metalName}`);
        elements.saveSpotBtn[metalKey] = { 
          addEventListener: () => {},
          disabled: true
        };
      }
      
      if (!elements.resetSpotBtn[metalKey]) {
        console.warn(`Creating dummy resetSpotBtn for ${metalName}`);
        elements.resetSpotBtn[metalKey] = { 
          addEventListener: () => {},
          disabled: true
        };
      }
    });

    // Initialize totals elements - WITH NULL SAFETY
    console.log('Initializing totals elements...');
    
    // Initialize the nested totals object
    if (!elements.totals) {
      elements.totals = {};
    }
    
    Object.values(METALS).forEach(metalConfig => {
      const metalKey = metalConfig.key;
      const metalName = metalConfig.name;
      
      elements.totals[metalKey] = {
        items: document.getElementById(`totalItems${metalName}`) || createDummyElement(),
        weight: document.getElementById(`totalWeight${metalName}`) || createDummyElement(),
        value: document.getElementById(`currentValue${metalName}`) || createDummyElement(),
        purchased: document.getElementById(`totalPurchased${metalName}`) || createDummyElement(),
        premium: document.getElementById(`totalPremium${metalName}`) || createDummyElement(),
        lossProfit: document.getElementById(`lossProfit${metalName}`) || createDummyElement(),
        avgPrice: document.getElementById(`avgPrice${metalName}`) || createDummyElement(),
        avgPremium: document.getElementById(`avgPremium${metalName}`) || createDummyElement(),
        avgCollectablePrice: document.getElementById(`avgCollectablePrice${metalName}`) || createDummyElement(),
        avgNonCollectablePrice: document.getElementById(`avgNonCollectablePrice${metalName}`) || createDummyElement()
      };
    });

    // Initialize "All" totals with null safety
    elements.totals.all = {
      items: document.getElementById('totalItemsAll') || createDummyElement(),
      weight: document.getElementById('totalWeightAll') || createDummyElement(),
      value: document.getElementById('currentValueAll') || createDummyElement(),
      purchased: document.getElementById('totalPurchasedAll') || createDummyElement(),
      premium: document.getElementById('totalPremiumAll') || createDummyElement(),
      lossProfit: document.getElementById('lossProfitAll') || createDummyElement(),
      avgPrice: document.getElementById('avgPriceAll') || createDummyElement(),
      avgPremium: document.getElementById('avgPremiumAll') || createDummyElement(),
      avgCollectablePrice: document.getElementById('avgCollectablePriceAll') || createDummyElement(),
      avgNonCollectablePrice: document.getElementById('avgNonCollectablePriceAll') || createDummyElement()
    };

    // Initialize app data
    console.log('Loading application data...');
    if (elements.itemDate) {
      elements.itemDate.value = todayStr();
    }
    
    loadInventory();
    loadSpotHistory();
    
    // Initialize API system
    console.log('Initializing API system...');
    apiConfig = loadApiConfig();
    apiCache = loadApiCache();
    
    // Render initial display
    console.log('Rendering initial display...');
    renderTable();
    fetchSpotPrice();
    
    // Update sync button states based on API availability
    updateSyncButtonStates();

    // Setup event listeners - this is critical and needs to be delayed slightly for file:// protocol
    console.log('Setting up event listeners...');
    
    // Small delay to ensure all DOM elements are fully loaded
    setTimeout(() => {
      try {
        setupEventListeners();
        setupPagination();
        setupSearch();
        setupThemeToggle();
        setupColumnResizing();
        
        console.log('=== EVENT LISTENERS SETUP COMPLETE ===');
      } catch (eventError) {
        console.error('Error setting up event listeners:', eventError);
        console.error('Event setup stack trace:', eventError.stack);
      }
    }, 100);
    
    // Log initialization completion
    console.log('=== APPLICATION INITIALIZATION COMPLETE ===');
    console.log('API configured:', !!apiConfig);
    console.log('API cache available:', !!apiCache && !!apiCache.data);
    console.log('Critical button check:');
    console.log('- API button element:', !!elements.apiBtn);
    console.log('- Theme toggle element:', !!elements.themeToggle);
    console.log('- Inventory form element:', !!elements.inventoryForm);
    console.log('- Inventory table element:', !!elements.inventoryTable);
    
  } catch (error) {
    console.error('=== INITIALIZATION ERROR ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    
    // Try to show user-friendly error
    const errorMessage = `Application initialization failed: ${error.message}
    
Please check:
1. All JavaScript files are properly loaded
2. HTML elements have correct IDs
3. Browser console for detailed error information

Reload the page to try again.`;
    
    alert(errorMessage);
  }
});

// Make functions available globally for inline event handlers
window.toggleCollectable = toggleCollectable;
window.showDetailsModal = showDetailsModal;
window.closeDetailsModal = closeDetailsModal;
window.editItem = editItem;
window.deleteItem = deleteItem;
