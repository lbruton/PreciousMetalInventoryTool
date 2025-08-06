/**
 * Precious Metals Inventory Tool 2.0
 * 
 * A comprehensive client-side application for tracking precious metal investments
 * with detailed financial metrics, spot price history, and multi-format data handling.
 * 
 * Features:
 * - Silver and gold inventory tracking
 * - Spot price management with history
 * - Premium and profit/loss calculations
 * - Collectible item handling
 * - Data import/export in multiple formats (CSV, JSON, Excel, PDF, HTML)
 * - Responsive UI with dark/light mode
 * - Search, sorting, and pagination
 * 
 * Data is stored entirely client-side using localStorage
 */

// =============================================================================
// CONFIGURATION & GLOBAL CONSTANTS
// =============================================================================

/** @constant {string} LS_KEY - LocalStorage key for inventory data */
const LS_KEY = 'metalInventory';

/** @constant {string} SPOT_HISTORY_KEY - LocalStorage key for spot price history */
const SPOT_HISTORY_KEY = 'metalSpotHistory';

/** @constant {string} USER_SPOT_SILVER_KEY - LocalStorage key for user-set silver spot price */
const USER_SPOT_SILVER_KEY = 'userSpotPriceSilver';

/** @constant {string} USER_SPOT_GOLD_KEY - LocalStorage key for user-set gold spot price */
const USER_SPOT_GOLD_KEY = 'userSpotPriceGold';

/** @constant {string} THEME_KEY - LocalStorage key for theme preference */
const THEME_KEY = 'appTheme';

// =============================================================================
// APPLICATION STATE
// =============================================================================

/** @type {Object} Sorting state tracking */
let sortColumn = null;        // Currently sorted column index (null = unsorted)
let sortDirection = 'asc';    // 'asc' or 'desc' - current sort direction

/** @type {number|null} Index of item being edited (null = no edit in progress) */
let editingIndex = null;

/** @type {Object} Pagination state */
let currentPage = 1;          // Current page number (1-based)
let itemsPerPage = 25;        // Number of items to display per page

/** @type {string} Current search query */
let searchQuery = '';

/** @type {Object} Cached DOM elements for performance */
const elements = {
  // Spot price elements
  spotPriceDisplaySilver: null,
  spotPriceDisplayGold: null,
  userSpotPriceSilver: null,
  userSpotPriceGold: null,

  // Form elements
  inventoryForm: null,
  inventoryTable: null,
  itemMetal: null,
  itemName: null,
  itemQty: null,
  itemType: null,
  itemWeight: null,
  itemPrice: null,
  purchaseLocation: null,
  itemDate: null,

  // Spot price buttons
  saveSpotBtnSilver: null,
  resetSpotBtnSilver: null,
  saveSpotBtnGold: null,
  resetSpotBtnGold: null,

  // Spot history elements
  showSpotHistoryBtn: null,
  clearSpotHistoryBtn: null,

  // Import elements
  importCsvFile: null,
  importJsonFile: null,
  importExcelFile: null,

  // Export elements
  exportCsvBtn: null,
  exportJsonBtn: null,
  exportExcelBtn: null,
  exportPdfBtn: null,
  exportHtmlBtn: null,

  // Emergency reset button
  boatingAccidentBtn: null,

  // Edit modal elements
  editModal: null,
  editForm: null,
  cancelEditBtn: null,
  editMetal: null,
  editName: null,
  editQty: null,
  editType: null,
  editWeight: null,
  editPrice: null,
  editPurchaseLocation: null,
  editDate: null,
  editSpotPrice: null,

  // Pagination elements
  itemsPerPage: null,
  prevPage: null,
  nextPage: null,
  firstPage: null,
  lastPage: null,
  pageNumbers: null,
  paginationInfo: null,

  // Search elements
  searchInput: null,
  clearSearchBtn: null,
  searchResultsInfo: null,

  // Theme toggle
  themeToggle: null,

  // Totals display elements (organized by metal type)
  totals: {
    silver: {
      items: null,       // Total item count
      weight: null,      // Total weight in ounces
      value: null,       // Current market value
      purchased: null,   // Total purchase price
      premium: null,     // Total premium paid
      lossProfit: null,  // Total profit/loss
      avgPrice: null,    // Average price per ounce
      avgPremium: null   // Average premium per ounce
    },
    gold: {
      // Same structure as silver
      items: null,
      weight: null,
      value: null,
      purchased: null,
      premium: null,
      lossProfit: null,
      avgPrice: null,
      avgPremium: null
    },
    all: {
      // Combined totals for all metals
      items: null,
      weight: null,
      value: null,
      purchased: null,
      premium: null,
      lossProfit: null,
      avgPrice: null,
      avgPremium: null
    }
  }
};

/** @type {Array} Main inventory data structure */
let inventory = [];

/** @type {number} Current silver spot price */
let spotSilver = 0;

/** @type {number} Current gold spot price */
let spotGold = 0;

/** @type {Array} Historical spot price records */
let spotHistory = [];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Pads a number with leading zeros to ensure two-digit format
 * 
 * @param {number} n - Number to pad
 * @returns {string} Two-digit string representation
 * @example pad2(5) returns "05", pad2(12) returns "12"
 */
const pad2 = n => n.toString().padStart(2, '0');

/**
 * Returns current date as ISO string (YYYY-MM-DD)
 * 
 * @returns {string} Current date in ISO format
 */
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
};

/**
 * Parses various date formats into standard YYYY-MM-DD format
 * 
 * Handles:
 * - ISO format (YYYY-MM-DD)
 * - US format (MM/DD/YYYY)
 * - European format (DD/MM/YYYY)
 * - Year-first format (YYYY/MM/DD)
 * 
 * @param {string} dateStr - Date string in any supported format
 * @returns {string} Date in YYYY-MM-DD format, or today's date if parsing fails
 */
function parseDate(dateStr) {
  if (!dateStr) return todayStr();

  // Try ISO format (YYYY-MM-DD) first
  let date = new Date(dateStr);
  if (!isNaN(date) && date.toString() !== 'Invalid Date') {
    return date.toISOString().split('T')[0];
  }

  // Try common US format MM/DD/YYYY
  const usMatch = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (usMatch) {
    const month = parseInt(usMatch[1], 10) - 1;
    const day = parseInt(usMatch[2], 10);
    const year = parseInt(usMatch[3], 10);

    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      date = new Date(year, month, day);
      if (!isNaN(date) && date.toString() !== 'Invalid Date') {
        return date.toISOString().split('T')[0];
      }
    }
  }

  // Try common European format DD/MM/YYYY
  const euMatch = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (euMatch) {
    const day = parseInt(euMatch[1], 10);
    const month = parseInt(euMatch[2], 10) - 1;
    const year = parseInt(euMatch[3], 10);

    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      date = new Date(year, month, day);
      if (!isNaN(date) && date.toString() !== 'Invalid Date') {
        return date.toISOString().split('T')[0];
      }
    }
  }

  // Try YYYY/MM/DD format
  const ymdMatch = dateStr.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);

    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      date = new Date(year, month, day);
      if (!isNaN(date) && date.toString() !== 'Invalid Date') {
        return date.toISOString().split('T')[0];
      }
    }
  }

  // If all parsing fails, return today's date
  return todayStr();
}

