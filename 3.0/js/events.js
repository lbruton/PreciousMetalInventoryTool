// EVENT LISTENERS
// =============================================================================

/**
 * Sets up all primary event listeners for the application
 */
const setupEventListeners = () => {
  // Table header sorting
  const headers = document.querySelectorAll('#inventoryTable th');
  headers.forEach((header, index) => {
    // Skip # column (0) and Edit/Delete columns (13-14)
    if (index === 0 || index >= headers.length - 2) {
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

  // Spot History Functions
  elements.showSpotHistoryBtn.addEventListener('click', function() {
    if (spotHistory.length === 0) {
      alert("No spot history available.");
      return;
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';

    const content = document.createElement('div');
    content.className = 'modal-content';

    const title = document.createElement('h2');
    title.textContent = 'Spot Price History';
    title.style.marginBottom = '1rem';
    title.style.color = 'var(--primary)';

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid var(--border); color: var(--primary);">Timestamp</th>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid var(--border); color: var(--primary);">Spot Price</th>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid var(--border); color: var(--primary);">Metal</th>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid var(--border); color: var(--primary);">Source</th>
      </tr>
    `;

    const tbody = document.createElement('tbody');

    // Get LAST 10 entries THEN reverse (newest first)
    const last10Entries = spotHistory.slice(-10).reverse();

    // Update title to reflect limited entries
    title.textContent = `Last 10 Spot Prices - ${spotHistory.length} total entries`;

    last10Entries.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="padding: 8px; border-bottom: 1px solid var(--border); color: var(--text-primary);">${entry.timestamp}</td>
        <td style="padding: 8px; border-bottom: 1px solid var(--border); color: var(--text-primary);">${formatDollar(entry.spot)}</td>
        <td style="padding: 8px; border-bottom: 1px solid var(--border); color: var(--text-primary);">${entry.metal}</td>
        <td style="padding: 8px; border-bottom: 1px solid var(--border); color: var(--text-primary);">${entry.source}</td>
      `;
      tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.className = 'btn';
    closeButton.style.marginTop = '1rem';
    closeButton.addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    content.appendChild(title);
    content.appendChild(table);
    content.appendChild(closeButton);
    modal.appendChild(content);
    document.body.appendChild(modal);
  });

  elements.clearSpotHistoryBtn.addEventListener('click', function() {
    if (confirm("Are you sure you want to clear all spot history?")) {
      spotHistory = [];
      saveSpotHistory();
      alert("Spot history cleared.");
    }
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