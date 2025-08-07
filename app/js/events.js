/**
 * Implements dynamic column resizing for the inventory table
 * 
 * This function adds interactive resize handles to table headers that allow users to:
 * - Drag column borders to adjust width
 * - Maintain minimum and maximum column widths
 * - Provide visual feedback during resize operations
 * - Prevent text selection during drag operations
 * - Clean up existing handles before re-adding (for table re-renders)
 * 
 * Technical implementation:
 * - Adds resize handles as DOM elements positioned on column borders
 * - Uses mouse event listeners for drag detection and movement
 * - Calculates new widths based on mouse position changes
 * - Applies width constraints to prevent unusable column sizes
 * - Temporarily disables other interactions during resize
 * 
 * @returns {void} Modifies DOM to add resize functionality
 * 
 * @example
 * // Called after table re-render to restore resize capability
 * renderTable();
 * setupColumnResizing(); // Re-establish resize handles
 */
const setupColumnResizing = () => {
  const table = document.getElementById('inventoryTable');
  if (!table) return;

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
    resizeHandle.style.cssText = `
      position: absolute;
      right: 0;
      top: 0;
      width: 6px;
      height: 100%;
      background: transparent;
      cursor: col-resize;
      z-index: 10;
      transition: background-color 0.2s;
    `;

    header.style.position = 'relative';
    header.appendChild(resizeHandle);

    resizeHandle.addEventListener('mousedown', (e) => {
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
    });
  });

  // Handle mouse move for resizing
  document.addEventListener('mousemove', (e) => {
    if (!isResizing || !currentColumn) return;

    const width = startWidth + e.clientX - startX;
    const minWidth = 40; // Minimum column width
    const maxWidth = 300; // Maximum column width
    
    if (width >= minWidth && width <= maxWidth) {
      currentColumn.style.width = width + 'px';
    }
  });

  // Handle mouse up to stop resizing
  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      currentColumn = null;
    }
  });

  // Prevent text selection during resize
  document.addEventListener('selectstart', (e) => {
    if (isResizing) {
      e.preventDefault();
    }
  });
};

// EVENT LISTENERS
// =============================================================================

/**
 * Safely gets an element or creates a dummy element to prevent null errors
 * @param {string} id - Element ID
 * @returns {HTMLElement} The element or a dummy element
 */
const safeGetElement = (id) => {
  const element = document.getElementById(id);
  if (element) {
    return element;
  }
  
  console.warn(`Element with ID '${id}' not found, creating dummy element`);
  return {
    addEventListener: () => {},
    style: {},
    textContent: '',
    value: ''
  };
};

/**
 * Initializes all primary event listeners for the application interface
 * 
 * This comprehensive setup function establishes event handlers for:
 * 
 * TABLE INTERACTIONS:
 * - Column header clicks for sorting (skips # and Delete columns)
 * - Toggle direction on repeated clicks (asc/desc)
 * 
 * FORM SUBMISSIONS:
 * - Main inventory form with validation and premium calculation
 * - Edit form with historical spot price handling
 * - Input validation for quantity, weight, and price fields
 * 
 * SPOT PRICE MANAGEMENT:
 * - Save/reset buttons for all four metal types
 * - Enter key support for quick spot price updates
 * 
 * IMPORT/EXPORT OPERATIONS:
 * - File input change events for CSV, JSON, Excel imports
 * - Export button clicks for all supported formats
 * - File input reset after processing
 * 
 * UTILITY FUNCTIONS:
 * - Modal close handlers (cancel edit, ESC key support)
 * - "Boating Accident" data reset with confirmation
 * - Theme toggle and persistence
 * 
 * @returns {void} Attaches event listeners to DOM elements
 * 
 * @example
 * // Called once during application initialization
 * document.addEventListener('DOMContentLoaded', () => {
 *   // ... other initialization
 *   setupEventListeners();
 * });
 */
