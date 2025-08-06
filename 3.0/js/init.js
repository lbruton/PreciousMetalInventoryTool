// INITIALIZATION
// =============================================================================

/**
 * Initializes the application after DOM content is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize DOM elements after DOM is loaded
  elements.spotPriceDisplaySilver = document.getElementById('spotPriceDisplaySilver');
  elements.spotPriceDisplayGold = document.getElementById('spotPriceDisplayGold');
  elements.spotPriceDisplayPlatinum = document.getElementById('spotPriceDisplayPlatinum');
  elements.spotPriceDisplayPalladium = document.getElementById('spotPriceDisplayPalladium');

  elements.userSpotPriceSilver = document.getElementById('userSpotPriceSilver');
  elements.userSpotPriceGold = document.getElementById('userSpotPriceGold');
  elements.userSpotPricePlatinum = document.getElementById('userSpotPricePlatinum');
  elements.userSpotPricePalladium = document.getElementById('userSpotPricePalladium');

  elements.saveSpotBtnSilver = document.getElementById('saveSpotBtnSilver');
  elements.saveSpotBtnGold = document.getElementById('saveSpotBtnGold');
  elements.saveSpotBtnPlatinum = document.getElementById('saveSpotBtnPlatinum');
  elements.saveSpotBtnPalladium = document.getElementById('saveSpotBtnPalladium');

  elements.resetSpotBtnSilver = document.getElementById('resetSpotBtnSilver');
  elements.resetSpotBtnGold = document.getElementById('resetSpotBtnGold');
  elements.resetSpotBtnPlatinum = document.getElementById('resetSpotBtnPlatinum');
  elements.resetSpotBtnPalladium = document.getElementById('resetSpotBtnPalladium');

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

  // Initialize details modal elements
  elements.detailsModal = document.getElementById('detailsModal');
  elements.detailsModalTitle = document.getElementById('detailsModalTitle');
  elements.typeBreakdown = document.getElementById('typeBreakdown');
  elements.locationBreakdown = document.getElementById('locationBreakdown');

  // Initialize chart canvas elements
  elements.typeChart = document.getElementById('typeChart');
  elements.locationChart = document.getElementById('locationChart');

  // Initialize spot price elements for all metals
  Object.values(METALS).forEach(metalConfig => {
    const metalKey = metalConfig.key;
    elements.spotPriceDisplay[metalKey] = document.getElementById(`spotPriceDisplay${metalConfig.name}`);
    elements.userSpotPriceInput[metalKey] = document.getElementById(`userSpotPrice${metalConfig.name}`);
    elements.saveSpotBtn[metalKey] = document.getElementById(`saveSpotBtn${metalConfig.name}`);
    elements.resetSpotBtn[metalKey] = document.getElementById(`resetSpotBtn${metalConfig.name}`);
  });

  // Initialize totals elements
  Object.values(METALS).forEach(metalConfig => {
    const metalKey = metalConfig.key;
    elements.totals[metalKey] = {
      items: document.getElementById(`totalItems${metalConfig.name}`),
      weight: document.getElementById(`totalWeight${metalConfig.name}`),
      value: document.getElementById(`currentValue${metalConfig.name}`),
      purchased: document.getElementById(`totalPurchased${metalConfig.name}`),
      premium: document.getElementById(`totalPremium${metalConfig.name}`),
      lossProfit: document.getElementById(`lossProfit${metalConfig.name}`),
      avgPrice: document.getElementById(`avgPrice${metalConfig.name}`),
      avgPremium: document.getElementById(`avgPremium${metalConfig.name}`),
      avgCollectablePrice: document.getElementById(`avgCollectablePrice${metalConfig.name}`),
      avgNonCollectablePrice: document.getElementById(`avgNonCollectablePrice${metalConfig.name}`)
    };
  });

  // Initialize "All" totals with null safety
  const nullElement = {
    textContent: '',
    innerHTML: '',
    style: {}
  };

  elements.totals.all = {
    items: document.getElementById('totalItemsAll') || nullElement,
    weight: document.getElementById('totalWeightAll') || nullElement,
    value: document.getElementById('currentValueAll') || nullElement,
    purchased: document.getElementById('totalPurchasedAll') || nullElement,
    premium: document.getElementById('totalPremiumAll') || nullElement,
    lossProfit: document.getElementById('lossProfitAll') || nullElement,
    avgPrice: document.getElementById('avgPriceAll') || nullElement,
    avgPremium: document.getElementById('avgPremiumAll') || nullElement,
    avgCollectablePrice: document.getElementById('avgCollectablePriceAll') || nullElement,
    avgNonCollectablePrice: document.getElementById('avgNonCollectablePriceAll') || nullElement
  };

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

// Make functions available globally for inline event handlers
window.toggleCollectable = toggleCollectable;
window.showDetailsModal = showDetailsModal;
window.closeDetailsModal = closeDetailsModal;
window.editItem = editItem;
window.deleteItem = deleteItem;
