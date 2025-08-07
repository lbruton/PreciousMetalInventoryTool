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
  // Table header sorting
  const headers = document.querySelectorAll('#inventoryTable th');
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

  // Edit form submission
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

  // Cancel edit
  elements.cancelEditBtn.addEventListener('click', function() {
    elements.editModal.style.display = 'none';
    editingIndex = null;
  });

  // Spot Price Event Listeners
  Object.values(METALS).forEach(metalConfig => {
    const metalKey = metalConfig.key;

    elements.saveSpotBtn[metalKey].addEventListener('click', () => updateManualSpot(metalKey));
    elements.resetSpotBtn[metalKey].addEventListener('click', () => resetSpot(metalKey));
    elements.userSpotPriceInput[metalKey].addEventListener('keydown', (e) => {
      if (e.key === 'Enter') updateManualSpot(metalKey);
    });
  });



  // Import/Export Event Listeners
  elements.importCsvFile.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
      importCsv(e.target.files[0]);
    }
    this.value = '';
  });

  elements.importJsonFile.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
      importJson(e.target.files[0]);
    }
    this.value = '';
  });

  elements.importExcelFile.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
      importExcel(e.target.files[0]);
    }
    this.value = '';
  });

  elements.exportCsvBtn.addEventListener('click', exportCsv);
  elements.exportJsonBtn.addEventListener('click', exportJson);
  elements.exportExcelBtn.addEventListener('click', exportExcel);
  elements.exportPdfBtn.addEventListener('click', exportPdf);
  elements.exportHtmlBtn.addEventListener('click', exportHtml);

  // Backup All Button
  elements.backupAllBtn.addEventListener('click', downloadCompleteBackup);

  // Boating Accident Button
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
  
  // Setup API-specific event listeners
  setupApiEvents();
};

/**
 * Sets up pagination event listeners
 */
const setupPagination = () => {
  elements.itemsPerPage.addEventListener('change', function() {
    itemsPerPage = parseInt(this.value);
    currentPage = 1;
    renderTable();
  });

  elements.prevPage.addEventListener('click', function() {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  elements.nextPage.addEventListener('click', function() {
    const totalPages = calculateTotalPages(filterInventory());
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  });

  elements.firstPage.addEventListener('click', function() {
    currentPage = 1;
    renderTable();
  });

  elements.lastPage.addEventListener('click', function() {
    currentPage = calculateTotalPages(filterInventory());
    renderTable();
  });
};

/**
 * Sets up search event listeners
 */
const setupSearch = () => {
  elements.searchInput.addEventListener('input', function() {
    searchQuery = this.value;
    currentPage = 1; // Reset to first page when search changes
    renderTable();
  });

  elements.clearSearchBtn.addEventListener('click', function() {
    elements.searchInput.value = '';
    searchQuery = '';
    currentPage = 1;
    renderTable();
  });
};

/**
 * Sets up theme toggle event listeners
 */
const setupThemeToggle = () => {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';

  if (savedTheme === 'dark') {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  elements.themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
};

/**
 * Sets up API-related event listeners
 */
const setupApiEvents = () => {
  // API Configuration Button
  if (elements.apiBtn) {
    elements.apiBtn.addEventListener('click', showApiModal);
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
    const metalKey = metalConfig.key;
    
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
};

// =============================================================================