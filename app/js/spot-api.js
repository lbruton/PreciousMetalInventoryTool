// SPOT PRICE API INTEGRATION - FILE:// COMPATIBLE VERSION
// =============================================================================
// This version gracefully handles both file:// and https:// environments
// Provides automatic spot price updates when possible, falls back to manual when not

/**
 * API Configuration
 */
const SPOT_API_CONFIG = {
  vercelApiUrl: 'https://precious-metals-vercel-api.vercel.app/api/prices',
  fallbackTimeout: 5000, // 5 seconds
  cacheKey: 'spot_api_cache',
  cacheDuration: 5 * 60 * 1000, // 5 minutes
  
  // Mapping between Vercel API symbols and inventory tool keys
  symbolMapping: {
    'XAU': 'gold',      // Gold
    'XAG': 'silver',    // Silver  
    'XPT': 'platinum',  // Platinum
    'XPD': 'palladium'  // Palladium
  }
};

/**
 * Detects if we're running from file:// protocol
 * @returns {boolean} True if running from file://
 */
function isRunningFromFile() {
  return typeof window !== 'undefined' && window.location.protocol === 'file:';
}

/**
 * Detects if we can make API calls (not from file:// and fetch is available)
 * @returns {boolean} True if API calls should work
 */
function canMakeApiCalls() {
  return typeof fetch !== 'undefined' && !isRunningFromFile();
}

/**
 * Fetches spot prices from your Vercel API
 * Returns null gracefully if running from file:// or if API is unavailable
 * 
 * @returns {Promise<Object|null>} Spot prices in inventory tool format or null if failed
 */
async function fetchSpotPricesFromAPI() {
  // Skip API calls if running from file://
  if (!canMakeApiCalls()) {
    console.log('📁 Running from file:// - API integration disabled (this is normal)');
    return null;
  }
  
  try {
    console.log('🔄 Fetching spot prices from Vercel API...');
    
    // Check cache first
    const cached = getCachedPrices();
    if (cached) {
      console.log('✅ Using cached spot prices');
      return cached;
    }
    
    // Fetch from Vercel API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SPOT_API_CONFIG.fallbackTimeout);
    
    const response = await fetch(SPOT_API_CONFIG.vercelApiUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const apiData = await response.json();
    
    // Convert API format to inventory tool format
    const inventoryPrices = convertApiToInventoryFormat(apiData);
    
    if (!inventoryPrices || Object.keys(inventoryPrices).length === 0) {
      throw new Error('No valid price data received from API');
    }
    
    // Cache the results
    cachePrices(inventoryPrices, apiData);
    
    console.log('✅ Successfully fetched spot prices from API:', inventoryPrices);
    return inventoryPrices;
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('⚠️ API request timed out (this is normal if running offline)');
    } else {
      console.warn('⚠️ API fetch failed (falling back to manual prices):', error.message);
    }
    
    // Try to return cached data even if expired
    const expiredCache = getCachedPrices(true);
    if (expiredCache) {
      console.log('📦 Using expired cache as fallback');
      return expiredCache;
    }
    
    return null;
  }
}

/**
 * Converts Vercel API format to inventory tool format
 * 
 * @param {Object} apiData - Raw data from Vercel API
 * @returns {Object|null} Converted prices or null if invalid
 */
function convertApiToInventoryFormat(apiData) {
  if (!apiData || typeof apiData !== 'object') {
    return null;
  }
  
  const inventoryPrices = {};
  let validPrices = 0;
  
  // Convert each symbol to inventory format
  Object.entries(SPOT_API_CONFIG.symbolMapping).forEach(([symbol, inventoryKey]) => {
    if (apiData[symbol] && apiData[symbol].price) {
      const price = parseFloat(apiData[symbol].price);
      if (price > 0 && !isNaN(price)) {
        inventoryPrices[inventoryKey] = price;
        validPrices++;
      }
    }
  });
  
  // Require at least 2 valid prices
  if (validPrices < 2) {
    console.warn('⚠️ Insufficient valid prices from API');
    return null;
  }
  
  return inventoryPrices;
}

