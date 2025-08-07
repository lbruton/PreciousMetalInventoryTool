// API INTEGRATION FUNCTIONS
// =============================================================================

/**
 * Loads API configuration from localStorage
 * @returns {Object|null} API configuration or null if not set
 */
const loadApiConfig = () => {
  try {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (stored) {
      const config = JSON.parse(stored);
      // Simple decryption (base64 decode)
      if (config.apiKey) {
        config.apiKey = atob(config.apiKey);
      }
      return config;
    }
  } catch (error) {
    console.error('Error loading API config:', error);
  }
  return null;
};

/**
 * Saves API configuration to localStorage
 * @param {Object} config - API configuration object
 */
const saveApiConfig = (config) => {
  try {
    // Simple encryption (base64 encode)
    const configToSave = { ...config };
    if (configToSave.apiKey) {
      configToSave.apiKey = btoa(configToSave.apiKey);
    }
    localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify(configToSave));
    apiConfig = config;
    updateApiStatus();
  } catch (error) {
    console.error('Error saving API config:', error);
  }
};

/**
 * Clears API configuration
 */
const clearApiConfig = () => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
  localStorage.removeItem(API_CACHE_KEY);
  apiConfig = null;
  apiCache = null;
  updateApiStatus();
  updateSyncButtonStates();
};

/**
 * Loads cached API data from localStorage
 * @returns {Object|null} Cached data or null if expired/not found
 */
const loadApiCache = () => {
  try {
    const stored = localStorage.getItem(API_CACHE_KEY);
    if (stored) {
      const cache = JSON.parse(stored);
      const now = new Date().getTime();
      
      // Check if cache is still valid (within 24 hours)
      if (cache.timestamp && (now - cache.timestamp) < API_CACHE_DURATION) {
        return cache;
      } else {
        // Cache expired, remove it
        localStorage.removeItem(API_CACHE_KEY);
      }
    }
  } catch (error) {
    console.error('Error loading API cache:', error);
  }
  return null;
};

/**
 * Saves API data to cache
 * @param {Object} data - Data to cache
 */
const saveApiCache = (data) => {
  try {
    const cacheObject = {
      timestamp: new Date().getTime(),
      data: data
    };
    localStorage.setItem(API_CACHE_KEY, JSON.stringify(cacheObject));
    apiCache = cacheObject;
    updateApiStatus();
  } catch (error) {
    console.error('Error saving API cache:', error);
  }
};

/**
 * Makes API request for spot prices
 * @param {string} provider - Provider key from API_PROVIDERS
 * @param {string} apiKey - API key
 * @returns {Promise<Object>} Promise resolving to spot prices data
 */
