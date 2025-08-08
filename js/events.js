/**
 * EVENTS MODULE - FIXED VERSION
 * 
 * Handles all DOM event listeners with proper null checking and error handling.
 * Includes file protocol compatibility fixes and fallback event attachment methods.
 */

// EVENT UTILITIES
// =============================================================================

/**
 * Safely attaches event listener with fallback methods
 * @param {HTMLElement} element - Element to attach listener to
 * @param {string} event - Event type
 * @param {Function} handler - Event handler function
 * @param {string} description - Description for logging
 * @returns {boolean} Success status
 */
const safeAttachListener = (element, event, handler, description = '') => {
  if (!element) {
    console.warn(`Cannot attach ${event} listener: element not found (${description})`);
    return false;
  }

  try {
    // Method 1: Standard addEventListener
    element.addEventListener(event, handler);
    return true;
  } catch (error) {
    console.warn(`Standard addEventListener failed for ${description}:`, error);
    
    try {
      // Method 2: Legacy event handler
      element['on' + event] = handler;
      debugLog(`✓ Fallback event handler attached: ${description}`);
      return true;
    } catch (fallbackError) {
      console.error(`All event attachment methods failed for ${description}:`, fallbackError);
      return false;
    }
  }
};

/**
 * Implements dynamic column resizing for the inventory table
 */
const setupColumnResizing = () => {
  const table = document.getElementById('inventoryTable');
  if (!table) {
    console.warn('Inventory table not found for column resizing');
    return;
  }

  // Clear any existing resize handles
  const existingHandles = table.querySelectorAll('.resize-handle');
  existingHandles.forEach(handle => handle.remove());

  let isResizing = false;
  let currentColumn = null;
  let startX = 0;
  let startWidth = 0;

  // Add resize handles to table headers
  const headers = table.querySelectorAll('th');
  headers.forEach((header, index) => {
    // Skip the last column (delete button)
    if (index === headers.length - 1) return;

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';

    header.style.position = 'relative';
    header.appendChild(resizeHandle);

    safeAttachListener(resizeHandle, 'mousedown', (e) => {
      isResizing = true;
      currentColumn = header;
      startX = e.clientX;
      startWidth = parseInt(document.defaultView.getComputedStyle(header).width, 10);
      
      e.preventDefault();
      e.stopPropagation();
      
      // Prevent header click event from firing
      header.style.pointerEvents = 'none';
      setTimeout(() => {
        header.style.pointerEvents = 'auto';
      }, 100);
    }, 'Column resize handle');
  });

  // Handle mouse move for resizing
  safeAttachListener(document, 'mousemove', (e) => {
    if (!isResizing || !currentColumn) return;

    const width = startWidth + e.clientX - startX;
    const minWidth = 40;
    const maxWidth = 300;
    
    if (width >= minWidth && width <= maxWidth) {
      currentColumn.style.width = width + 'px';
    }
  }, 'Document mousemove for resizing');

  // Handle mouse up to stop resizing
  safeAttachListener(document, 'mouseup', () => {
    if (isResizing) {
      isResizing = false;
      currentColumn = null;
    }
  }, 'Document mouseup for resizing');

  // Prevent text selection during resize
  safeAttachListener(document, 'selectstart', (e) => {
    if (isResizing) {
      e.preventDefault();
    }
  }, 'Document selectstart for resizing');
};

// MAIN EVENT LISTENERS SETUP
// =============================================================================

/**
 * Sets up all primary event listeners for the application
 */