/**
 * Formats a number as a dollar amount with two decimal places
 * 
 * @param {number|string} n - Number to format
 * @returns {string} Formatted dollar string (e.g., "$1,234.56")
 */
const formatDollar = n => `$${parseFloat(n).toFixed(2)}`;

/**
 * Formats a profit/loss value with color coding
 * 
 * @param {number} value - Profit/loss value
 * @returns {string} HTML string with appropriate color styling
 */
const formatLossProfit = (value) => {
  const formatted = formatDollar(value);
  if (value > 0) {
    return `<span style="color: var(--profit);">${formatted}</span>`;
  } else if (value < 0) {
    return `<span style="color: var(--loss);">${formatted}</span>`;
  }
  return formatted;
};

/**
 * Saves data to localStorage with JSON serialization
 * 
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 */
const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

/**
 * Loads data from localStorage with error handling
 * 
 * @param {string} key - Storage key
 * @param {any} [defaultValue=[]] - Default value if no data found
 * @returns {any} Parsed data or default value
 */
const loadData = (key, defaultValue = []) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

// =============================================================================
// THEME MANAGEMENT
// =============================================================================

/**
 * Sets application theme and updates localStorage
 * 
 * @param {string} theme - 'dark' or 'light'
 */
const setTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem(THEME_KEY, 'dark');
    elements.themeToggle.textContent = 'Light Mode';
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem(THEME_KEY, 'light');
    elements.themeToggle.textContent = 'Dark Mode';
  }
};

// =============================================================================
// SEARCH FUNCTIONALITY
// =============================================================================

/**
 * Filters inventory based on current search query
 * 
 * @returns {Array} Filtered inventory items matching the search query
 */
const filterInventory = () => {
  if (!searchQuery.trim()) return inventory;

  const query = searchQuery.toLowerCase();
  return inventory.filter(item => {
    return (
      item.metal.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      item.purchaseLocation.toLowerCase().includes(query) ||
      item.date.includes(query) ||
      item.qty.toString().includes(query) ||
      item.weight.toString().includes(query) ||
      item.price.toString().includes(query) ||
      (item.isCollectable ? 'yes' : 'no').includes(query)
    );
  });
};

// =============================================================================
// SORTING FUNCTIONALITY
// =============================================================================

/**
 * Sorts inventory based on current sort column and direction
 * 
 * @param {Array} [data=inventory] - Data to sort (defaults to main inventory)
 * @returns {Array} Sorted inventory data
 */
const sortInventory = (data = inventory) => {
  if (sortColumn === null) return data;

  return [...data].sort((a, b) => {
    let valA, valB;

    // Map column index to data property
    switch(sortColumn) {
      case 1: valA = a.metal; valB = b.metal; break; // Metal
      case 2: valA = a.qty; valB = b.qty; break; // Qty
      case 3: valA = a.type; valB = b.type; break; // Type
      case 4: valA = a.name; valB = b.name; break; // Name
      case 5: valA = a.weight; valB = b.weight; break; // Weight
      case 6: valA = a.price; valB = b.price; break; // Purchase Price
      case 7: valA = a.spotPriceAtPurchase; valB = b.spotPriceAtPurchase; break; // Spot Price
      case 8: valA = a.premiumPerOz; valB = b.premiumPerOz; break; // Premium per oz
      case 9: valA = a.totalPremium; valB = b.totalPremium; break; // Total Premium
      case 10: valA = a.purchaseLocation; valB = b.purchaseLocation; break; // Location
      case 11: valA = a.date; valB = b.date; break; // Date
      case 12: valA = a.isCollectable; valB = b.isCollectable; break; // Collectable
      default: return 0;
    }

    // Numeric comparison for numbers
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    } 
    // Boolean comparison for collectable
    else if (typeof valA === 'boolean' && typeof valB === 'boolean') {
      return sortDirection === 'asc' ? (valA - valB) : (valB - valA);
    }
    // String comparison for everything else
    else {
      return sortDirection === 'asc' 
        ? String(valA).localeCompare(String(valB)) 
        : String(valB).localeCompare(String(valA));
    }
  });
};

// =============================================================================
// PAGINATION FUNCTIONS
// =============================================================================

/**
 * Calculates total number of pages based on current data
 * 
 * @param {Array} [data=inventory] - Data to paginate
 * @returns {number} Total number of pages
 */
const calculateTotalPages = (data = inventory) => {
  return Math.max(1, Math.ceil(data.length / itemsPerPage));
};

/**
 * Renders pagination controls based on current state
 * 
 * @param {Array} [filteredData=filterInventory()] - Filtered data to paginate
 */
const renderPagination = (filteredData = filterInventory()) => {
  const totalPages = calculateTotalPages(filteredData);
  const pageNumbersContainer = elements.pageNumbers;
  pageNumbersContainer.innerHTML = '';

  // Show limited page numbers (max 7) centered around current page
  const maxVisiblePages = 7;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust startPage if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Add page number buttons
  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = currentPage === i ? 'active' : '';
    btn.onclick = () => goToPage(i);
    pageNumbersContainer.appendChild(btn);
  }

  // Update pagination info
  elements.paginationInfo.textContent = `${currentPage} of ${totalPages}`;

  // Update button states
  elements.firstPage.disabled = currentPage === 1;
  elements.prevPage.disabled = currentPage === 1;
  elements.nextPage.disabled = currentPage === totalPages;
  elements.lastPage.disabled = currentPage === totalPages;

  // Update search results info
  if (searchQuery.trim()) {
    elements.searchResultsInfo.textContent = `Found ${filteredData.length} results matching "${searchQuery}"`;
  } else {
    elements.searchResultsInfo.textContent = '';
  }
};

/**
 * Navigates to specified page number
 * 
 * @param {number} page - Page number to navigate to
 */
const goToPage = (page) => {
  const filteredData = filterInventory();
  const totalPages = calculateTotalPages(filteredData);
  currentPage = Math.max(1, Math.min(page, totalPages));
  renderTable();
};

// =============================================================================
// SPOT PRICE FUNCTIONS
// =============================================================================

/**
 * Saves spot history to localStorage
 */
