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
 * @param {string} metal - Metal type ('Silver', 'Gold', 'Platinum', or 'Palladium')
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
 * Fetches and displays current spot prices from localStorage or defaults
 */
const fetchSpotPrice = () => {
  // Load spot prices for all metals
  Object.values(METALS).forEach(metalConfig => {
    const storedSpot = localStorage.getItem(metalConfig.localStorageKey);
    if (storedSpot) {
      spotPrices[metalConfig.key] = parseFloat(storedSpot);
      elements.spotPriceDisplay[metalConfig.key].textContent = formatDollar(spotPrices[metalConfig.key]);
      recordSpot(spotPrices[metalConfig.key], 'stored', metalConfig.name);
    } else {
      // Use default price if no stored price
      const defaultPrice = metalConfig.defaultPrice;
      spotPrices[metalConfig.key] = defaultPrice;
      elements.spotPriceDisplay[metalConfig.key].textContent = formatDollar(defaultPrice);
      // Don't record default prices in history automatically
    }
  });

  updateSummary();
};

/**
 * Updates spot price for specified metal from user input
 * 
 * @param {string} metalKey - Key of metal to update ('silver', 'gold', 'platinum', 'palladium')
 */
const updateManualSpot = (metalKey) => {
  const metalConfig = Object.values(METALS).find(m => m.key === metalKey);
  if (!metalConfig) return;

  const input = elements.userSpotPriceInput[metalKey];
  const value = input.value;

  if (!value) return;

  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return alert(`Invalid ${metalConfig.name.toLowerCase()} spot price.`);

  localStorage.setItem(metalConfig.localStorageKey, num);
  spotPrices[metalKey] = num;

  elements.spotPriceDisplay[metalKey].textContent = formatDollar(num);
  recordSpot(num, 'manual', metalConfig.name);

  updateSummary();
  
  // Clear the input and hide the manual input section
  input.value = '';
  hideManualInput(metalConfig.name);
};

/**
 * Resets spot price for specified metal to default or API cached value
 * 
 * @param {string} metalKey - Key of metal to reset ('silver', 'gold', 'platinum', 'palladium')
 */
const resetSpot = (metalKey) => {
  const metalConfig = Object.values(METALS).find(m => m.key === metalKey);
  if (!metalConfig) return;

  let resetPrice = metalConfig.defaultPrice;
  let source = 'default';

  // If we have cached API data, use that instead
  if (apiCache && apiCache.data && apiCache.data[metalKey]) {
    resetPrice = apiCache.data[metalKey];
    source = 'api';
  }

  // Update price
  localStorage.setItem(metalConfig.localStorageKey, resetPrice.toString());
  spotPrices[metalKey] = resetPrice;
  
  // Update display
  elements.spotPriceDisplay[metalKey].textContent = formatDollar(resetPrice);
  
  // Record in history
  recordSpot(resetPrice, source, metalConfig.name);
  
  // Update summary
  updateSummary();
  
  // Hide manual input if shown
  hideManualInput(metalConfig.name);
};

/**
 * Alternative reset function that works with metal name instead of key
 * This provides compatibility with the API.js resetSpotPrice function
 * 
 * @param {string} metalName - Name of metal to reset ('Silver', 'Gold', etc.)
 */
const resetSpotByName = (metalName) => {
  const metalConfig = Object.values(METALS).find(m => m.name === metalName);
  if (metalConfig) {
    resetSpot(metalConfig.key);
  }
};

// =============================================================================