const setupEventListeners = () => {

  console.log(`Setting up event listeners (v${APP_VERSION})...`);

  try {
    // CRITICAL HEADER BUTTONS
    debugLog('Setting up header buttons...');
    
    // API Button
    if (elements.apiBtn) {
      safeAttachListener(elements.apiBtn, 'click', (e) => {
        e.preventDefault();
        debugLog('API button clicked');
        if (typeof showApiModal === 'function') {
          showApiModal();
        } else {
          alert('API Configuration Modal\n\nThis would open the API configuration interface where you can:\n\n• Configure API providers\n• Set API keys\n• Sync spot prices automatically\n• View API status and cache info');
        }
      }, 'API Button');
    } else {
      console.error('API button element not found!');
    }

    // Theme Toggle Button
    if (elements.themeToggle) {
      safeAttachListener(elements.themeToggle, 'click', (e) => {
        e.preventDefault();
        debugLog('Theme toggle clicked');
        
        if (typeof toggleTheme === 'function') {
          toggleTheme();
        } else if (typeof setTheme === 'function') {
          // Fallback to manual toggle
          const currentTheme = localStorage.getItem(THEME_KEY) || 'light';
          const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
          setTheme(newTheme);
        } else {
          // Ultimate fallback
          const currentTheme = document.documentElement.getAttribute('data-theme');
          const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
          if (newTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem(THEME_KEY, 'dark');
            elements.themeToggle.textContent = 'Light Mode';
          } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem(THEME_KEY, 'light');
            elements.themeToggle.textContent = 'Dark Mode';
          }
        }
      }, 'Theme Toggle');
    } else {
      console.error('Theme toggle button element not found!');
    }

    // TABLE HEADER SORTING
    debugLog('Setting up table sorting...');
    const inventoryTable = document.getElementById('inventoryTable');
    if (inventoryTable) {
      const headers = inventoryTable.querySelectorAll('th');
      headers.forEach((header, index) => {
        // Skip Notes/Delete columns (last two)
        if (index >= headers.length - 2) {
          return;
        }

        header.style.cursor = 'pointer';

        safeAttachListener(header, 'click', () => {
          // Toggle sort direction if same column, otherwise set to new column with asc
          if (sortColumn === index) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
          } else {
            sortColumn = index;
            sortDirection = 'asc';
          }

          renderTable();
        }, `Table header ${index}`);
      });
    } else {
      console.error('Inventory table not found for sorting setup!');
    }

    // MAIN FORM SUBMISSION
    debugLog('Setting up main form...');
    if (elements.inventoryForm) {
      safeAttachListener(elements.inventoryForm, 'submit', function(e) {
        e.preventDefault();

        const metal = elements.itemMetal.value;
        const name = elements.itemName.value.trim();
        const qty = parseInt(elements.itemQty.value, 10);
        const type = elements.itemType.value;
        const weight = parseFloat(elements.itemWeight.value);
        const price = parseFloat(elements.itemPrice.value);
        const purchaseLocation = elements.purchaseLocation.value.trim() || "Unknown";
        const storageLocation = elements.storageLocation.value.trim() || "Unknown";
        const notes = elements.itemNotes.value.trim() || "";
        const date = elements.itemDate.value || todayStr();

        if (isNaN(qty) || qty < 1 || !Number.isInteger(qty) ||
            isNaN(weight) || weight <= 0 ||
            isNaN(price) || price < 0) {
          return alert("Please enter valid values for all fields.");
        }

        // Get current spot price
        const metalKey = metal.toLowerCase();
        const spotPriceAtPurchase = spotPrices[metalKey];

        // Calculate premium per ounce (only for non-collectible items)
        let premiumPerOz = 0;
        let totalPremium = 0;

        // For new items, they're not collectable by default
        const isCollectable = false;

        if (!isCollectable) {
          const pricePerOz = price / weight;
          premiumPerOz = pricePerOz - spotPriceAtPurchase;
          totalPremium = premiumPerOz * qty * weight;
        }

        inventory.push({ 
          metal, 
          name, 
          qty, 
          type, 
          weight, 
          price, 
          date,
          purchaseLocation,
          storageLocation,
          notes,
          spotPriceAtPurchase,
          premiumPerOz,
          totalPremium,
          isCollectable
        });

        saveInventory();
        renderTable();
        this.reset();
        elements.itemDate.value = todayStr();
      }, 'Main inventory form');
    } else {
      console.error('Main inventory form not found!');
    }

    // EDIT FORM SUBMISSION
    debugLog('Setting up edit form...');
    if (elements.editForm) {
      safeAttachListener(elements.editForm, 'submit', function(e) {
        e.preventDefault();

        if (editingIndex === null) return;

        const metal = elements.editMetal.value;
        const name = elements.editName.value.trim();
        const qty = parseInt(elements.editQty.value, 10);
        const type = elements.editType.value;
        const weight = parseFloat(elements.editWeight.value);
        const price = parseFloat(elements.editPrice.value);
        const purchaseLocation = elements.editPurchaseLocation.value.trim() || "Unknown";
        const storageLocation = elements.editStorageLocation.value.trim() || "Unknown";
        const notes = elements.editNotes.value.trim() || "";
        const date = elements.editDate.value;

        // Use the checkbox state the user just set
        const isCollectable = document.getElementById("editCollectable").checked;

        // Get spot price input value
        const spotPriceInput = elements.editSpotPrice.value.trim();

        // If spot price is empty and item is not collectable, use current spot price
        let spotPriceAtPurchase;
        if (!isCollectable && spotPriceInput === '') {
          const metalKey = metal.toLowerCase();
          spotPriceAtPurchase = spotPrices[metalKey];
        } else {
          spotPriceAtPurchase = parseFloat(spotPriceInput);
        }

        if (isNaN(qty) || qty < 1 || !Number.isInteger(qty) ||
            isNaN(weight) || weight <= 0 ||
            isNaN(price) || price < 0 ||
            (!isCollectable && (isNaN(spotPriceAtPurchase) || spotPriceAtPurchase <= 0))) {
          return alert("Please enter valid values for all fields.");
        }

        // Calculate premium per ounce (only for non-collectible items)
        let premiumPerOz = 0;
        let totalPremium = 0;

        if (!isCollectable) {
          const pricePerOz = price / weight;
          premiumPerOz = pricePerOz - spotPriceAtPurchase;
          totalPremium = premiumPerOz * qty * weight;
        }

        // Update the item
        inventory[editingIndex] = {
          metal,
          name,
          qty,
          type,
          weight,
          price,
          date,
          purchaseLocation,
          storageLocation,
          notes,
          spotPriceAtPurchase: isCollectable ? 0 : spotPriceAtPurchase,
          premiumPerOz,
          totalPremium,
          isCollectable
        };

        saveInventory();
        renderTable();

        // Close modal
        elements.editModal.style.display = 'none';
        editingIndex = null;
      }, 'Edit form');
    }

    // CANCEL EDIT BUTTON
    if (elements.cancelEditBtn) {
      safeAttachListener(elements.cancelEditBtn, 'click', function() {
        elements.editModal.style.display = 'none';
        editingIndex = null;
      }, 'Cancel edit button');
    }

    // SPOT PRICE EVENT LISTENERS
    debugLog('Setting up spot price listeners...');
    Object.values(METALS).forEach(metalConfig => {
      const metalKey = metalConfig.key;
      const metalName = metalConfig.name;
      
      // Main spot price action buttons
      const addBtn = document.getElementById(`addBtn${metalName}`);
      const resetBtn = document.getElementById(`resetBtn${metalName}`);
      const syncBtn = document.getElementById(`syncBtn${metalName}`);
      
      // Manual input buttons
      const saveBtn = elements.saveSpotBtn[metalKey];
      const cancelBtn = document.getElementById(`cancelSpotBtn${metalName}`);
      const inputEl = elements.userSpotPriceInput[metalKey];
      
      // Add button - shows manual input
      if (addBtn) {
        safeAttachListener(addBtn, 'click', () => {
          debugLog(`Add button clicked for ${metalName}`);
          const manualInput = document.getElementById(`manualInput${metalName}`);
          if (manualInput) {
            manualInput.style.display = 'block';
            const input = document.getElementById(`userSpotPrice${metalName}`);
            if (input) input.focus();
          }
        }, `Add spot price for ${metalName}`);
      }
      
      // Reset button
      if (resetBtn) {
        safeAttachListener(resetBtn, 'click', () => {
          debugLog(`Reset button clicked for ${metalName}`);
          if (typeof resetSpotPrice === 'function') {
            resetSpotPrice(metalName);
          } else {
            // Fallback reset functionality
            const defaultPrice = metalConfig.defaultPrice;
            localStorage.setItem(metalConfig.localStorageKey, defaultPrice.toString());
            spotPrices[metalKey] = defaultPrice;
            if (elements.spotPriceDisplay[metalKey]) {
              elements.spotPriceDisplay[metalKey].textContent = formatDollar(defaultPrice);
            }
            updateSummary();
          }
        }, `Reset spot price for ${metalName}`);
      }
      
      // Sync button
      if (syncBtn) {
        safeAttachListener(syncBtn, 'click', () => {
          debugLog(`Sync button clicked for ${metalName}`);
          if (typeof syncSpotPricesFromApi === 'function') {
            syncSpotPricesFromApi(true);
          } else {
            alert('API sync functionality requires API configuration. Please configure an API provider first.');
          }
        }, `Sync spot price for ${metalName}`);
      }
      
      // Save button (in manual input)
      if (saveBtn) {
        safeAttachListener(saveBtn, 'click', () => {
          if (typeof updateManualSpot === 'function') {
            updateManualSpot(metalKey);
          } else {
            console.error(`updateManualSpot function not available for ${metalName}`);
          }
        }, `Save manual spot price for ${metalName}`);
      }
      
      // Cancel button (in manual input)
      if (cancelBtn) {
        safeAttachListener(cancelBtn, 'click', () => {
          const manualInput = document.getElementById(`manualInput${metalName}`);
          if (manualInput) {
            manualInput.style.display = 'none';
            const input = document.getElementById(`userSpotPrice${metalName}`);
            if (input) input.value = '';
          }
        }, `Cancel manual spot price for ${metalName}`);
      }
      
      // Enter key in input field
      if (inputEl) {
        safeAttachListener(inputEl, 'keydown', (e) => {
          if (e.key === 'Enter' && typeof updateManualSpot === 'function') {
            updateManualSpot(metalKey);
          }
        }, `Manual spot price input for ${metalName}`);
      }
    });

    // IMPORT/EXPORT EVENT LISTENERS
    debugLog('Setting up import/export listeners...');
    
    if (elements.importCsvFile) {
      safeAttachListener(elements.importCsvFile, 'change', function(e) {
        if (e.target.files.length > 0) {
          importCsv(e.target.files[0]);
        }
        this.value = '';
      }, 'CSV import');
    }

    if (elements.importJsonFile) {
      safeAttachListener(elements.importJsonFile, 'change', function(e) {
        if (e.target.files.length > 0) {
          importJson(e.target.files[0]);
        }
        this.value = '';
      }, 'JSON import');
    }

    if (elements.importExcelFile) {
      safeAttachListener(elements.importExcelFile, 'change', function(e) {
        if (e.target.files.length > 0) {
          importExcel(e.target.files[0]);
        }
        this.value = '';
      }, 'Excel import');
    }

    // Export buttons
    if (elements.exportCsvBtn) {
      safeAttachListener(elements.exportCsvBtn, 'click', exportCsv, 'CSV export');
    }
    if (elements.exportJsonBtn) {
      safeAttachListener(elements.exportJsonBtn, 'click', exportJson, 'JSON export');
    }
    if (elements.exportExcelBtn) {
      safeAttachListener(elements.exportExcelBtn, 'click', exportExcel, 'Excel export');
    }
    if (elements.exportPdfBtn) {
      safeAttachListener(elements.exportPdfBtn, 'click', exportPdf, 'PDF export');
    }
    if (elements.exportHtmlBtn) {
      safeAttachListener(elements.exportHtmlBtn, 'click', exportHtml, 'HTML export');
    }

    // Backup All Button
    if (elements.backupAllBtn) {
      safeAttachListener(elements.backupAllBtn, 'click', async () => {
        if (typeof createBackupZip === 'function') {
          await createBackupZip();
        } else {
          // Fallback: simple backup
          alert('Creating backup using export functions...');
          exportCsv();
          exportJson();
        }
      }, 'Backup all button');
    }

    // BOATING ACCIDENT BUTTON
    if (elements.boatingAccidentBtn) {
      safeAttachListener(elements.boatingAccidentBtn, 'click', function() {
        if (confirm("WARNING: This will erase ALL your data for this app (inventory, spot history, spot prices, API configuration).\n\nAre you sure you want to proceed?\n\nThis action cannot be undone!")) {
          localStorage.removeItem(LS_KEY);
          localStorage.removeItem(SPOT_HISTORY_KEY);
          localStorage.removeItem(API_KEY_STORAGE_KEY);
          localStorage.removeItem(API_CACHE_KEY);
          Object.values(METALS).forEach(metalConfig => {
            localStorage.removeItem(metalConfig.localStorageKey);
          });
          sessionStorage.clear();

          loadInventory();
          renderTable();
          loadSpotHistory();
          fetchSpotPrice();
          
          // Clear API state
          apiConfig = null;
          apiCache = null;
          updateSyncButtonStates();
          
          alert("All data has been erased.");
        }
      }, 'Boating accident button');
    }
    
    // API MODAL EVENT LISTENERS
    debugLog('Setting up API modal listeners...');
    setupApiEvents();

    debugLog('✓ All event listeners setup complete');
    
  } catch (error) {
    console.error('❌ Error setting up event listeners:', error);
    throw error; // Re-throw to trigger fallback in init.js
  }
};