const saveSpotHistory = () => saveData(SPOT_HISTORY_KEY, spotHistory);

/**
 * Loads spot history from localStorage
 */
const loadSpotHistory = () => spotHistory = loadData(SPOT_HISTORY_KEY, []);

/**
 * Records a new spot price entry in history
 * 
 * @param {number} newSpot - New spot price value
 * @param {string} source - Source of spot price ('manual' or other)
 * @param {string} metal - Metal type ('Silver' or 'Gold')
 */
const recordSpot = (newSpot, source, metal) => {
  if (!spotHistory.length || spotHistory[spotHistory.length-1].spot !== newSpot || spotHistory[spotHistory.length-1].metal !== metal) {
    spotHistory.push({
      spot: newSpot,
      metal,
      source,
      timestamp: new Date().toISOString().replace('T',' ').slice(0,19)
    });
    saveSpotHistory();
  }
};

/**
 * Fetches and displays current spot prices from localStorage
 */
const fetchSpotPrice = () => {
  const userSilv = localStorage.getItem(USER_SPOT_SILVER_KEY);
  if (userSilv) {
    spotSilver = parseFloat(userSilv);
    elements.spotPriceDisplaySilver.textContent = formatDollar(spotSilver);
    recordSpot(spotSilver, 'manual', 'Silver');
  } else {
    elements.spotPriceDisplaySilver.textContent = 'N/A';
  }

  const userGold = localStorage.getItem(USER_SPOT_GOLD_KEY);
  if (userGold) {
    spotGold = parseFloat(userGold);
    elements.spotPriceDisplayGold.textContent = formatDollar(spotGold);
    recordSpot(spotGold, 'manual', 'Gold');
  } else {
    elements.spotPriceDisplayGold.textContent = 'N/A';
  }

  updateSummary();
};

/**
 * Updates spot price for specified metal from user input
 * 
 * @param {string} metal - Metal to update ('Silver' or 'Gold')
 */
const updateManualSpot = (metal) => {
  const input = metal === 'Silver' ? elements.userSpotPriceSilver : elements.userSpotPriceGold;
  const value = input.value;

  if (!value) return;

  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return alert(`Invalid ${metal.toLowerCase()} spot price.`);

  localStorage.setItem(metal === 'Silver' ? USER_SPOT_SILVER_KEY : USER_SPOT_GOLD_KEY, num);
  if (metal === 'Silver') spotSilver = num;
  else spotGold = num;

  elements.spotPriceDisplaySilver.textContent = formatDollar(spotSilver);
  elements.spotPriceDisplayGold.textContent = formatDollar(spotGold);

  updateSummary();
};

/**
 * Resets spot price for specified metal to default (removes from localStorage)
 * 
 * @param {string} metal - Metal to reset ('Silver' or 'Gold')
 */
const resetSpot = (metal) => {
  localStorage.removeItem(metal === 'Silver' ? USER_SPOT_SILVER_KEY : USER_SPOT_GOLD_KEY);
  fetchSpotPrice();
};

// =============================================================================
// INVENTORY FUNCTIONS
// =============================================================================

/**
 * Saves current inventory to localStorage
 */
const saveInventory = () => saveData(LS_KEY, inventory);

/**
 * Loads inventory from localStorage with data migration
 * 
 * Handles legacy data by adding missing fields and calculating defaults
 */
const loadInventory = () => {
  const data = loadData(LS_KEY, []);
  // Migrate legacy data to include new fields
  inventory = data.map(item => {
    if (item.premiumPerOz === undefined) {
      // For legacy items, calculate premium if possible
      const spotPrice = item.metal === 'Silver' ? spotSilver : spotGold;
      const premiumPerOz = spotPrice > 0 ? (item.price / item.weight) - spotPrice : 0;
      const totalPremium = premiumPerOz * item.qty * item.weight;

      return {
        ...item,
        purchaseLocation: item.purchaseLocation || "Unknown",
        spotPriceAtPurchase: spotPrice,
        premiumPerOz,
        totalPremium,
        isCollectable: item.isCollectable !== undefined ? item.isCollectable : false
      };
    }
    // Ensure all items have isCollectable property
    return {
      ...item,
      isCollectable: item.isCollectable !== undefined ? item.isCollectable : false
    };
  });
};

/**
 * Renders inventory table with current sorting, pagination, and filtering
 */
const renderTable = () => {
  const filteredInventory = filterInventory();
  const sortedInventory = sortInventory(filteredInventory);
  const totalPages = calculateTotalPages(sortedInventory);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedInventory.length);

  const rows = [];

  for (let i = startIndex; i < endIndex; i++) {
    const item = sortedInventory[i];
    const originalIdx = inventory.indexOf(item);

    rows.push(`
      <tr>
        <td>${i + 1}</td>
        <td>${item.metal || 'Silver'}</td>
        <td>${item.qty}</td>
        <td>${item.type}</td>
        <td>${item.name.replace(/[<>"']/g, '')}</td>
        <td>${parseFloat(item.weight).toFixed(2)}</td>
        <td>${formatDollar(item.price)}</td>
        <td>${item.isCollectable ? 'N/A' : (item.spotPriceAtPurchase > 0 ? formatDollar(item.spotPriceAtPurchase) : 'N/A')}</td>
        <td style="color: ${item.isCollectable ? 'var(--collectable)' : (item.premiumPerOz > 0 ? 'var(--premium)' : 'inherit')}">${item.isCollectable ? 'N/A' : formatDollar(item.premiumPerOz)}</td>
        <td style="color: ${item.isCollectable ? 'var(--collectable)' : (item.totalPremium > 0 ? 'var(--premium)' : 'inherit')}">${item.isCollectable ? 'N/A' : formatDollar(item.totalPremium)}</td>
        <td>${item.purchaseLocation}</td>
        <td>${item.date}</td>
        <td>
          <label class="switch">
            <input type="checkbox" ${item.isCollectable ? 'checked' : ''} onchange="toggleCollectable(${originalIdx}, this)">
            <span class="slider"></span>
          </label>
        </td>
        <td><button class="btn premium" onclick="editItem(${originalIdx})" aria-label="Edit item">Edit</button></td>
        <td><button class="btn danger" onclick="deleteItem(${originalIdx})" aria-label="Delete item">&times;</button></td>
      </tr>
    `);
  }

  elements.inventoryTable.innerHTML = rows.join('');

  // Update sort indicators
  const headers = document.querySelectorAll('#inventoryTable th');
  headers.forEach(header => {
    const indicator = header.querySelector('.sort-indicator');
    if (indicator) header.removeChild(indicator);
  });

  if (sortColumn !== null && sortColumn < headers.length) {
    const header = headers[sortColumn];
    const indicator = document.createElement('span');
    indicator.className = 'sort-indicator';
    indicator.textContent = sortDirection === 'asc' ? '↑' : '↓';
    header.appendChild(indicator);
  }

  renderPagination(sortedInventory);
  updateSummary();
};

