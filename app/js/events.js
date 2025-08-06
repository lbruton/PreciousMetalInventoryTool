/**
 * Sets up column resizing functionality for the inventory table
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
 * Sets up all primary event listeners for the application
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

  // Boating Accident Button
  elements.boatingAccidentBtn.addEventListener('click', function() {
    if (confirm("WARNING: This will erase ALL your data for this app (inventory, spot history, spot prices).\n\nAre you sure you want to proceed?\n\nThis action cannot be undone!")) {
      localStorage.removeItem(LS_KEY);
      localStorage.removeItem(SPOT_HISTORY_KEY);
      Object.values(METALS).forEach(metalConfig => {
        localStorage.removeItem(metalConfig.spotKey);
      });
      sessionStorage.clear();

      loadInventory();
      renderTable();
      loadSpotHistory();
      fetchSpotPrice();
      alert("All data has been erased.");
    }
  });
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

// =============================================================================