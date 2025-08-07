// CONFIGURATION & GLOBAL CONSTANTS
/**
 * API Provider configurations for metals pricing services
 * 
 * Each provider configuration contains:
 * @property {string} name - Display name for the provider
 * @property {string} baseUrl - Base API endpoint URL
 * @property {Object} endpoints - API endpoints for different metals
 * @property {function} parseResponse - Function to parse API response into standard format
 * @property {string} documentation - URL to provider's API documentation
 */
const API_PROVIDERS = {
  METALS_DEV: {
    name: 'Metals.dev',
    baseUrl: 'https://api.metals.dev/v1',
    endpoints: {
      silver: '/latest/XAG',
      gold: '/latest/XAU',
      platinum: '/latest/XPT',
      palladium: '/latest/XPD'
    },
    parseResponse: (data, metal) => {
      // Expected format: { "XAG": { "USD": 25.50 } }
      const metalCode = metal === 'silver' ? 'XAG' : metal === 'gold' ? 'XAU' : 
                       metal === 'platinum' ? 'XPT' : 'XPD';
      return data[metalCode]?.USD || null;
    },
    documentation: 'https://metals.dev/docs'
  },
  METALS_API: {
    name: 'Metals-API.com',
    baseUrl: 'https://metals-api.com/api',
    endpoints: {
      silver: '/latest?access_key={API_KEY}&base=USD&symbols=XAG',
      gold: '/latest?access_key={API_KEY}&base=USD&symbols=XAU',
      platinum: '/latest?access_key={API_KEY}&base=USD&symbols=XPT',
      palladium: '/latest?access_key={API_KEY}&base=USD&symbols=XPD'
    },
    parseResponse: (data, metal) => {
      // Expected format: { "success": true, "rates": { "XAG": 0.04 } }
      const metalCode = metal === 'silver' ? 'XAG' : metal === 'gold' ? 'XAU' : 
                       metal === 'platinum' ? 'XPT' : 'XPD';
      const rate = data.rates?.[metalCode];
      return rate ? (1 / rate) : null; // Convert from metal per USD to USD per ounce
    },
    documentation: 'https://metals-api.com/documentation'
  },
  METAL_PRICE_API: {
    name: 'MetalPriceAPI.com',
    baseUrl: 'https://api.metalpriceapi.com/v1',
    endpoints: {
      silver: '/latest?api_key={API_KEY}&base=USD&currencies=XAG',
      gold: '/latest?api_key={API_KEY}&base=USD&currencies=XAU',
      platinum: '/latest?api_key={API_KEY}&base=USD&currencies=XPT',
      palladium: '/latest?api_key={API_KEY}&base=USD&currencies=XPD'
    },
    parseResponse: (data, metal) => {
      // Expected format: { "success": true, "rates": { "XAG": 0.04 } }
      const metalCode = metal === 'silver' ? 'XAG' : metal === 'gold' ? 'XAU' : 
                       metal === 'platinum' ? 'XPT' : 'XPD';
      const rate = data.rates?.[metalCode];
      return rate ? (1 / rate) : null; // Convert from metal per USD to USD per ounce
    },
    documentation: 'https://metalpriceapi.com/documentation'
  }
};

// =============================================================================

/** @constant {string} APP_VERSION - Application version */
const APP_VERSION = '3.1.8';

/** @constant {string} LS_KEY - LocalStorage key for inventory data */
const LS_KEY = 'metalInventory';

/** @constant {string} SPOT_HISTORY_KEY - LocalStorage key for spot price history */
const SPOT_HISTORY_KEY = 'metalSpotHistory';

/** @constant {string} THEME_KEY - LocalStorage key for theme preference */
const THEME_KEY = 'appTheme';

/** @constant {string} API_KEY_STORAGE_KEY - LocalStorage key for API provider information */
const API_KEY_STORAGE_KEY = 'metalApiConfig';

/** @constant {string} API_CACHE_KEY - LocalStorage key for cached API data */
const API_CACHE_KEY = 'metalApiCache';

/** @constant {number} API_CACHE_DURATION - Cache duration in milliseconds (24 hours) */
const API_CACHE_DURATION = 24 * 60 * 60 * 1000;

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
    spotKey: 'spotSilver',
    localStorageKey: 'spotSilver',
    color: 'silver',
    defaultPrice: 25.00
  },
  GOLD: { 
    name: 'Gold', 
    key: 'gold', 
    spotKey: 'spotGold',
    localStorageKey: 'spotGold',
    color: 'gold',
    defaultPrice: 2500.00
  },
  PLATINUM: { 
    name: 'Platinum', 
    key: 'platinum', 
    spotKey: 'spotPlatinum',
    localStorageKey: 'spotPlatinum',
    color: 'platinum',
    defaultPrice: 1000.00
  },
  PALLADIUM: { 
    name: 'Palladium', 
    key: 'palladium', 
    spotKey: 'spotPalladium',
    localStorageKey: 'spotPalladium',
    color: 'palladium',
    defaultPrice: 1000.00
  }
};

// =============================================================================