/**
 * Updates all summary/totals displays based on current inventory
 */
const updateSummary = () => {
  /**
   * Calculates financial metrics for specified metal type
   * 
   * @param {string} metal - Metal type to calculate ('Silver' or 'Gold')
   * @returns {Object} Calculated metrics
   */
  const calculateTotals = (metal) => {
    let totalItems = 0;
    let totalWeight = 0;
    let currentSpotValue = 0;
    let totalPurchased = 0;
    let totalPremium = 0;
    let lossProfit = 0;

    for (const item of inventory) {
      if (item.metal === metal) {
        totalItems += Number(item.qty);

        // Total Weight calculation (for both regular and collectible items)
        const itemWeight = Number(item.qty) * parseFloat(item.weight);
        totalWeight += itemWeight;

        // Current Value calculation
        if (item.isCollectable) {
          // For collectible items: Current Value = Current spot price × weight
          const currentSpot = metal === 'Silver' ? spotSilver : spotGold;
          currentSpotValue += currentSpot * itemWeight;
        } else {
          // For regular items: Current Value = Weight × Current Spot Price
          const currentSpot = metal === 'Silver' ? spotSilver : spotGold;
          currentSpotValue += currentSpot * itemWeight;
        }

        // Total Purchase Price calculation (for both regular and collectible items)
        totalPurchased += Number(item.qty) * parseFloat(item.price);

        // Premium Paid calculation
        if (!item.isCollectable) {
          // For regular items: Premium Paid = (Purchase Price per oz - Spot Price at Purchase) × Weight
          const pricePerOz = item.price / item.weight;
          const premiumPerOz = pricePerOz - item.spotPriceAtPurchase;
          totalPremium += premiumPerOz * itemWeight;
        }
        // For collectible items: Premium Paid = N/A

        // Loss/Profit calculation
        if (!item.isCollectable) {
          // For regular items: Loss/Profit = Current Value - Purchase Price
          const currentSpot = metal === 'Silver' ? spotSilver : spotGold;
          const currentValue = currentSpot * itemWeight;
          const purchaseValue = item.price * item.qty;
          lossProfit += currentValue - purchaseValue;
        }
        // For collectible items: Loss/Profit = Omitted from calculation
      }
    }

    // Calculate averages
    const avgPrice = totalWeight > 0 ? totalPurchased / totalWeight : 0;
    const avgPremium = totalWeight > 0 ? totalPremium / totalWeight : 0;

    return { 
      totalItems, 
      totalWeight, 
      currentSpotValue, 
      totalPurchased, 
      totalPremium,
      lossProfit,
      avgPrice,
      avgPremium
    };
  };

  const silver = calculateTotals('Silver');
  const gold = calculateTotals('Gold');

  // Update DOM elements with weight rounded to 2 decimal places
  elements.totals.silver.items.textContent = silver.totalItems;
  elements.totals.silver.weight.textContent = silver.totalWeight.toFixed(2);
  elements.totals.silver.value.innerHTML = formatDollar(silver.currentSpotValue);
  elements.totals.silver.purchased.innerHTML = formatDollar(silver.totalPurchased);
  elements.totals.silver.premium.innerHTML = formatDollar(silver.totalPremium);
  elements.totals.silver.lossProfit.innerHTML = formatLossProfit(silver.lossProfit);
  elements.totals.silver.avgPrice.innerHTML = formatDollar(silver.avgPrice);
  elements.totals.silver.avgPremium.innerHTML = formatDollar(silver.avgPremium);

  elements.totals.gold.items.textContent = gold.totalItems;
  elements.totals.gold.weight.textContent = gold.totalWeight.toFixed(2);
  elements.totals.gold.value.innerHTML = formatDollar(gold.currentSpotValue);
  elements.totals.gold.purchased.innerHTML = formatDollar(gold.totalPurchased);
  elements.totals.gold.premium.innerHTML = formatDollar(gold.totalPremium);
  elements.totals.gold.lossProfit.innerHTML = formatLossProfit(gold.lossProfit);
  elements.totals.gold.avgPrice.innerHTML = formatDollar(gold.avgPrice);
  elements.totals.gold.avgPremium.innerHTML = formatDollar(gold.avgPremium);

  elements.totals.all.items.textContent = silver.totalItems + gold.totalItems;
  elements.totals.all.weight.textContent = (silver.totalWeight + gold.totalWeight).toFixed(2);
  elements.totals.all.value.innerHTML = formatDollar(silver.currentSpotValue + gold.currentSpotValue);
  elements.totals.all.purchased.innerHTML = formatDollar(silver.totalPurchased + gold.totalPurchased);
  elements.totals.all.premium.innerHTML = formatDollar(silver.totalPremium + gold.totalPremium);
  elements.totals.all.lossProfit.innerHTML = formatLossProfit(silver.lossProfit + gold.lossProfit);
  elements.totals.all.avgPrice.innerHTML = formatDollar((silver.totalPurchased + gold.totalPurchased) / (silver.totalWeight + gold.totalWeight) || 0);
  elements.totals.all.avgPremium.innerHTML = formatDollar((silver.totalPremium + gold.totalPremium) / (silver.totalWeight + gold.totalWeight) || 0);
};

/**
 * Deletes inventory item at specified index after confirmation
 * 
 * @param {number} idx - Index of item to delete
 */
const deleteItem = (idx) => {
  if (confirm("Delete this item?")) {
    inventory.splice(idx, 1);
    saveInventory();
    renderTable();
  }
};

/**
 * Prepares and displays edit modal for specified inventory item
 * 
 * @param {number} idx - Index of item to edit
 */
const editItem = (idx) => {
  editingIndex = idx;
  const item = inventory[idx];

  // Populate edit form
  elements.editMetal.value = item.metal;
  elements.editName.value = item.name;
  elements.editQty.value = item.qty;
  elements.editType.value = item.type;
  elements.editWeight.value = item.weight;
  elements.editPrice.value = item.price;
  elements.editPurchaseLocation.value = item.purchaseLocation;
  elements.editDate.value = item.date;
  elements.editSpotPrice.value = item.spotPriceAtPurchase;

  // Show modal
  elements.editModal.style.display = 'flex';
};

/**
 * Toggles collectable status for inventory item
 * 
 * @param {number} idx - Index of item to update
 * @param {HTMLInputElement} checkbox - Checkbox element triggering the change
 */
const toggleCollectable = (idx, checkbox) => {
  inventory[idx].isCollectable = checkbox.checked;
  saveInventory();
  renderTable();
};