const setupEventListeners = () => {
  console.log('Setting up event listeners...');

  try {
    // DEBUG: Check critical elements first
    console.log('API Button element:', elements.apiBtn);
    console.log('Theme Toggle element:', elements.themeToggle);
    
    // FILE PROTOCOL: Ensure critical buttons work via multiple methods
    if (window.location.protocol === 'file:' && window.fileProtocolFixes) {
      console.log('File protocol detected, using enhanced button setup');
      setTimeout(() => window.fileProtocolFixes.setupCriticalButtons(), 100);
    }

    // Table header sorting - check if table exists first
    const inventoryTable = document.getElementById('inventoryTable');
    if (inventoryTable) {
      const headers = inventoryTable.querySelectorAll('th');
      headers.forEach((header, index) => {
        // Skip # column (0) and Delete column (last column)
        if (index === 0 || index >= headers.length - 1) {
          return;
        }

        header.style.cursor = 'pointer';

        header.addEventListener('click', () => {
          // Toggle sort direction if same column, otherwise set to new column with asc
          if (sortColumn === index) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
          } else {
            sortColumn = index;
            sortDirection = 'asc';
          }

          renderTable();
        });
      });
    } else {
      console.error('Inventory table not found!');
    }

    // Main form submission
    if (elements.inventoryForm) {
      elements.inventoryForm.addEventListener('submit', function(e) {
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
      });
    } else {
      console.error('Inventory form not found!');
    }

    // Edit form submission
    if (elements.editForm) {
      elements.editForm.addEventListener('submit', function(e) {
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
      });
    }

    // Cancel edit
    if (elements.cancelEditBtn) {
      elements.cancelEditBtn.addEventListener('click', function() {
        elements.editModal.style.display = 'none';
        editingIndex = null;
      });
    }

    // Spot Price Event Listeners - with null safety
    console.log('Setting up spot price event listeners...');
    Object.values(METALS).forEach(metalConfig => {
      const metalKey = metalConfig.key;
      
      console.log(`Setting up listeners for ${metalConfig.name} (key: ${metalKey})`);
      
      // Check if elements exist before adding listeners
      const saveBtn = elements.saveSpotBtn ? elements.saveSpotBtn[metalKey] : null;
      const resetBtn = elements.resetSpotBtn ? elements.resetSpotBtn[metalKey] : null;
      const inputEl = elements.userSpotPriceInput ? elements.userSpotPriceInput[metalKey] : null;
      
      if (saveBtn) {
        saveBtn.addEventListener('click', () => updateManualSpot(metalKey));
        console.log(`✓ Save button listener added for ${metalConfig.name}`);
      } else {
        console.warn(`✗ Save button not found for ${metalConfig.name}`);
      }
      
      if (resetBtn) {
        resetBtn.addEventListener('click', () => resetSpot(metalKey));
        console.log(`✓ Reset button listener added for ${metalConfig.name}`);
      } else {
        console.warn(`✗ Reset button not found for ${metalConfig.name}`);
      }
      
      if (inputEl) {
        inputEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') updateManualSpot(metalKey);
        });
        console.log(`✓ Input listener added for ${metalConfig.name}`);
      } else {
        console.warn(`✗ Input element not found for ${metalConfig.name}`);
      }
    });

    // Import/Export Event Listeners - with null safety
    console.log('Setting up import/export listeners...');
    
    if (elements.importCsvFile) {
      elements.importCsvFile.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
          importCsv(e.target.files[0]);
        }
        this.value = '';
      });
    }

    if (elements.importJsonFile) {
      elements.importJsonFile.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
          importJson(e.target.files[0]);
        }
        this.value = '';
      });
    }

    if (elements.importExcelFile) {
      elements.importExcelFile.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
          importExcel(e.target.files[0]);
        }
        this.value = '';
      });
    }

    // Export buttons
    if (elements.exportCsvBtn) elements.exportCsvBtn.addEventListener('click', exportCsv);
    if (elements.exportJsonBtn) elements.exportJsonBtn.addEventListener('click', exportJson);
    if (elements.exportExcelBtn) elements.exportExcelBtn.addEventListener('click', exportExcel);
    if (elements.exportPdfBtn) elements.exportPdfBtn.addEventListener('click', exportPdf);
    if (elements.exportHtmlBtn) elements.exportHtmlBtn.addEventListener('click', exportHtml);

    // Backup All Button
    if (elements.backupAllBtn) {
      elements.backupAllBtn.addEventListener('click', downloadCompleteBackup);
    }

    // Boating Accident Button
    if (elements.boatingAccidentBtn) {
      elements.boatingAccidentBtn.addEventListener('click', function() {
        if (confirm("WARNING: This will erase ALL your data for this app (inventory, spot history, spot prices, API configuration).\n\nAre you sure you want to proceed?\n\nThis action cannot be undone!")) {
          localStorage.removeItem(LS_KEY);
          localStorage.removeItem(SPOT_HISTORY_KEY);
          localStorage.removeItem(API_KEY_STORAGE_KEY);
          localStorage.removeItem(API_CACHE_KEY);
          Object.values(METALS).forEach(metalConfig => {
            localStorage.removeItem(metalConfig.spotKey);
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
      });
    }
    
    // Setup API-specific event listeners
    setupApiEvents();

    console.log('Event listeners setup complete');
    
  } catch (error) {
    console.error('Error setting up event listeners:', error);
    console.error('Stack trace:', error.stack);
  }
};

/**
 * Sets up pagination event listeners
 */
const setupPagination = () => {
  console.log('Setting up pagination listeners...');
  
  try {
    if (elements.itemsPerPage) {
      elements.itemsPerPage.addEventListener('change', function() {
        itemsPerPage = parseInt(this.value);
        currentPage = 1;
        renderTable();
      });
    }

    if (elements.prevPage) {
      elements.prevPage.addEventListener('click', function() {
        if (currentPage > 1) {
          currentPage--;
          renderTable();
        }
      });
    }

    if (elements.nextPage) {
      elements.nextPage.addEventListener('click', function() {
        const totalPages = calculateTotalPages(filterInventory());
        if (currentPage < totalPages) {
          currentPage++;
          renderTable();
        }
      });
    }

    if (elements.firstPage) {
      elements.firstPage.addEventListener('click', function() {
        currentPage = 1;
        renderTable();
      });
    }

    if (elements.lastPage) {
      elements.lastPage.addEventListener('click', function() {
        currentPage = calculateTotalPages(filterInventory());
        renderTable();
      });
    }
    
    console.log('Pagination listeners setup complete');
  } catch (error) {
    console.error('Error setting up pagination listeners:', error);
  }
};

/**
 * Sets up search event listeners
 */
const setupSearch = () => {
  console.log('Setting up search listeners...');
  
  try {
    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', function() {
        searchQuery = this.value;
        currentPage = 1; // Reset to first page when search changes
        renderTable();
      });
    }

    if (elements.clearSearchBtn) {
      elements.clearSearchBtn.addEventListener('click', function() {
        elements.searchInput.value = '';
        searchQuery = '';
        currentPage = 1;
        renderTable();
      });
    }
    
    console.log('Search listeners setup complete');
  } catch (error) {
    console.error('Error setting up search listeners:', error);
  }
};

