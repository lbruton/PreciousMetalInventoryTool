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

/** @type {Object} Chart instances for proper cleanup */
let chartInstances = {
  typeChart: null,
  locationChart: null
};

/** @type {Object} Cached DOM elements for performance */
const elements = {
  // Spot price elements
  spotPriceDisplay: {},
  userSpotPriceInput: {},
  saveSpotBtn: {},
  resetSpotBtn: {},

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
  storageLocation: null,
  itemDate: null,

  // Spot price buttons
  saveSpotBtnSilver: null,
  saveSpotBtnGold: null,
  resetSpotBtnSilver: null,
  resetSpotBtnGold: null,



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
  editStorageLocation: null,
  editDate: null,
  editSpotPrice: null,

  // Details modal elements
  detailsModal: null,
  detailsModalTitle: null,
  typeBreakdown: null,
  locationBreakdown: null,

  // Chart canvas elements
  typeChart: null,
  locationChart: null,

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
      avgPrice: null,    // Average price per ounce
      avgPremium: null,  // Average premium per ounce
      avgCollectablePrice: null,    // Average collectable price per ounce
      avgNonCollectablePrice: null, // Average non-collectable price per ounce
      premium: null,     // Total premium paid
      lossProfit: null   // Total loss/profit
    },
    gold: {
      // Same structure as silver
      items: null,
      weight: null,
      value: null,
      purchased: null,
      avgPrice: null,
      avgPremium: null,
      avgCollectablePrice: null,
      avgNonCollectablePrice: null,
      premium: null,     // Total premium paid
      lossProfit: null   // Total loss/profit
    },
    platinum: {
      items: null,
      weight: null,
      value: null,
      purchased: null,
      avgPrice: null,
      avgPremium: null,
      avgCollectablePrice: null,
      avgNonCollectablePrice: null,
      premium: null,     // Total premium paid
      lossProfit: null   // Total loss/profit
    },
    palladium: {
      items: null,
      weight: null,
      value: null,
      purchased: null,
      avgPrice: null,
      avgPremium: null,
      avgCollectablePrice: null,
      avgNonCollectablePrice: null,
      premium: null,     // Total premium paid
      lossProfit: null   // Total loss/profit
    },
    all: {
      // Combined totals for all metals
      items: null,
      weight: null,
      value: null,
      purchased: null,
      avgPrice: null,
      avgPremium: null,
      avgCollectablePrice: null,
      avgNonCollectablePrice: null,
      premium: null,     // Total premium paid
      lossProfit: null   // Total loss/profit
    }
  }
};

/** @type {Array} Main inventory data structure */
let inventory = [];

/** @type {Object} Current spot prices for all metals */
let spotPrices = {
  silver: 0,
  gold: 0,
  platinum: 0,
  palladium: 0
};

/** @type {Array} Historical spot price records */
let spotHistory = [];

// =============================================================================