// =============================================================================
// IMPORT/EXPORT FUNCTIONS
// =============================================================================

/**
 * Imports inventory data from CSV file
 * 
 * @param {File} file - CSV file to import
 */
const importCsv = (file) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      let imported = [];
      let skipped = 0;

      for (let row of results.data) {
        const metal = row['Metal'] || 'Silver';
        const name = row['Name'] || row['name'];
        const qty = parseInt(row['Qty'] || row['qty'] || 1, 10);
        const type = row['Type'] || row['type'] || 'Other';
        const weight = parseFloat(row['Weight(oz)'] || row['weight']);
        const priceStr = row['Purchase Price'] || row['price'];
        const price = parseFloat(typeof priceStr === "string" ? priceStr.replace(/[^0-9.-]+/g,"") : priceStr);
        const purchaseLocation = row['Purchase Location'] || "Unknown";
        const date = parseDate(row['Date']); // Using the new date parser

        // Get collectable status
        const isCollectable = row['Collectable'] === 'Yes' || row['Collectable'] === 'true' || row['isCollectable'] === 'true';

        // Get spot price from CSV if available
        let spotPriceAtPurchase;
        if (row['Spot Price ($/oz)']) {
          // Extract numeric value from formatted string like "$1,234.56"
          const spotStr = row['Spot Price ($/oz)'].toString();
          spotPriceAtPurchase = parseFloat(spotStr.replace(/[^0-9.-]+/g, ""));
        } else if (row['spotPriceAtPurchase']) {
          spotPriceAtPurchase = parseFloat(row['spotPriceAtPurchase']);
        } else {
          // Fall back to current spot price if not in CSV and not collectable
          spotPriceAtPurchase = isCollectable ? 0 : (metal === 'Silver' ? spotSilver : spotGold);
        }

        // Calculate premium per ounce (only for non-collectible items)
        let premiumPerOz = 0;
        let totalPremium = 0;

        if (!isCollectable) {
          const pricePerOz = price / weight;
          premiumPerOz = pricePerOz - spotPriceAtPurchase;
          totalPremium = premiumPerOz * qty * weight;
        }

        if (!name || isNaN(qty) || isNaN(weight) || isNaN(price) || qty < 1 || !Number.isInteger(qty)) {
          skipped++;
          continue;
        }

        imported.push({ 
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
      }

      if (imported.length === 0) return alert("No valid items to import.");

      let msg = "Replace current inventory with imported file?";
      if (skipped > 0) msg += `\n(Skipped ${skipped} invalid rows)`;

      if (confirm(msg)) {
        inventory = imported;
        saveInventory();
        renderTable();
      }

      this.value = "";
    }
  });
};

/**
 * Exports current inventory to CSV format
 */
const exportCsv = () => {
  const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,'');
  const headers = ["Metal","Name","Qty","Type","Weight(oz)","Purchase Price","Spot Price ($/oz)","Premium ($/oz)","Total Premium","Purchase Location","Date","Collectable"];
  const rows = [];

  for (const i of inventory) {
    // For collectable items, use current spot price (at time of export)
    // This ensures the value is preserved if the item is later changed back to standard
    const exportSpotPrice = i.isCollectable ? 
      (i.metal === 'Silver' ? spotSilver : spotGold) : 
      i.spotPriceAtPurchase;

    rows.push([
      i.metal || 'Silver',
      i.name,
      i.qty,
      i.type,
      parseFloat(i.weight).toFixed(4),
      formatDollar(i.price),
      exportSpotPrice > 0 ? formatDollar(exportSpotPrice) : 'N/A',
      i.isCollectable ? 'N/A' : formatDollar(i.premiumPerOz),
      i.isCollectable ? 'N/A' : formatDollar(i.totalPremium),
      i.purchaseLocation,
      i.date,
      i.isCollectable ? 'Yes' : 'No'
    ]);
  }

  const csv = Papa.unparse([headers, ...rows]);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `metal_inventory_${timestamp}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

/**
 * Imports inventory data from JSON file
 * 
 * @param {File} file - JSON file to import
 */
const importJson = (file) => {
  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);

      // Validate data structure
      if (!Array.isArray(data)) {
        return alert("Invalid JSON format. Expected an array of inventory items.");
      }

      // Process each item
      const imported = [];
      let skipped = 0;

      for (const item of data) {
        // Basic validation
        if (!item.name || !item.metal || isNaN(item.qty) || isNaN(item.weight) || isNaN(item.price)) {
          skipped++;
          continue;
        }

        // Ensure required fields with defaults
        const processedItem = {
          metal: item.metal || 'Silver',
          name: item.name,
          qty: parseInt(item.qty, 10),
          type: item.type || 'Other',
          weight: parseFloat(item.weight),
          price: parseFloat(item.price),
          date: parseDate(item.date || todayStr()),
          purchaseLocation: item.purchaseLocation || "Unknown",
          spotPriceAtPurchase: item.spotPriceAtPurchase || (item.metal === 'Silver' ? spotSilver : spotGold),
          isCollectable: item.isCollectable === true,
          premiumPerOz: item.premiumPerOz || 0,
          totalPremium: item.totalPremium || 0
        };

        // Recalculate premium if needed
        if (!processedItem.isCollectable && processedItem.spotPriceAtPurchase > 0) {
          const pricePerOz = processedItem.price / processedItem.weight;
          processedItem.premiumPerOz = pricePerOz - processedItem.spotPriceAtPurchase;
          processedItem.totalPremium = processedItem.premiumPerOz * processedItem.qty * processedItem.weight;
        }

        imported.push(processedItem);
      }

      if (imported.length === 0) {
        return alert("No valid items found in JSON file.");
      }

      let msg = `Import ${imported.length} items?`;
      if (skipped > 0) {
        msg += `\n(Skipped ${skipped} invalid items)`;
      }

      if (confirm(msg)) {
        inventory = imported;
        saveInventory();
        renderTable();
      }
    } catch (error) {
      alert("Error parsing JSON file: " + error.message);
    }
  };

  reader.readAsText(file);
};

/**
 * Exports current inventory to JSON format
 */
const exportJson = () => {
  const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,'');
  const exportData = inventory.map(item => ({
    metal: item.metal,
    name: item.name,
    qty: item.qty,
    type: item.type,
    weight: item.weight,
    price: item.price,
    date: item.date,
    purchaseLocation: item.purchaseLocation,
    spotPriceAtPurchase: item.spotPriceAtPurchase,
    isCollectable: item.isCollectable,
    premiumPerOz: item.premiumPerOz,
    totalPremium: item.totalPremium
  }));

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `metal_inventory_${timestamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

/**
 * Imports inventory data from Excel file
 * 
 * @param {File} file - Excel file to import
 */
const importExcel = (file) => {
  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Get first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Process data
      const imported = [];
      let skipped = 0;

      for (const row of jsonData) {
        const metal = row['Metal'] || 'Silver';
        const name = row['Name'] || row['name'];
        const qty = parseInt(row['Qty'] || row['qty'] || 1, 10);
        const type = row['Type'] || row['type'] || 'Other';
        const weight = parseFloat(row['Weight(oz)'] || row['weight']);
        const priceStr = row['Purchase Price'] || row['price'];
        const price = parseFloat(typeof priceStr === "string" ? priceStr.replace(/[^0-9.-]+/g,"") : priceStr);
        const purchaseLocation = row['Purchase Location'] || "Unknown";
        const date = parseDate(row['Date']); // Using the new date parser

        // Get collectable status
        const isCollectable = row['Collectable'] === 'Yes' || row['Collectable'] === 'true' || row['isCollectable'] === 'true';

        // Get spot price from Excel if available
        let spotPriceAtPurchase;
        if (row['Spot Price ($/oz)']) {
          // Extract numeric value from formatted string like "$1,234.56"
          const spotStr = row['Spot Price ($/oz)'].toString();
          spotPriceAtPurchase = parseFloat(spotStr.replace(/[^0-9.-]+/g, ""));
        } else if (row['spotPriceAtPurchase']) {
          spotPriceAtPurchase = parseFloat(row['spotPriceAtPurchase']);
        } else {
          // Fall back to current spot price if not in Excel and not collectable
          spotPriceAtPurchase = isCollectable ? 0 : (metal === 'Silver' ? spotSilver : spotGold);
        }

        // Calculate premium per ounce (only for non-collectible items)
        let premiumPerOz = 0;
        let totalPremium = 0;

        if (!isCollectable) {
          const pricePerOz = price / weight;
          premiumPerOz = pricePerOz - spotPriceAtPurchase;
          totalPremium = premiumPerOz * qty * weight;
        }

        if (!name || isNaN(qty) || isNaN(weight) || isNaN(price) || qty < 1 || !Number.isInteger(qty)) {
          skipped++;
          continue;
        }

        imported.push({ 
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
      }

      if (imported.length === 0) return alert("No valid items to import.");

      let msg = "Replace current inventory with imported file?";
      if (skipped > 0) msg += `\n(Skipped ${skipped} invalid rows)`;

      if (confirm(msg)) {
        inventory = imported;
        saveInventory();
        renderTable();
      }
    } catch (error) {
      alert("Error importing Excel file: " + error.message);
    }
  };

  reader.readAsArrayBuffer(file);
};

/**
 * Exports current inventory to Excel format
 */
const exportExcel = () => {
  const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,'');

  // Create worksheet data
  const wsData = [
    ["Metal", "Name", "Qty", "Type", "Weight(oz)", "Purchase Price", "Spot Price ($/oz)", 
     "Premium ($/oz)", "Total Premium", "Purchase Location", "Date", "Collectable"]
  ];

  for (const i of inventory) {
    // For collectable items, use current spot price (at time of export)
    const exportSpotPrice = i.isCollectable ? 
      (i.metal === 'Silver' ? spotSilver : spotGold) : 
      i.spotPriceAtPurchase;

    wsData.push([
      i.metal || 'Silver',
      i.name,
      i.qty,
      i.type,
      parseFloat(i.weight).toFixed(4),
      i.price,
      exportSpotPrice,
      i.isCollectable ? null : i.premiumPerOz,
      i.isCollectable ? null : i.totalPremium,
      i.purchaseLocation,
      i.date,
      i.isCollectable ? 'Yes' : 'No'
    ]);
  }

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Inventory");

  // Export
  XLSX.writeFile(wb, `metal_inventory_${timestamp}.xlsx`);
};