/**
 * Sets up pagination event listeners
 */
const setupPagination = () => {
  debugLog('Setting up pagination listeners...');
  
  try {
    if (elements.itemsPerPage) {
      safeAttachListener(elements.itemsPerPage, 'change', function() {
        itemsPerPage = parseInt(this.value);
        currentPage = 1;
        renderTable();
      }, 'Items per page select');
    }

    if (elements.prevPage) {
      safeAttachListener(elements.prevPage, 'click', function() {
        if (currentPage > 1) {
          currentPage--;
          renderTable();
        }
      }, 'Previous page button');
    }

    if (elements.nextPage) {
      safeAttachListener(elements.nextPage, 'click', function() {
        const totalPages = calculateTotalPages(filterInventory());
        if (currentPage < totalPages) {
          currentPage++;
          renderTable();
        }
      }, 'Next page button');
    }

    if (elements.firstPage) {
      safeAttachListener(elements.firstPage, 'click', function() {
        currentPage = 1;
        renderTable();
      }, 'First page button');
    }

    if (elements.lastPage) {
      safeAttachListener(elements.lastPage, 'click', function() {
        currentPage = calculateTotalPages(filterInventory());
        renderTable();
      }, 'Last page button');
    }
    
    debugLog('✓ Pagination listeners setup complete');
  } catch (error) {
    console.error('❌ Error setting up pagination listeners:', error);
  }
};

