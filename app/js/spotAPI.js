# Integrating the WordPress Plugin with Precious Metal Inventory Tool

This guide explains how to integrate the Precious Metals API WordPress plugin with the main Precious Metal Inventory Tool.

## Overview

The Precious Metal Inventory Tool currently uses manually entered spot prices. This integration will allow the tool to fetch live spot prices from your WordPress site, which gets its data from the metals.dev API.

## 1. Installation Requirements

- WordPress installed on your EasyWP Namecheap hosting
- Precious Metals API plugin installed and activated on WordPress
- Precious Metal Inventory Tool files

## 2. WordPress Plugin Configuration

1. Install and activate the Precious Metals API plugin on your WordPress site
2. Navigate to **Settings > Precious Metals API**
3. Configure your metals.dev API key
4. Set an appropriate cache duration (recommended: 60 minutes)
5. Note your WordPress site URL (e.g., `https://yourdomain.com`)

## 3. Create Integration JavaScript

Create a new file in the Precious Metal Inventory Tool's js directory:

```javascript
// spotAPI.js - Connects to WordPress plugin for live metal prices

/**
 * Configuration for the WordPress spot price API
 */
const SPOT_API_CONFIG = {
    // WordPress site URL with REST API endpoint
    apiUrl: 'https://yourdomain.com/wp-json/precious-metals/v1/prices',
    
    // How often to check for updated prices (milliseconds)
    refreshInterval: 3600000, // 1 hour
    
    // Conversion between API symbols and our internal metal keys
    symbolMap: {
        'XAG': 'silver',
        'XAU': 'gold',
        'XPT': 'platinum',
        'XPD': 'palladium'
    }
};

/**
 * Fetches current spot prices from WordPress API
 * 
 * @returns {Promise} Promise that resolves with spot price data
 */
const fetchSpotPrices = async () => {
    try {
        const response = await fetch(SPOT_API_CONFIG.apiUrl);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return processApiData(data);
    } catch (error) {
        console.error('Error fetching spot prices:', error);
        return null;
    }
};

/**
 * Process API data into format expected by the application
 * 
 * @param {Object} apiData Raw data from the API
 * @returns {Object} Processed spot prices
 */
const processApiData = (apiData) => {
    const processedData = {};
    
    // Convert API data format to our application format
    Object.entries(apiData).forEach(([symbol, data]) => {
        const metalKey = SPOT_API_CONFIG.symbolMap[symbol];
        
        if (metalKey && data.price) {
            processedData[metalKey] = parseFloat(data.price);
        }
    });
    
    return processedData;
};

/**
 * Updates application spot prices from API
 * 
 * @param {boolean} forceUpdate Whether to force update regardless of cache
 * @returns {Promise<boolean>} Success status
 */
const updateSpotPricesFromApi = async (forceUpdate = false) => {
    // Check if we should update
    const lastUpdate = localStorage.getItem('spotApiLastUpdate');
    const now = Date.now();
    
    if (!forceUpdate && lastUpdate && (now - parseInt(lastUpdate) < SPOT_API_CONFIG.refreshInterval)) {
        // Skip update if within refresh interval
        return false;
    }
    
    const apiData = await fetchSpotPrices();
    
    if (!apiData) {
        return false;
    }
    
    // Update each metal spot price
    Object.entries(apiData).forEach(([metalKey, price]) => {
        const metalConfig = Object.values(METALS).find(m => m.key === metalKey);
        
        if (metalConfig) {
            // Update spot price in localStorage
            localStorage.setItem(metalConfig.localStorageKey, price);
            
            // Update display if elements exist
            if (elements.spotPriceDisplay && elements.spotPriceDisplay[metalKey]) {
                elements.spotPriceDisplay[metalKey].textContent = formatDollar(price);
            }
            
            // Record in spot history
            recordSpot(price, 'api', metalConfig.name);
            
            // Update spot price in memory
            spotPrices[metalKey] = price;
        }
    });
    
    // Save last update time
    localStorage.setItem('spotApiLastUpdate', now.toString());
    
    // Update summary if necessary
    if (typeof updateSummary === 'function') {
        updateSummary();
    }
    
    return true;
};

/**
 * Initialize the spot price API integration
 */
const initSpotApi = () => {
    // Fetch prices on startup
    updateSpotPricesFromApi();
    
    // Set up automatic refresh
    setInterval(() => {
        updateSpotPricesFromApi();
    }, SPOT_API_CONFIG.refreshInterval);
    
    // Add refresh button functionality if it exists
    const refreshButton = document.getElementById('refreshSpotPrices');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            updateSpotPricesFromApi(true);
        });
    }
};

// Export functions
window.fetchSpotPrices = fetchSpotPrices;
window.updateSpotPricesFromApi = updateSpotPricesFromApi;
