// SPOT PRICE FUNCTIONS - ENHANCED WITH FILE:// COMPATIBLE API INTEGRATION
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
 * @param {string} source - Source of spot price ('manual', 'api', or specific provider)
 * @param {string} metal - Metal type ('Silver', 'Gold', 'Platinum', or 'Palladium')
 */
const recordSpot = (newSpot, source, metal) => {
  if (!spotHistory.length || 
      spotHistory[spotHistory.length-1].spot !== newSpot || 
      spotHistory[spotHistory.length-1].metal !== metal) {
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
 * Detects if running from file:// protocol
 */
const isFileProtocol = () => {
  return typeof window !== 'undefined' && window.location.protocol === 'file:';
};

/**
 * Fetches and displays current spot prices
 * Now enhanced with file://-compatible Vercel API integration!
 * 
 * Priority order:
 * 1. Vercel API (when running from web server)
 * 2. Manual localStorage values (always available)
 * 3. Display 'N/A' for missing data
 */
const fetchSpotPrice = async () => {
  console.log('🔄 Fetching spot prices...');
  
  // Check if we're running from file://
  if (isFileProtocol()) {
    console.log('📁 Running from file:// - using manual prices only (this is normal)');
  } else {
    console.log('🌐 Running from web server - attempting API integration...');
    
    // Try Vercel API first (if spot-api.js is loaded and we're not on file://)
    if (typeof fetchSpotPricesFromAPI === 'function') {
      try {
        const apiPrices = await fetchSpotPricesFromAPI();
        
        if (apiPrices && Object.keys(apiPrices).length > 0) {
          console.log('✅ Using Vercel API prices');
          
          // Update global spotPrices and display
          Object.entries(apiPrices).forEach(([metalKey, price]) => {
            spotPrices[metalKey] = price;
            
            if (elements.spotPriceDisplay && elements.spotPriceDisplay[metalKey]) {
              elements.spotPriceDisplay[metalKey].textContent = formatDollar(price);
              
              // Add visual indicator that this came from API
              const display = elements.spotPriceDisplay[metalKey];
              display.title = '🌐 Live price from API - Click to override manually';
              display.style.color = 'var(--success, #059669)';
              display.style.fontWeight = '600';
            }
            
            // Record in history
            const metalConfig = Object.values(METALS).find(m => m.key === metalKey);
            if (metalConfig) {
              recordSpot(price, 'api', metalConfig.name);
            }
          });
          
          updateSummary();
          return; // Success! Exit early
        }
      } catch (error) {
        console.warn('⚠️ Vercel API fetch failed, falling back to manual prices:', error.message);
      }
    }
  }
  
  // Fallback: Load manual prices from localStorage (works in both file:// and web server modes)
  console.log('📝 Loading manual spot prices from localStorage');
  
  Object.values(METALS).forEach(metalConfig => {
    const storedSpot = localStorage.getItem(metalConfig.localStorageKey);
    if (storedSpot) {
      const price = parseFloat(storedSpot);
      spotPrices[metalConfig.key] = price;
      
      if (elements.spotPriceDisplay && elements.spotPriceDisplay[metalConfig.key]) {
        elements.spotPriceDisplay[metalConfig.key].textContent = formatDollar(price);
        
        // Visual indicator for manual prices
        const display = elements.spotPriceDisplay[metalConfig.key];
        display.title = '✏️ Manual price - Updated by you';
        display.style.color = 'var(--warning, #d97706)';
        display.style.fontWeight = '500';
      }
      
      recordSpot(price, 'manual', metalConfig.name);
    } else {
      // No data available
      if (elements.spotPriceDisplay && elements.spotPriceDisplay[metalConfig.key]) {
        elements.spotPriceDisplay[metalConfig.key].textContent = 'N/A';
        elements.spotPriceDisplay[metalConfig.key].style.color = 'var(--text-muted, #94a3b8)';
        elements.spotPriceDisplay[metalConfig.key].title = '📝 No price data - Set manually below';
      }
    }
  });

  updateSummary();
};

/**
 * Updates spot price for specified metal from user input
 * Enhanced to work alongside API integration
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
  if (isNaN(num) || num <= 0) {
    return alert(`Invalid ${metalConfig.name.toLowerCase()} spot price.`);
  }

  // Save manual override to localStorage
  localStorage.setItem(metalConfig.localStorageKey, num);
  spotPrices[metalKey] = num;

  // Update display with manual override styling
  if (elements.spotPriceDisplay[metalKey]) {
    elements.spotPriceDisplay[metalKey].textContent = formatDollar(num);
    elements.spotPriceDisplay[metalKey].style.color = 'var(--warning, #d97706)';
    elements.spotPriceDisplay[metalKey].style.fontWeight = '600';
    elements.spotPriceDisplay[metalKey].title = '✏️ Manual override - You set this price';
  }
  
  // Record as manual entry
  recordSpot(num, 'manual', metalConfig.name);

  // Clear the input
  input.value = '';
  
  // Show success feedback
  const button = elements.saveSpotBtn[metalKey];
  if (button) {
    const originalText = button.textContent;
    button.textContent = '✅ Saved';
    button.style.background = 'var(--success, #059669)';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 2000);
  }

  updateSummary();
  
  console.log(`💾 Manual ${metalConfig.name} spot price set to $${num}`);
};

/**
 * Resets spot price for specified metal (removes manual override)
 * Will allow API prices to be used again (when available)
 * 
 * @param {string} metalKey - Key of metal to reset ('silver', 'gold', 'platinum', 'palladium')
 */
const resetSpot = (metalKey) => {
  const metalConfig = Object.values(METALS).find(m => m.key === metalKey);
  if (!metalConfig) return;

  // Remove manual override
  localStorage.removeItem(metalConfig.localStorageKey);
  
  // Clear any API cache to get fresh data (only if not file://)
  if (!isFileProtocol() && typeof window !== 'undefined' && localStorage.getItem('spot_api_cache')) {
    localStorage.removeItem('spot_api_cache');
  }
  
  // Show reset feedback
  const button = elements.resetSpotBtn[metalKey];
  if (button) {
    const originalText = button.textContent;
    button.textContent = '🔄 Reset';
    button.style.background = 'var(--primary, #2563eb)';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 2000);
  }
  
  console.log(`🔄 Reset ${metalConfig.name} spot price`);
  
  // Refresh all spot prices to get fresh data
  fetchSpotPrice();
};

/**
 * Manual refresh function for "Refresh All Prices" button
 * Works in both file:// and web server modes
 */
const refreshAllSpotPrices = async () => {
  console.log('🔄 Manual refresh of all spot prices requested');
  
  if (isFileProtocol()) {
    console.log('📁 Running from file:// - manual refresh not available');
    
    // Show informative message instead of error
    if (confirm('💡 Automatic refresh requires running from a web server.\n\nCurrently running from file:// protocol.\n\nWould you like to learn how to enable API features?')) {
      alert('🌐 To enable automatic price updates:\n\n1. Install Python (if not installed)\n2. Open terminal in your app folder\n3. Run: python -m http.server 8000\n4. Open: http://localhost:8000/app/index.html\n\nThis enables API integration while keeping all current functionality!');
    }
    return spotPrices;
  }
  
  // Show loading state
  Object.values(METALS).forEach(metalConfig => {
    if (elements.spotPriceDisplay && elements.spotPriceDisplay[metalConfig.key]) {
      const display = elements.spotPriceDisplay[metalConfig.key];
      display.textContent = '⏳ Loading...';
      display.style.color = 'var(--primary, #2563eb)';
    }
  });
  
  try {
    // Force fresh API fetch (if available)
    if (typeof refreshSpotPricesFromAPI === 'function') {
      await refreshSpotPricesFromAPI();
    } else {
      // Fallback to regular fetch
      await fetchSpotPrice();
    }
    
    // Show success message briefly
    setTimeout(() => {
      const refreshBtn = document.querySelector('.refresh-all-prices');
      if (refreshBtn) {
        const originalText = refreshBtn.textContent;
        refreshBtn.textContent = '✅ Updated';
        refreshBtn.style.background = 'var(--success, #059669)';
        
        setTimeout(() => {
          refreshBtn.textContent = originalText;
          refreshBtn.style.background = '';
        }, 2000);
      }
    }, 500);
    
  } catch (error) {
    console.error('❌ Failed to refresh spot prices:', error);
    
    // Show error state
    Object.values(METALS).forEach(metalConfig => {
      if (elements.spotPriceDisplay && elements.spotPriceDisplay[metalConfig.key]) {
        const display = elements.spotPriceDisplay[metalConfig.key];
        if (display.textContent === '⏳ Loading...') {
          display.textContent = 'Error';
          display.style.color = 'var(--danger, #dc2626)';
        }
      }
    });
    
    alert('❌ Unable to refresh prices from API.\n\nPlease check your internet connection or set prices manually.');
  }
};

/**
 * Get diagnostic information about spot price sources
 * Enhanced with environment detection
 * 
 * @returns {Object} Diagnostic information
 */
const getSpotPriceDiagnostics = () => {
  const isFile = isFileProtocol();
  const cached = typeof getCachedPrices === 'function' ? getCachedPrices(true) : null;
  const cacheAge = cached && typeof localStorage !== 'undefined' && localStorage.getItem('spot_api_cache') ? 
    Date.now() - JSON.parse(localStorage.getItem('spot_api_cache')).timestamp : null;
  
  const diagnostics = {
    environment: {
      protocol: typeof window !== 'undefined' ? window.location.protocol : 'unknown',
      isFile: isFile,
      canMakeApiCalls: !isFile && typeof fetch !== 'undefined',
      hasLocalStorage: typeof localStorage !== 'undefined'
    },
    currentPrices: {...(spotPrices || {})},
    sources: {},
    apiAvailable: typeof fetchSpotPricesFromAPI === 'function' && !isFile,
    hasCache: !!cached,
    cacheAge: cacheAge,
    cacheAgeMinutes: cacheAge ? Math.floor(cacheAge / 60000) : null,
    apiUrl: isFile ? 'N/A (file:// mode)' : 'https://precious-metals-vercel-api.vercel.app/api/prices',
    timestamp: new Date().toISOString(),
    recommendation: isFile ? 
      'For automatic API updates, serve from web server (python -m http.server 8000)' :
      'Automatic API updates available'
  };
  
  // Check each metal's source
  Object.values(METALS || {}).forEach(metalConfig => {
    const hasManual = typeof localStorage !== 'undefined' && localStorage.getItem(metalConfig.localStorageKey) !== null;
    const currentPrice = spotPrices[metalConfig.key];
    
    diagnostics.sources[metalConfig.key] = {
      hasManualOverride: hasManual,
      currentPrice: currentPrice,
      formattedPrice: currentPrice ? formatDollar(currentPrice) : 'N/A',
      source: hasManual ? 'manual' : (currentPrice > 0 ? 'api' : 'none')
    };
  });
  
  return diagnostics;
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.refreshAllSpotPrices = refreshAllSpotPrices;
  window.getSpotPriceDiagnostics = getSpotPriceDiagnostics;
  window.isFileProtocol = isFileProtocol;
}

// =============================================================================