/**
 * Sets up theme toggle event listeners - FILE PROTOCOL COMPATIBLE VERSION
 */
const setupThemeToggle = () => {
  console.log('Setting up theme toggle with file:// protocol compatibility...');
  
  try {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';

    if (savedTheme === 'dark') {
      setTheme('dark');
    } else {
      setTheme('light');
    }

    // Use file protocol compatible attachment
    const themeButton = elements.themeToggle || document.getElementById('themeToggle');
    
    if (themeButton && window.fileProtocolFixes) {
      const themeHandler = function() {
        console.log('Theme toggle clicked (file:// compatible)');
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
      };
      
      // Use safe event attachment
      window.fileProtocolFixes.attachEventListenerSafely(themeButton, 'click', themeHandler, 'Theme Toggle');
    } else if (themeButton) {
      // Fallback to standard method if file protocol fixes not available
      console.log('Using standard theme toggle attachment');
      themeButton.addEventListener('click', function() {
        console.log('Theme toggle clicked');
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
      });
    } else {
      console.error('Theme toggle button not found!');
    }
    
    console.log('Theme toggle setup complete');
  } catch (error) {
    console.error('Error setting up theme toggle:', error);
  }
};

/**
 * Sets up API-related event listeners - FILE PROTOCOL COMPATIBLE VERSION
 */