/**
 * Gets cached spot prices if still valid
 * Only uses localStorage if available (graceful fallback)
 * 
 * @param {boolean} allowExpired - Return expired cache if no fresh data
 * @returns {Object|null} Cached prices or null
 */
function getCachedPrices(allowExpired = false) {
  try {
    // Skip if localStorage not available
    if (typeof localStorage === 'undefined') {
      return null;
    }
    
    const cached = JSON.parse(localStorage.getItem(SPOT_API_CONFIG.cacheKey) || 'null');
    
    if (!cached || !cached.prices || !cached.timestamp) {
      return null;
    }
    
    const age = Date.now() - cached.timestamp;
    
    if (!allowExpired && age > SPOT_API_CONFIG.cacheDuration) {
      return null; // Cache expired
    }
    
    return cached.prices;
  } catch (error) {
    console.warn('⚠️ Error reading cache (this is normal in some browsers):', error.message);
    return null;
  }
}

/**
 * Caches spot prices locally
 * Gracefully handles localStorage unavailability
 * 
 * @param {Object} prices - Converted prices for inventory tool
 * @param {Object} rawData - Raw API data for debugging
 */
function cachePrices(prices, rawData) {
  try {
    // Skip if localStorage not available
    if (typeof localStorage === 'undefined') {
      return;
    }
    
    const cacheData = {
      prices: prices,
      timestamp: Date.now(),
      source: 'vercel-api',
      rawData: rawData // For debugging purposes
    };
    
    localStorage.setItem(SPOT_API_CONFIG.cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('⚠️ Error caching prices (this is normal in some browsers):', error.message);
  }
}

/**
 * Get environment information for debugging
 * 
 * @returns {Object} Environment details
 */
function getEnvironmentInfo() {
  return {
    protocol: typeof window !== 'undefined' ? window.location.protocol : 'unknown',
    isFile: isRunningFromFile(),
    canMakeApiCalls: canMakeApiCalls(),
    hasFetch: typeof fetch !== 'undefined',
    hasLocalStorage: typeof localStorage !== 'undefined',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
  };
}

/**
 * Enhanced fetchSpotPrice function that integrates with Vercel API
 * This version works both online (https://) and offline (file://)
 */
const fetchSpotPriceEnhanced = async () => {
  console.log('🔄 Starting enhanced spot price fetch...');
  
  const envInfo = getEnvironmentInfo();
  console.log('🌍 Environment:', envInfo);
  
  // Try to get prices from Vercel API first (only if not file://)
  if (envInfo.canMakeApiCalls) {
    console.log('🌐 Online mode: Attempting API fetch...');
    const apiPrices = await fetchSpotPricesFromAPI();
    
    if (apiPrices) {
      // Update global spotPrices with API data
      Object.entries(apiPrices).forEach(([metalKey, price]) => {
        spotPrices[metalKey] = price;
        
        // Update display elements if they exist
        if (elements.spotPriceDisplay && elements.spotPriceDisplay[metalKey]) {
          elements.spotPriceDisplay[metalKey].textContent = formatDollar(price);
          
          // Visual indicator for API data
          const display = elements.spotPriceDisplay[metalKey];
          display.title = '🌐 Live price from API - Click to override manually';
          display.style.color = 'var(--success, #059669)';
          display.style.fontWeight = '600';
        }
        
        // Record in spot history if function exists
        if (typeof recordSpot === 'function') {
          const metalConfig = Object.values(METALS || {}).find(m => m.key === metalKey);
          if (metalConfig) {
            recordSpot(price, 'api', metalConfig.name);
          }
        }
      });
      
      console.log('✅ Updated spot prices from API');
    } else {
      console.log('📝 No API data available, falling back to manual prices');
    }
  } else {
    console.log('📁 Offline mode: Using manual prices only');
  }
  
  // Always load manual prices from localStorage (API data takes precedence if available)
  if (typeof METALS !== 'undefined' && envInfo.hasLocalStorage) {
    Object.values(METALS).forEach(metalConfig => {
      const storedSpot = localStorage.getItem(metalConfig.localStorageKey);
      if (storedSpot && !spotPrices[metalConfig.key]) {
        // Only use manual price if API didn't provide one
        const price = parseFloat(storedSpot);
        spotPrices[metalConfig.key] = price;
        
        if (elements.spotPriceDisplay && elements.spotPriceDisplay[metalConfig.key]) {
          elements.spotPriceDisplay[metalConfig.key].textContent = formatDollar(price);
          
          // Visual indicator for manual data
          const display = elements.spotPriceDisplay[metalConfig.key];
          display.title = '✏️ Manual price - Updated by you';
          display.style.color = 'var(--warning, #d97706)';
          display.style.fontWeight = '500';
        }
        
        if (typeof recordSpot === 'function') {
          recordSpot(price, 'manual', metalConfig.name);
        }
      } else if (!storedSpot && !spotPrices[metalConfig.key]) {
        // No data available at all
        if (elements.spotPriceDisplay && elements.spotPriceDisplay[metalConfig.key]) {
          elements.spotPriceDisplay[metalConfig.key].textContent = 'N/A';
          elements.spotPriceDisplay[metalConfig.key].style.color = 'var(--text-muted, #94a3b8)';
          elements.spotPriceDisplay[metalConfig.key].title = '📝 No price data - Set manually below';
        }
      }
    });
  }
  
  // Always update summary after spot price changes
  if (typeof updateSummary === 'function') {
    updateSummary();
  }
  
  console.log('📊 Final spot prices:', spotPrices);
  
  // Show environment-specific message
  if (isRunningFromFile()) {
    console.log('💡 TIP: For automatic price updates, serve this tool from a web server (http:// or https://)');
  }
};

/**
 * Manual refresh function - works in both online and offline modes
 */
const refreshSpotPricesFromAPI = async () => {
  console.log('🔄 Manual refresh requested...');
  
  if (!canMakeApiCalls()) {
    console.log('📁 Running offline - refresh not available');
    alert('💡 Automatic refresh requires running from a web server.\n\nCurrently running from file:// - please set prices manually or serve from http://localhost');
    return spotPrices;
  }
  
  // Clear cache to force fresh fetch
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(SPOT_API_CONFIG.cacheKey);
    }
  } catch (e) {
    // Ignore localStorage errors
  }
  
  // Show loading state
  if (typeof METALS !== 'undefined') {
    Object.values(METALS).forEach(metalConfig => {
      if (elements.spotPriceDisplay && elements.spotPriceDisplay[metalConfig.key]) {
        elements.spotPriceDisplay[metalConfig.key].textContent = 'Loading...';
      }
    });
  }
  
  // Fetch fresh data
  await fetchSpotPriceEnhanced();
  
  return spotPrices;
};