/**
 * Exports current inventory to PDF format
 */
const exportPdf = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text("Precious Metals Inventory", 14, 15);

  // Add date
  doc.setFontSize(10);
  doc.text(`Exported: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 22);

  // Prepare table data
  const tableData = inventory.map(item => [
    item.metal,
    item.name,
    item.qty,
    item.type,
    parseFloat(item.weight).toFixed(2),
    formatDollar(item.price),
    item.isCollectable ? 'N/A' : formatDollar(item.spotPriceAtPurchase),
    item.isCollectable ? 'N/A' : formatDollar(item.premiumPerOz),
    item.isCollectable ? 'N/A' : formatDollar(item.totalPremium),
    item.purchaseLocation,
    item.date,
    item.isCollectable ? 'Yes' : 'No'
  ]);

  // Add table
  doc.autoTable({
    head: [['Metal', 'Name', 'Qty', 'Type', 'Weight(oz)', 'Purchase Price', 
            'Spot Price ($/oz)', 'Premium ($/oz)', 'Total Premium', 
            'Purchase Location', 'Date', 'Collectable']],
    body: tableData,
    startY: 30,
    theme: 'striped',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [25, 118, 210] }
  });

  // Add totals
  const finalY = doc.lastAutoTable.finalY || 30;

  // Add totals section
  doc.setFontSize(12);
  doc.text("Totals", 14, finalY + 10);

  // Silver Totals
  doc.setFontSize(10);
  doc.text("Silver:", 14, finalY + 16);
  doc.text(`Total Items: ${elements.totals.silver.items.textContent}`, 25, finalY + 22);
  doc.text(`Total Weight: ${elements.totals.silver.weight.textContent} oz`, 25, finalY + 28);
  doc.text(`Purchase Price: ${elements.totals.silver.purchased.textContent}`, 25, finalY + 34);
  doc.text(`Current Value: ${elements.totals.silver.value.textContent}`, 25, finalY + 40);

  // Gold Totals
  doc.text("Gold:", 100, finalY + 16);
  doc.text(`Total Items: ${elements.totals.gold.items.textContent}`, 111, finalY + 22);
  doc.text(`Total Weight: ${elements.totals.gold.weight.textContent} oz`, 111, finalY + 28);
  doc.text(`Purchase Price: ${elements.totals.gold.purchased.textContent}`, 111, finalY + 34);
  doc.text(`Current Value: ${elements.totals.gold.value.textContent}`, 111, finalY + 40);

  // All Totals
  doc.setFontSize(11);
  doc.text("All Metals:", 14, finalY + 48);
  doc.text(`Total Items: ${elements.totals.all.items.textContent}`, 25, finalY + 54);
  doc.text(`Total Weight: ${elements.totals.all.weight.textContent} oz`, 25, finalY + 60);
  doc.text(`Purchase Price: ${elements.totals.all.purchased.textContent}`, 25, finalY + 66);
  doc.text(`Current Value: ${elements.totals.all.value.textContent}`, 25, finalY + 72);

  // Save PDF
  doc.save(`metal_inventory_${new Date().toISOString().slice(0,10).replace(/-/g,'')}.pdf`);
};

/**
 * Exports current inventory to HTML format with embedded styles
 */
const exportHtml = () => {
  const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,'');

  // Create HTML content with inline styles for portability
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Precious Metals Inventory</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }
    h1 {
      text-align: center;
      color: #0d6efd;
      margin-bottom: 10px;
    }
    .export-date {
      text-align: center;
      color: #6c757d;
      margin-bottom: 25px;
      font-size: 0.9rem;
    }
    .totals-section {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 25px;
      border: 1px solid #dee2e6;
    }
    .totals-title {
      font-weight: 600;
      color: #0d6efd;
      margin-bottom: 10px;
      text-align: center;
      font-size: 1.1rem;
    }
    .totals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
    }
    .total-card {
      background: white;
      border-radius: 6px;
      padding: 12px;
      border: 1px solid #e9ecef;
    }
    .total-item {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      border-bottom: 1px dashed #dee2e6;
    }
    .total-item:last-child {
      border-bottom: none;
    }
    .total-label {
      font-weight: 500;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
    }
    th {
      background-color: #e9ecef;
      color: #212529;
      font-weight: 600;
      padding: 10px;
      text-align: left;
    }
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #dee2e6;
    }
    tr:nth-child(even) {
      background-color: #f8f9fa;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #6c757d;
      font-size: 0.85rem;
      border-top: 1px solid #dee2e6;
      padding-top: 15px;
    }
  </style>
</head>
<body>
  <h1>Precious Metals Inventory</h1>
  <div class="export-date">Exported: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>

  <div class="totals-section">
    <div class="totals-title">Inventory Totals</div>
    <div class="totals-grid">
      <div class="total-card">
        <div style="font-weight: 600; margin-bottom: 8px; color: #0d6efd;">Silver Totals</div>
        <div class="total-item">
          <span class="total-label">Total Items:</span>
          <span class="total-value">${elements.totals.silver.items.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Weight:</span>
          <span class="total-value">${elements.totals.silver.weight.textContent} oz</span>
        </div>
        <div class="total-item">
          <span class="total-label">Purchase Price:</span>
          <span class="total-value">${elements.totals.silver.purchased.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Current Value:</span>
          <span class="total-value">${elements.totals.silver.value.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Price (oz):</span>
          <span class="total-value">${elements.totals.silver.avgPrice.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Premium (oz):</span>
          <span class="total-value">${elements.totals.silver.avgPremium.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Premium Paid:</span>
          <span class="total-value">${elements.totals.silver.premium.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Loss/Profit:</span>
          <span class="total-value">${elements.totals.silver.lossProfit.textContent}</span>
        </div>
      </div>

      <div class="total-card">
        <div style="font-weight: 600; margin-bottom: 8px; color: #0d6efd;">Gold Totals</div>
        <div class="total-item">
          <span class="total-label">Total Items:</span>
          <span class="total-value">${elements.totals.gold.items.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Weight:</span>
          <span class="total-value">${elements.totals.gold.weight.textContent} oz</span>
        </div>
        <div class="total-item">
          <span class="total-label">Purchase Price:</span>
          <span class="total-value">${elements.totals.gold.purchased.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Current Value:</span>
          <span class="total-value">${elements.totals.gold.value.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Price (oz):</span>
          <span class="total-value">${elements.totals.gold.avgPrice.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Premium (oz):</span>
          <span class="total-value">${elements.totals.gold.avgPremium.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Premium Paid:</span>
          <span class="total-value">${elements.totals.gold.premium.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Loss/Profit:</span>
          <span class="total-value">${elements.totals.gold.lossProfit.textContent}</span>
        </div>
      </div>

      <div class="total-card">
        <div style="font-weight: 600; margin-bottom: 8px; color: #0d6efd;">All Totals</div>
        <div class="total-item">
          <span class="total-label">Total Items:</span>
          <span class="total-value">${elements.totals.all.items.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Weight:</span>
          <span class="total-value">${elements.totals.all.weight.textContent} oz</span>
        </div>
        <div class="total-item">
          <span class="total-label">Purchase Price:</span>
          <span class="total-value">${elements.totals.all.purchased.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Current Value:</span>
          <span class="total-value">${elements.totals.all.value.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Price (oz):</span>
          <span class="total-value">${elements.totals.all.avgPrice.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Premium (oz):</span>
          <span class="total-value">${elements.totals.all.avgPremium.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Premium Paid:</span>
          <span class="total-value">${elements.totals.all.premium.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Loss/Profit:</span>
          <span class="total-value">${elements.totals.all.lossProfit.textContent}</span>
        </div>
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Metal</th>
        <th>Name</th>
        <th>Qty</th>
        <th>Type</th>
        <th>Weight (oz)</th>
        <th>Purchase Price</th>
        <th>Spot Price ($/oz)</th>
        <th>Premium ($/oz)</th>
        <th>Total Premium</th>
        <th>Purchase Location</th>
        <th>Date</th>
        <th>Collectable</th>
      </tr>
    </thead>
    <tbody>
      ${inventory.map(item => `
      <tr>
        <td>${item.metal}</td>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.type}</td>
        <td>${parseFloat(item.weight).toFixed(2)}</td>
        <td>${formatDollar(item.price)}</td>
        <td>${item.isCollectable ? 'N/A' : formatDollar(item.spotPriceAtPurchase)}</td>
        <td>${item.isCollectable ? 'N/A' : formatDollar(item.premiumPerOz)}</td>
        <td>${item.isCollectable ? 'N/A' : formatDollar(item.totalPremium)}</td>
        <td>${item.purchaseLocation}</td>
        <td>${item.date}</td>
        <td>${item.isCollectable ? 'Yes' : 'No'}</td>
      </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    Precious Metals Tool Inventory Report
  </div>