const setupApiEvents = () => {
  console.log('Setting up API events with file:// protocol compatibility...');
  
  try {
    // Use file protocol compatible attachment for API button
    const apiButton = elements.apiBtn || document.getElementById('apiBtn');
    
    if (apiButton && window.fileProtocolFixes) {
      const apiHandler = function() {
        console.log('API button clicked (file:// compatible)');
        if (typeof showApiModal === 'function') {
          showApiModal();
        } else {
          alert('API configuration interface would open here');
        }
      };
      
      // Use safe event attachment
      window.fileProtocolFixes.attachEventListenerSafely(apiButton, 'click', apiHandler, 'API Button');
    } else if (apiButton) {
      // Fallback to standard method
      console.log('Using standard API button attachment');
      apiButton.addEventListener('click', function() {
        console.log('API button clicked');
        if (typeof showApiModal === 'function') {
          showApiModal();
        } else {
          alert('API configuration interface would open here');
        }
      });
    } else {
      console.error('API button not found!');
    }

    // API Modal Events
    const apiModal = document.getElementById('apiModal');
    const apiCancelBtn = document.getElementById('apiCancelBtn');
    const apiClearBtn = document.getElementById('apiClearBtn');
    const apiConfigForm = document.getElementById('apiConfigForm');
    const apiProviderSelect = document.getElementById('apiProvider');

    // Modal background click to close
    if (apiModal) {
      apiModal.addEventListener('click', (e) => {
        if (e.target === apiModal) {
          hideApiModal();
        }
      });
    }

    // Cancel button
    if (apiCancelBtn) {
      apiCancelBtn.addEventListener('click', hideApiModal);
    }

    // Clear configuration button
    if (apiClearBtn) {
      apiClearBtn.addEventListener('click', () => {
        if (confirm('This will remove your API configuration and cached data. Continue?')) {
          clearApiConfig();
          hideApiModal();
          alert('API configuration cleared.');
        }
      });
    }

    // Form submission
    if (apiConfigForm) {
      apiConfigForm.addEventListener('submit', handleApiConfigSubmit);
    }

    // Provider selection change
    if (apiProviderSelect) {
      apiProviderSelect.addEventListener('change', (e) => {
        updateProviderInfo(e.target.value);
      });
    }

    // Spot Price Action Button Events for each metal
    Object.values(METALS).forEach(metalConfig => {
      const metalName = metalConfig.name;
      
      // Sync button
      const syncBtn = document.getElementById(`syncBtn${metalName}`);
      if (syncBtn) {
        syncBtn.addEventListener('click', () => {
          syncSpotPricesFromApi(true);
        });
      }
      
      // Add button (manual input)
      const addBtn = document.getElementById(`addBtn${metalName}`);
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          showManualInput(metalName);
        });
      }
      
      // Reset button
      const resetBtn = document.getElementById(`resetBtn${metalName}`);
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          resetSpotPrice(metalName);
        });
      }
      
      // Cancel manual input button
      const cancelBtn = document.getElementById(`cancelSpotBtn${metalName}`);
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          hideManualInput(metalName);
        });
      }
    });

    // ESC key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const apiModal = document.getElementById('apiModal');
        if (apiModal && apiModal.style.display === 'flex') {
          hideApiModal();
        }
      }
    });

    console.log('API events setup complete');
  } catch (error) {
    console.error('Error setting up API events:', error);
  }
};

// =============================================================================