/**
 * Get spot price status for admin/debug purposes
 */
function getSpotPriceStatus() {
  const envInfo = getEnvironmentInfo();
  const cached = getCachedPrices(true);
  const cacheAge = cached && envInfo.hasLocalStorage ? 
    Date.now() - JSON.parse(localStorage.getItem(SPOT_API_CONFIG.cacheKey) || '{"timestamp":0}').timestamp : null;
  
  return {
    environment: envInfo,
    currentPrices: {...(spotPrices || {})},
    hasCache: !!cached,
    cacheAge: cacheAge,
    cacheAgeMinutes: cacheAge ? Math.floor(cacheAge / 60000) : null,
    apiUrl: SPOT_API_CONFIG.vercelApiUrl,
    lastUpdate: new Date().toISOString(),
    recommendation: envInfo.isFile ? 
      'For automatic updates, serve from web server (http://localhost or https://)' :
      'Automatic API updates available'
  };
}

// Make functions available globally
if (typeof window !== 'undefined') {
  window.fetchSpotPrice = fetchSpotPriceEnhanced;
  window.refreshSpotPricesFromAPI = refreshSpotPricesFromAPI;
  window.getSpotPriceStatus = getSpotPriceStatus;
  window.getEnvironmentInfo = getEnvironmentInfo;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchSpotPricesFromAPI,
    fetchSpotPriceEnhanced,
    refreshSpotPricesFromAPI,
    getSpotPriceStatus,
    getEnvironmentInfo,
    SPOT_API_CONFIG
  };
}