/**
 * Sets up search event listeners
 */
const setupSearch = () => {
  debugLog('Setting up search listeners...');
  
  try {
    if (elements.searchInput) {
      safeAttachListener(elements.searchInput, 'input', function() {
        searchQuery = this.value;
        currentPage = 1; // Reset to first page when search changes
        renderTable();
      }, 'Search input');
    }

    if (elements.clearSearchBtn) {
      safeAttachListener(elements.clearSearchBtn, 'click', function() {
        if (elements.searchInput) {
          elements.searchInput.value = '';
        }
        searchQuery = '';
        columnFilter = { field: null, value: null };
        currentPage = 1;
        renderTable();
      }, 'Clear search button');
    }
    
    debugLog('✓ Search listeners setup complete');
  } catch (error) {
    console.error('❌ Error setting up search listeners:', error);
  }
};

/**
 * Sets up theme toggle event listeners
 */
const setupThemeToggle = () => {
  debugLog('Setting up theme toggle...');
  
  try {
    // Initialize theme with system preference detection
    if (typeof initTheme === 'function') {
      initTheme();
    } else {
      // Fallback initialization
      const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
      setTheme(savedTheme);
    }
    
    // Set up system theme change listener
    if (typeof setupSystemThemeListener === 'function') {
      setupSystemThemeListener();
    }
    
    debugLog('✓ Theme toggle setup complete');
  } catch (error) {
    console.error('❌ Error setting up theme toggle:', error);
  }
};

