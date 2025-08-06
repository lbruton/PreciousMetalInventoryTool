// CONFIGURATION & GLOBAL CONSTANTS
// =============================================================================

/** @constant {string} APP_VERSION - Application version */
const APP_VERSION = '3.0.1';

/** @constant {string} LS_KEY - LocalStorage key for inventory data */
const LS_KEY = 'metalInventory';

/** @constant {string} SPOT_HISTORY_KEY - LocalStorage key for spot price history */
const SPOT_HISTORY_KEY = 'metalSpotHistory';

/** @constant {string} THEME_KEY - LocalStorage key for theme preference */
const THEME_KEY = 'appTheme';

// Metal configuration - central point for all metal-related information
const METALS = {
  SILVER: { 
    name: 'Silver', 
    key: 'silver', 
    spotKey: 'userSpotPriceSilver',
    localStorageKey: 'spotSilver',
    color: 'silver'
  },
  GOLD: { 
    name: 'Gold', 
    key: 'gold', 
    spotKey: 'userSpotPriceGold',
    localStorageKey: 'spotGold',
    color: 'gold'
  },
  PLATINUM: { 
    name: 'Platinum', 
    key: 'platinum', 
    spotKey: 'userSpotPricePlatinum',
    localStorageKey: 'spotPlatinum',
    color: 'platinum'
  },
  PALLADIUM: { 
    name: 'Palladium', 
    key: 'palladium', 
    spotKey: 'userSpotPricePalladium',
    localStorageKey: 'spotPalladium',
    color: 'palladium'
  }
};

// =============================================================================
