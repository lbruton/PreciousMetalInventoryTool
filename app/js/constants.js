// CONFIGURATION & GLOBAL CONSTANTS
// =============================================================================

/** @constant {string} APP_VERSION - Application version */
const APP_VERSION = '3.0.3';

/** @constant {string} LS_KEY - LocalStorage key for inventory data */
const LS_KEY = 'metalInventory';

/** @constant {string} SPOT_HISTORY_KEY - LocalStorage key for spot price history */
const SPOT_HISTORY_KEY = 'metalSpotHistory';

/** @constant {string} THEME_KEY - LocalStorage key for theme preference */
const THEME_KEY = 'appTheme';

/**
 * Metal configuration object - Central registry for all metal-related information
 * 
 * This configuration drives the entire application's metal handling by defining:
 * - Display names for user interface elements
 * - Key identifiers for data structures and calculations
 * - DOM element ID patterns for dynamic element selection
 * - LocalStorage keys for persistent data storage
 * - CSS color variables for styling and theming
 * 
 * Each metal configuration contains:
 * @property {string} name - Display name used in UI elements and forms
 * @property {string} key - Lowercase identifier for data objects and calculations
 * @property {string} spotKey - DOM ID pattern for spot price input elements
 * @property {string} localStorageKey - Key for storing spot prices in localStorage
 * @property {string} color - CSS custom property name for metal-specific styling
 * 
 * Adding a new metal type requires:
 * 1. Adding configuration here
 * 2. Adding corresponding HTML elements following the naming pattern
 * 3. Adding CSS custom properties for colors
 * 4. The application will automatically handle the rest through iteration
 */
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