const fetchSpotPricesFromApi = async (provider, apiKey) => {
  const providerConfig = API_PROVIDERS[provider];
  if (!providerConfig) {
    throw new Error('Invalid API provider');
  }

  const results = {};
  const errors = [];

  // Fetch prices for each metal
  for (const [metal, endpoint] of Object.entries(providerConfig.endpoints)) {
    try {
      const url = `${providerConfig.baseUrl}${endpoint.replace('{API_KEY}', apiKey)}`;
      
      // Use different headers based on provider
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Some providers use API key in header instead of URL
      if (provider === 'METALS_DEV' && apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const price = providerConfig.parseResponse(data, metal);
      
      if (price && price > 0) {
        results[metal] = price;
      } else {
        errors.push(`${metal}: Invalid price data`);
      }
    } catch (error) {
      errors.push(`${metal}: ${error.message}`);
    }
  }

  if (Object.keys(results).length === 0) {
    throw new Error(`No valid prices retrieved. Errors: ${errors.join(', ')}`);
  }

  // If we got some results but not all, show a warning
  if (errors.length > 0) {
    console.warn('Some metals failed to fetch:', errors);
  }

  return results;
};

/**
 * Syncs spot prices from API and updates the application
 * @param {boolean} showProgress - Whether to show progress indicators
 * @returns {Promise<boolean>} Promise resolving to success status
 */
const syncSpotPricesFromApi = async (showProgress = true) => {
  if (!apiConfig || !apiConfig.provider || !apiConfig.apiKey) {
    alert('No API configuration found. Please configure an API provider first.');
    return false;
  }

  if (showProgress) {
    updateSyncButtonStates(true); // Show syncing state
  }

  try {
    const spotPricesData = await fetchSpotPricesFromApi(apiConfig.provider, apiConfig.apiKey);
    
    // Update spot prices in the application
    let updatedCount = 0;
    Object.entries(spotPricesData).forEach(([metal, price]) => {
      const metalConfig = Object.values(METALS).find(m => m.key === metal);
      if (metalConfig && price > 0) {
        // Save to localStorage
        localStorage.setItem(metalConfig.spotKey, price.toString());
        spotPrices[metal] = price;
        
        // Update display
        elements.spotPriceDisplay[metal].textContent = formatDollar(price);
        
        // Record in history
        recordSpot(price, 'api', metalConfig.name);
        
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      // Save to cache
      saveApiCache(spotPricesData);
      
      // Update summary calculations
      updateSummary();
      
      if (showProgress) {
        alert(`Successfully synced ${updatedCount} metal prices from ${API_PROVIDERS[apiConfig.provider].name}`);
      }
      
      return true;
    } else {
      throw new Error('No valid prices were retrieved from API');
    }
  } catch (error) {
    console.error('API sync error:', error);
    if (showProgress) {
      alert(`Failed to sync prices: ${error.message}`);
    }
    return false;
  } finally {
    if (showProgress) {
      updateSyncButtonStates(false); // Reset sync button states
    }
  }
};

/**
 * Tests API connection
 * @param {string} provider - Provider key
 * @param {string} apiKey - API key to test
 * @returns {Promise<boolean>} Promise resolving to connection test result
 */
const testApiConnection = async (provider, apiKey) => {
  try {
    // Just test one metal (silver) to verify connection
    const providerConfig = API_PROVIDERS[provider];
    if (!providerConfig) {
      throw new Error('Invalid provider');
    }

    const endpoint = providerConfig.endpoints.silver;
    const url = `${providerConfig.baseUrl}${endpoint.replace('{API_KEY}', apiKey)}`;
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (provider === 'METALS_DEV' && apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const price = providerConfig.parseResponse(data, 'silver');
    
    return price && price > 0;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

/**
 * Updates sync button states based on API availability
 * @param {boolean} syncing - Whether sync is in progress
 */
const updateSyncButtonStates = (syncing = false) => {
  const hasApi = apiConfig && apiConfig.provider && apiConfig.apiKey;
  
  Object.values(METALS).forEach(metalConfig => {
    const syncBtn = document.getElementById(`syncBtn${metalConfig.name}`);
    if (syncBtn) {
      syncBtn.disabled = !hasApi || syncing;
      syncBtn.textContent = syncing ? '...' : 'Sync';
      syncBtn.title = hasApi 
        ? (syncing ? 'Syncing...' : 'Sync from API') 
        : 'Configure API first';
    }
  });
};

/**
 * Updates API status display in modal
 */
const updateApiStatus = () => {
  const statusDisplay = document.getElementById('apiStatusDisplay');
  const statusText = document.getElementById('apiStatusText');
  const cacheInfo = document.getElementById('apiCacheInfo');
  
  if (!statusDisplay || !statusText) return;

  // Reset classes
  statusDisplay.className = '';
  statusDisplay.style.cssText = statusDisplay.style.cssText.replace(/background[^;]*;?/g, '');
  statusDisplay.style.cssText = statusDisplay.style.cssText.replace(/border-color[^;]*;?/g, '');

  if (apiConfig && apiConfig.provider) {
    statusText.textContent = `Connected to ${API_PROVIDERS[apiConfig.provider].name}`;
    statusDisplay.classList.add('api-status-connected');
    
    if (cacheInfo && apiCache && apiCache.timestamp) {
      const cacheAge = new Date().getTime() - apiCache.timestamp;
      const hoursAgo = Math.floor(cacheAge / (1000 * 60 * 60));
      const minutesAgo = Math.floor(cacheAge / (1000 * 60));
      
      if (hoursAgo > 0) {
        cacheInfo.textContent = `Last synced: ${hoursAgo} hours ago`;
      } else if (minutesAgo > 0) {
        cacheInfo.textContent = `Last synced: ${minutesAgo} minutes ago`;
      } else {
        cacheInfo.textContent = 'Just synced';
      }
    } else if (cacheInfo) {
      cacheInfo.textContent = 'No cached data';
    }
  } else {
    statusText.textContent = 'No API configured';
    if (cacheInfo) {
      cacheInfo.textContent = '';
    }
  }
};

/**
 * Shows API configuration modal
 */
const showApiModal = () => {
  const modal = elements.apiModal;
  if (!modal) return;

  // Load current configuration
  const currentConfig = loadApiConfig();
  
  if (currentConfig) {
    const providerSelect = document.getElementById('apiProvider');
    const apiKeyInput = document.getElementById('apiKey');
    
    if (providerSelect) providerSelect.value = currentConfig.provider || '';
    if (apiKeyInput) apiKeyInput.value = currentConfig.apiKey || '';
    
    // Update provider info
    updateProviderInfo(currentConfig.provider);
  }
  
  // Update status display
  updateApiStatus();
  
  modal.style.display = 'flex';
};

/**
 * Hides API configuration modal
 */
const hideApiModal = () => {
  const modal = elements.apiModal;
  if (modal) {
    modal.style.display = 'none';
  }
};

/**
 * Updates provider information panel in modal
 * @param {string} providerKey - Provider key
 */
const updateProviderInfo = (providerKey) => {
  const providerInfo = document.getElementById('providerInfo');
  const providerDetails = document.getElementById('providerDetails');
  const providerDocs = document.getElementById('providerDocs');
  
  if (!providerInfo || !providerDetails || !providerDocs) return;

  if (providerKey && API_PROVIDERS[providerKey]) {
    const provider = API_PROVIDERS[providerKey];
    providerInfo.style.display = 'block';
    providerDetails.innerHTML = `
      <strong>${provider.name}</strong><br>
      Base URL: ${provider.baseUrl}<br>
      Metals: Silver, Gold, Platinum, Palladium
    `;
    providerDocs.href = provider.documentation;
  } else {
    providerInfo.style.display = 'none';
  }
};

/**
 * Handles API configuration form submission
 * @param {Event} event - Form submit event
 */
const handleApiConfigSubmit = async (event) => {
  event.preventDefault();
  
  const providerSelect = document.getElementById('apiProvider');
  const apiKeyInput = document.getElementById('apiKey');
  const testConnection = document.getElementById('testConnection');
  
  if (!providerSelect || !apiKeyInput) return;

  const provider = providerSelect.value;
  const apiKey = apiKeyInput.value.trim();

  if (!provider) {
    alert('Please select an API provider');
    return;
  }

  if (!apiKey) {
    alert('Please enter your API key');
    return;
  }

  // Test connection if requested
  if (testConnection && testConnection.checked) {
    const saveBtn = document.getElementById('apiSaveBtn');
    if (saveBtn) {
      saveBtn.textContent = 'Testing...';
      saveBtn.disabled = true;
    }

    try {
      const connectionOk = await testApiConnection(provider, apiKey);
      if (!connectionOk) {
        alert('API connection test failed. Please check your API key and try again.');
        return;
      }
    } catch (error) {
      alert(`Connection test failed: ${error.message}`);
      return;
    } finally {
      if (saveBtn) {
        saveBtn.textContent = 'Save & Test';
        saveBtn.disabled = false;
      }
    }
  }

  // Save configuration
  const config = {
    provider: provider,
    apiKey: apiKey,
    timestamp: new Date().getTime()
  };

  saveApiConfig(config);
  updateSyncButtonStates();
  
  alert('API configuration saved successfully!');
  hideApiModal();
};

/**
 * Shows manual price input for a specific metal
 * @param {string} metal - Metal name (Silver, Gold, etc.)
 */
const showManualInput = (metal) => {
  const manualInput = document.getElementById(`manualInput${metal}`);
  if (manualInput) {
    manualInput.style.display = 'block';
    
    // Focus the input field
    const input = document.getElementById(`userSpotPrice${metal}`);
    if (input) {
      input.focus();
    }
  }
};

/**
 * Hides manual price input for a specific metal
 * @param {string} metal - Metal name (Silver, Gold, etc.)
 */
const hideManualInput = (metal) => {
  const manualInput = document.getElementById(`manualInput${metal}`);
  if (manualInput) {
    manualInput.style.display = 'none';
    
    // Clear the input
    const input = document.getElementById(`userSpotPrice${metal}`);
    if (input) {
      input.value = '';
    }
  }
};

/**
 * Resets spot price to default or API cached value
 * @param {string} metal - Metal name (Silver, Gold, etc.)
 */
const resetSpotPrice = (metal) => {
  const metalConfig = Object.values(METALS).find(m => m.name === metal);
  if (!metalConfig) return;

  let resetPrice = metalConfig.defaultPrice;
  let source = 'default';

  // If we have cached API data, use that instead
  if (apiCache && apiCache.data && apiCache.data[metalConfig.key]) {
    resetPrice = apiCache.data[metalConfig.key];
    source = 'api';
  }

  // Update price
  localStorage.setItem(metalConfig.spotKey, resetPrice.toString());
  spotPrices[metalConfig.key] = resetPrice;
  
  // Update display
  elements.spotPriceDisplay[metalConfig.key].textContent = formatDollar(resetPrice);
  
  // Record in history
  recordSpot(resetPrice, source, metalConfig.name);
  
  // Update summary
  updateSummary();
  
  // Hide manual input if shown
  hideManualInput(metal);
};

/**
 * Exports backup data including API configuration
 * @returns {Object} Complete backup data object
 */
const createBackupData = () => {
  const backupData = {
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
    inventory: loadData(LS_KEY, []),
    spotHistory: loadData(SPOT_HISTORY_KEY, []),
    apiConfig: apiConfig ? {
      provider: apiConfig.provider,
      providerName: API_PROVIDERS[apiConfig.provider]?.name || 'Unknown',
      keyLength: apiConfig.apiKey ? apiConfig.apiKey.length : 0,
      hasKey: !!apiConfig.apiKey,
      timestamp: apiConfig.timestamp
    } : null,
    spotPrices: { ...spotPrices }
  };

  return backupData;
};

/**
 * Downloads a complete backup as ZIP file
 */
const downloadCompleteBackup = async () => {
  try {
    // This would require a ZIP library like JSZip
    // For now, we'll create individual files
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
    
    // Create inventory CSV
    const inventory = loadData(LS_KEY, []);
    if (inventory.length > 0) {
      exportCsv(); // Use existing CSV export
    }
    
    // Create spot history CSV
    const spotHistory = loadData(SPOT_HISTORY_KEY, []);
    if (spotHistory.length > 0) {
      const historyData = [
        ['Timestamp', 'Metal', 'Price', 'Source'],
        ...spotHistory.map(entry => [
          entry.timestamp,
          entry.metal,
          entry.spot,
          entry.source
        ])
      ];
      
      const historyCsv = Papa.unparse(historyData);
      downloadFile(`spot-price-history-${timestamp}.csv`, historyCsv, 'text/csv');
    }
    
    // Create API info markdown
    const backupData = createBackupData();
    const apiInfo = `# Precious Metals API Configuration Backup
    
Generated: ${new Date().toLocaleString()}
Application Version: ${APP_VERSION}

## API Configuration
${backupData.apiConfig ? `
- Provider: ${backupData.apiConfig.providerName}
- Has API Key: ${backupData.apiConfig.hasKey}
- Key Length: ${backupData.apiConfig.keyLength} characters
- Configured: ${new Date(backupData.apiConfig.timestamp).toLocaleString()}

**Note:** API keys are not included in backups for security reasons.
You will need to reconfigure your API key after restoring from backup.
` : 'No API configuration found.'}

## Current Spot Prices
- Silver: $${spotPrices.silver || 'Not set'}
- Gold: $${spotPrices.gold || 'Not set'}
- Platinum: $${spotPrices.platinum || 'Not set'}
- Palladium: $${spotPrices.palladium || 'Not set'}

## Data Summary
- Inventory Items: ${inventory.length}
- Spot Price History: ${spotHistory.length} entries

For complete data restoration, import the CSV files back into the application.
    `;
    
    downloadFile(`api-config-${timestamp}.md`, apiInfo, 'text/markdown');
    
    alert('Backup files downloaded! Check your Downloads folder for:\n- Inventory CSV\n- Spot price history CSV\n- API configuration info (Markdown)');
    
  } catch (error) {
    console.error('Backup error:', error);
    alert('Error creating backup: ' + error.message);
  }
};

// =============================================================================