/**
 * Sets up API-related event listeners
 */
const setupApiEvents = () => {
  debugLog('Setting up API events...');
  
  try {
    // API Modal Events
    const apiModal = document.getElementById('apiModal');
    const apiCancelBtn = document.getElementById('apiCancelBtn');
    const apiClearBtn = document.getElementById('apiClearBtn');
    const apiConfigForm = document.getElementById('apiConfigForm');
    const apiProviderSelect = document.getElementById('apiProvider');

    // Modal background click to close
    if (apiModal) {
      safeAttachListener(apiModal, 'click', (e) => {
        if (e.target === apiModal && typeof hideApiModal === 'function') {
          hideApiModal();
        }
      }, 'API modal background');
    }

    // Cancel button
    if (apiCancelBtn) {
      safeAttachListener(apiCancelBtn, 'click', () => {
        if (typeof hideApiModal === 'function') {
          hideApiModal();
        }
      }, 'API cancel button');
    }

    // Clear configuration button
    if (apiClearBtn) {
      safeAttachListener(apiClearBtn, 'click', () => {
        if (confirm('This will remove your API configuration and cached data. Continue?')) {
          if (typeof clearApiConfig === 'function') {
            clearApiConfig();
          }
          if (typeof hideApiModal === 'function') {
            hideApiModal();
          }
          alert('API configuration cleared.');
        }
      }, 'API clear button');
    }
    
    // Sync now button
    const apiSyncNowBtn = document.getElementById('apiSyncNowBtn');
    if (apiSyncNowBtn) {
      safeAttachListener(apiSyncNowBtn, 'click', async () => {
        if (typeof syncSpotPricesFromApi === 'function') {
          const success = await syncSpotPricesFromApi(true, true);
          if (success && typeof updateApiStatus === 'function') {
            updateApiStatus();
          }
        }
      }, 'API sync now button');
    }
    
    // Clear cache button
    const apiClearCacheBtn = document.getElementById('apiClearCacheBtn');
    if (apiClearCacheBtn) {
      safeAttachListener(apiClearCacheBtn, 'click', () => {
        if (typeof clearApiCache === 'function') {
          clearApiCache();
        }
      }, 'API clear cache button');
    }

    // Form submission
    if (apiConfigForm) {
      safeAttachListener(apiConfigForm, 'submit', (e) => {
        if (typeof handleApiConfigSubmit === 'function') {
          handleApiConfigSubmit(e);
        } else {
          e.preventDefault();
          alert('API configuration handler not available');
        }
      }, 'API config form');
    }

    // Provider selection change
    if (apiProviderSelect) {
      safeAttachListener(apiProviderSelect, 'change', (e) => {
        if (typeof updateProviderInfo === 'function') {
          updateProviderInfo(e.target.value);
        }
      }, 'API provider select');
    }

    // ESC key to close modals
    safeAttachListener(document, 'keydown', (e) => {
      if (e.key === 'Escape') {
        const apiModal = document.getElementById('apiModal');
        const editModal = document.getElementById('editModal');
        const detailsModal = document.getElementById('detailsModal');
        
        if (apiModal && apiModal.style.display === 'flex' && typeof hideApiModal === 'function') {
          hideApiModal();
        } else if (editModal && editModal.style.display === 'flex') {
          editModal.style.display = 'none';
          editingIndex = null;
        } else if (detailsModal && detailsModal.style.display === 'flex' && typeof closeDetailsModal === 'function') {
          closeDetailsModal();
        }
      }
    }, 'ESC key modal close');

    debugLog('✓ API events setup complete');
  } catch (error) {
    console.error('❌ Error setting up API events:', error);
  }
};

// =============================================================================