</body>
</html>
  `;

  // Create and download HTML file
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `metal_inventory_${timestamp}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

// =============================================================================
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
    const spotPriceAtPurchase = metal === 'Silver' ? spotSilver : spotGold;

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
    const spotPriceAtPurchase = parseFloat(elements.editSpotPrice.value);

    // Keep the existing collectable status
    const isCollectable = inventory[editingIndex].isCollectable;

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
  elements.saveSpotBtnSilver.addEventListener('click', () => updateManualSpot('Silver'));
  elements.resetSpotBtnSilver.addEventListener('click', () => resetSpot('Silver'));
  elements.userSpotPriceSilver.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') updateManualSpot('Silver');
  });

  elements.saveSpotBtnGold.addEventListener('click', () => updateManualSpot('Gold'));
  elements.resetSpotBtnGold.addEventListener('click', () => resetSpot('Gold'));
  elements.userSpotPriceGold.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') updateManualSpot('Gold');
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
    title.style.color = 'var(--accent)';

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ced4da; color: var(--accent);">Timestamp</th>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ced4da; color: var(--accent);">Spot Price</th>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ced4da; color: var(--accent);">Metal</th>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ced4da; color: var(--accent);">Source</th>
      </tr>
    `;

    const tbody = document.createElement('tbody');
    spotHistory.slice().reverse().forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="padding: 8px; border-bottom: 1px solid #ced4da; color: var(--fg);">${entry.timestamp}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ced4da; color: var(--fg);">${formatDollar(entry.spot)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ced4da; color: var(--fg);">${entry.metal}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ced4da; color: var(--fg);">${entry.source}</td>
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
    importCsv(e.target.files[0]);
    this.value = '';
  });

  elements.importJsonFile.addEventListener('change', function(e) {
    importJson(e.target.files[0]);
    this.value = '';
  });

  elements.importExcelFile.addEventListener('change', function(e) {
    importExcel(e.target.files[0]);
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
      localStorage.removeItem(USER_SPOT_SILVER_KEY);
      localStorage.removeItem(USER_SPOT_GOLD_KEY);
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
// INITIALIZATION
// =============================================================================

/**
 * Initializes the application after DOM content is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize DOM elements after DOM is loaded
  elements.spotPriceDisplaySilver = document.getElementById('spotPriceDisplaySilver');
  elements.spotPriceDisplayGold = document.getElementById('spotPriceDisplayGold');
  elements.userSpotPriceSilver = document.getElementById('userSpotPriceSilver');
  elements.userSpotPriceGold = document.getElementById('userSpotPriceGold');
  elements.inventoryForm = document.getElementById('inventoryForm');
  elements.inventoryTable = document.getElementById('inventoryTable').querySelector('tbody');
  elements.itemMetal = document.getElementById('itemMetal');
  elements.itemName = document.getElementById('itemName');
  elements.itemQty = document.getElementById('itemQty');
  elements.itemType = document.getElementById('itemType');
  elements.itemWeight = document.getElementById('itemWeight');
  elements.itemPrice = document.getElementById('itemPrice');
  elements.purchaseLocation = document.getElementById('purchaseLocation');
  elements.itemDate = document.getElementById('itemDate');
  elements.saveSpotBtnSilver = document.getElementById('saveSpotBtnSilver');
  elements.resetSpotBtnSilver = document.getElementById('resetSpotBtnSilver');
  elements.saveSpotBtnGold = document.getElementById('saveSpotBtnGold');
  elements.resetSpotBtnGold = document.getElementById('resetSpotBtnGold');
  elements.showSpotHistoryBtn = document.getElementById('showSpotHistoryBtn');
  elements.clearSpotHistoryBtn = document.getElementById('clearSpotHistoryBtn');
  elements.importCsvFile = document.getElementById('importCsvFile');
  elements.importJsonFile = document.getElementById('importJsonFile');
  elements.importExcelFile = document.getElementById('importExcelFile');
  elements.exportCsvBtn = document.getElementById('exportCsvBtn');
  elements.exportJsonBtn = document.getElementById('exportJsonBtn');
  elements.exportExcelBtn = document.getElementById('exportExcelBtn');
  elements.exportPdfBtn = document.getElementById('exportPdfBtn');
  elements.exportHtmlBtn = document.getElementById('exportHtmlBtn');
  elements.boatingAccidentBtn = document.getElementById('boatingAccidentBtn');
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
  elements.editDate = document.getElementById('editDate');
  elements.editSpotPrice = document.getElementById('editSpotPrice');
  elements.itemsPerPage = document.getElementById('itemsPerPage');
  elements.prevPage = document.getElementById('prevPage');
  elements.nextPage = document.getElementById('nextPage');
  elements.firstPage = document.getElementById('firstPage');
  elements.lastPage = document.getElementById('lastPage');
  elements.pageNumbers = document.getElementById('pageNumbers');
  elements.paginationInfo = document.getElementById('paginationInfo');
  elements.searchInput = document.getElementById('searchInput');
  elements.clearSearchBtn = document.getElementById('clearSearchBtn');
  elements.searchResultsInfo = document.getElementById('searchResultsInfo');
  elements.themeToggle = document.getElementById('themeToggle');

  // Initialize totals elements
  elements.totals.silver.items = document.getElementById('totalItemsSilver');
  elements.totals.silver.weight = document.getElementById('totalWeightSilver');
  elements.totals.silver.value = document.getElementById('currentValueSilver');
  elements.totals.silver.purchased = document.getElementById('totalPurchasedSilver');
  elements.totals.silver.premium = document.getElementById('totalPremiumSilver');
  elements.totals.silver.lossProfit = document.getElementById('lossProfitSilver');
  elements.totals.silver.avgPrice = document.getElementById('avgPriceSilver');
  elements.totals.silver.avgPremium = document.getElementById('avgPremiumSilver');

  elements.totals.gold.items = document.getElementById('totalItemsGold');
  elements.totals.gold.weight = document.getElementById('totalWeightGold');
  elements.totals.gold.value = document.getElementById('currentValueGold');
  elements.totals.gold.purchased = document.getElementById('totalPurchasedGold');
  elements.totals.gold.premium = document.getElementById('totalPremiumGold');
  elements.totals.gold.lossProfit = document.getElementById('lossProfitGold');
  elements.totals.gold.avgPrice = document.getElementById('avgPriceGold');
  elements.totals.gold.avgPremium = document.getElementById('avgPremiumGold');

  elements.totals.all.items = document.getElementById('totalItemsAll');
  elements.totals.all.weight = document.getElementById('totalWeightAll');
  elements.totals.all.value = document.getElementById('currentValueAll');
  elements.totals.all.purchased = document.getElementById('totalPurchasedAll');
  elements.totals.all.premium = document.getElementById('totalPremiumAll');
  elements.totals.all.lossProfit = document.getElementById('lossProfitAll');
  elements.totals.all.avgPrice = document.getElementById('avgPriceAll');
  elements.totals.all.avgPremium = document.getElementById('avgPremiumAll');

  // Initialize app
  elements.itemDate.value = todayStr();
  loadInventory();
  loadSpotHistory();
  renderTable();
  fetchSpotPrice();

  // Setup event listeners
  setupEventListeners();
  setupPagination();
  setupSearch();
  setupThemeToggle();
});

// Make toggleCollectable available globally for inline event handlers
window.toggleCollectable = toggleCollectable;
