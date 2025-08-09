// API INTEGRATION FUNCTIONS
// =============================================================================

// Track provider connection status for settings UI
const providerStatuses = {
  METALS_DEV: "disconnected",
  METALS_API: "disconnected",
  METAL_PRICE_API: "disconnected",
  CUSTOM: "disconnected",
};

/**
 * Loads API configuration from localStorage
 * @returns {Object|null} API configuration or null if not set
 */
const loadApiConfig = () => {
  try {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (stored) {
      const config = JSON.parse(stored);
      if (config.keys) {
        Object.keys(config.keys).forEach((p) => {
          if (config.keys[p]) {
            config.keys[p] = atob(config.keys[p]);
          }
        });
      } else if (config.apiKey && config.provider) {
        // Legacy format migration
        config.keys = { [config.provider]: atob(config.apiKey) };
      }
      return {
        provider: config.provider || "",
        keys: config.keys || {},
        cacheHours:
          typeof config.cacheHours === "number" ? config.cacheHours : 24,
        custom: {
          baseUrl: config.custom?.baseUrl || "",
          endpoint: config.custom?.endpoint || "",
          metalFormat: config.custom?.metalFormat || "word",
        },
      };
    }
  } catch (error) {
    console.error("Error loading API config:", error);
  }
  return {
    provider: "",
    keys: {},
    cacheHours: 24,
    custom: { baseUrl: "", endpoint: "", metalFormat: "word" },
  };
};

/**
 * Saves API configuration to localStorage
 * @param {Object} config - API configuration object
 */
const saveApiConfig = (config) => {
  try {
    const configToSave = {
      provider: config.provider || "",
      keys: {},
      cacheHours:
        typeof config.cacheHours === "number" ? config.cacheHours : 24,
      custom: {
        baseUrl: config.custom?.baseUrl || "",
        endpoint: config.custom?.endpoint || "",
        metalFormat: config.custom?.metalFormat || "word",
      },
    };
    Object.keys(config.keys || {}).forEach((p) => {
      if (config.keys[p]) {
        configToSave.keys[p] = btoa(config.keys[p]);
      }
    });
    localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify(configToSave));
    apiConfig = config;
    updateSyncButtonStates();
  } catch (error) {
    console.error("Error saving API config:", error);
  }
};

/**
 * Clears API configuration
 */
const clearApiConfig = () => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
  localStorage.removeItem(API_CACHE_KEY);
  apiConfig = {
    provider: "",
    keys: {},
    cacheHours: 24,
    custom: { baseUrl: "", endpoint: "", metalFormat: "word" },
  };
  apiCache = null;
  Object.keys(providerStatuses).forEach((p) =>
    setProviderStatus(p, "disconnected"),
  );
  updateSyncButtonStates();
};

/**
 * Clears only the API cache, keeping the configuration
 */
const clearApiCache = () => {
  localStorage.removeItem(API_CACHE_KEY);
  apiCache = null;
  alert("API cache cleared. Next sync will pull fresh data from the API.");
};

/**
 * Gets cache duration in milliseconds
 * @returns {number} Cache duration
 */
const getCacheDurationMs = () => {
  const hours = apiConfig?.cacheHours ?? 24;
  return hours * 60 * 60 * 1000;
};

/**
 * Sets connection status for a provider in the settings UI
 * @param {string} provider
 * @param {"connected"|"disconnected"|"error"} status
 */
const setProviderStatus = (provider, status) => {
  providerStatuses[provider] = status;
  const block = document.querySelector(
    `.api-provider[data-provider="${provider}"] .provider-status`,
  );
  if (!block) return;
  block.classList.remove(
    "status-connected",
    "status-disconnected",
    "status-error",
  );
  block.classList.add(`status-${status}`);
  const text = block.querySelector(".status-text");
  if (text) {
    text.textContent =
      status === "connected"
        ? "Connected"
        : status === "error"
          ? "Error"
          : "Disconnected";
  }
};

/**
 * Updates default provider selection in config
 * @param {string} provider
 */
const setDefaultProvider = (provider) => {
  const config = loadApiConfig();
  config.provider = provider;
  saveApiConfig(config);
  updateSyncButtonStates();
};

/**
 * Clears stored API key for a provider
 * @param {string} provider
 */
const clearApiKey = (provider) => {
  const config = loadApiConfig();
  delete config.keys[provider];
  saveApiConfig(config);
  const input = document.getElementById(`apiKey_${provider}`);
  if (input) input.value = "";
  setProviderStatus(provider, "disconnected");
};

/**
 * Updates cache duration setting
 * @param {number} hours
 */
const setCacheDuration = (hours) => {
  const config = loadApiConfig();
  config.cacheHours = hours;
  saveApiConfig(config);
  if (hours === 0) {
    clearApiCache();
  }
};

/**
 * Refreshes display using cached data without making API calls
 * @returns {boolean} Success status
 */
const refreshFromCache = () => {
  const cache = loadApiCache();
  if (!cache || !cache.data) {
    return false;
  }

  let updatedCount = 0;
  Object.entries(cache.data).forEach(([metal, price]) => {
    const metalConfig = Object.values(METALS).find((m) => m.key === metal);
    if (metalConfig && price > 0) {
      // Save to localStorage
      localStorage.setItem(metalConfig.spotKey, price.toString());
      spotPrices[metal] = price;

      // Update display
      elements.spotPriceDisplay[metal].textContent = formatDollar(price);

      // Record in history as 'cached' to distinguish from fresh API calls
      recordSpot(
        price,
        "cached",
        metalConfig.name,
        API_PROVIDERS[cache.provider]?.name,
      );

      const ts = document.getElementById(`spotTimestamp${metalConfig.name}`);
      if (ts) {
        ts.textContent = getLastUpdateTime(metalConfig.name) || "No data";
      }

      updatedCount++;
    }
  });

  if (updatedCount > 0) {
    // Update summary calculations
    updateSummary();
    return true;
  }

  return false;
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

      const duration = getCacheDurationMs();
      if (cache.timestamp && now - cache.timestamp < duration) {
        return cache;
      } else {
        // Cache expired, remove it
        localStorage.removeItem(API_CACHE_KEY);
      }
    }
  } catch (error) {
    console.error("Error loading API cache:", error);
  }
  return null;
};

/**
 * Saves API data to cache
 * @param {Object} data - Data to cache
 */
const saveApiCache = (data, provider) => {
  try {
    const duration = getCacheDurationMs();
    if (duration === 0) {
      localStorage.removeItem(API_CACHE_KEY);
      apiCache = null;
      return;
    }
    const cacheObject = {
      timestamp: new Date().getTime(),
      data: data,
      provider,
    };
    localStorage.setItem(API_CACHE_KEY, JSON.stringify(cacheObject));
    apiCache = cacheObject;
  } catch (error) {
    console.error("Error saving API cache:", error);
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
    throw new Error("Invalid API provider");
  }

  const results = {};
  const errors = [];

  let endpoints = providerConfig.endpoints;
  let baseUrl = providerConfig.baseUrl;
  let format = "word";

  if (provider === "CUSTOM") {
    baseUrl = apiConfig?.custom?.baseUrl || "";
    const endpointTemplate = apiConfig?.custom?.endpoint || "";
    format = apiConfig?.custom?.metalFormat || "word";
    endpoints = {};
    Object.values(METALS).forEach((m) => {
      const metalParam = format === "symbol" ? METAL_SYMBOLS[m.key] : m.key;
      endpoints[m.key] = endpointTemplate
        .replace("{API_KEY}", apiKey)
        .replace("{METAL}", metalParam)
        .replace("{metal}", metalParam);
    });
  }

  // Fetch prices for each metal
  for (const [metal, endpoint] of Object.entries(endpoints)) {
    try {
      const url =
        provider === "CUSTOM"
          ? `${baseUrl}${endpoint}`
          : `${baseUrl}${endpoint.replace("{API_KEY}", apiKey)}`;

      const headers = {
        "Content-Type": "application/json",
      };

      if (provider === "METALS_DEV" && apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: headers,
        mode: "cors",
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
    throw new Error(`No valid prices retrieved. Errors: ${errors.join(", ")}`);
  }

  // If we got some results but not all, show a warning
  if (errors.length > 0) {
    console.warn("Some metals failed to fetch:", errors);
  }

  return results;
};

/**
 * Syncs spot prices from API and updates the application
 * @param {boolean} showProgress - Whether to show progress indicators
 * @param {boolean} forceSync - Whether to force sync even if cache is valid
 * @returns {Promise<boolean>} Promise resolving to success status
 */
const syncSpotPricesFromApi = async (
  showProgress = true,
  forceSync = false,
) => {
  if (
    !apiConfig ||
    !apiConfig.provider ||
    !apiConfig.keys[apiConfig.provider]
  ) {
    alert(
      "No API configuration found. Please configure an API provider first.",
    );
    return false;
  }

  // Check cache age if not forcing sync
  if (!forceSync) {
    const cache = loadApiCache();
    if (cache && cache.data && cache.timestamp) {
      const now = new Date().getTime();
      const cacheAge = now - cache.timestamp;
      const duration = getCacheDurationMs();

      if (cacheAge < duration) {
        if (showProgress) {
          const hoursAgo = Math.floor(cacheAge / (1000 * 60 * 60));
          const minutesAgo = Math.floor(cacheAge / (1000 * 60));
          const timeText =
            hoursAgo > 0
              ? `${hoursAgo} hours ago`
              : `${minutesAgo} minutes ago`;

          alert(
            `Using cached prices from ${timeText}. To pull fresh data from the API, go to the API configuration and clear the cache first.`,
          );
        }

        // Use cached data to refresh display
        return refreshFromCache();
      }
    }
  }

  if (showProgress) {
    updateSyncButtonStates(true); // Show syncing state
  }

  try {
    const spotPricesData = await fetchSpotPricesFromApi(
      apiConfig.provider,
      apiConfig.keys[apiConfig.provider],
    );

    // Update spot prices in the application
    let updatedCount = 0;
    Object.entries(spotPricesData).forEach(([metal, price]) => {
      const metalConfig = Object.values(METALS).find((m) => m.key === metal);
      if (metalConfig && price > 0) {
        // Save to localStorage
        localStorage.setItem(metalConfig.spotKey, price.toString());
        spotPrices[metal] = price;

        // Update display
        elements.spotPriceDisplay[metal].textContent = formatDollar(price);

        // Record in history
        recordSpot(
          price,
          "api",
          metalConfig.name,
          API_PROVIDERS[apiConfig.provider].name,
        );

        const ts = document.getElementById(`spotTimestamp${metalConfig.name}`);
        if (ts) {
          ts.textContent = getLastUpdateTime(metalConfig.name) || "No data";
        }

        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      // Save to cache
      saveApiCache(spotPricesData, apiConfig.provider);

      // Update summary calculations
      updateSummary();

      setProviderStatus(apiConfig.provider, "connected");

      if (showProgress) {
        alert(
          `Successfully synced ${updatedCount} metal prices from ${API_PROVIDERS[apiConfig.provider].name}`,
        );
      }

      return true;
    } else {
      setProviderStatus(apiConfig.provider, "error");
      throw new Error("No valid prices were retrieved from API");
    }
  } catch (error) {
    console.error("API sync error:", error);
    setProviderStatus(apiConfig.provider, "error");
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
      throw new Error("Invalid provider");
    }

    let url;
    const headers = {
      "Content-Type": "application/json",
    };

    if (provider === "CUSTOM") {
      const base = apiConfig?.custom?.baseUrl || "";
      const endpointTemplate = apiConfig?.custom?.endpoint || "";
      const format = apiConfig?.custom?.metalFormat || "word";
      const metalParam = format === "symbol" ? METAL_SYMBOLS.silver : "silver";
      const endpoint = endpointTemplate
        .replace("{API_KEY}", apiKey)
        .replace("{METAL}", metalParam)
        .replace("{metal}", metalParam);
      url = `${base}${endpoint}`;
    } else {
      const endpoint = providerConfig.endpoints.silver;
      url = `${providerConfig.baseUrl}${endpoint.replace("{API_KEY}", apiKey)}`;

      if (provider === "METALS_DEV" && apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }
    }

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const price = providerConfig.parseResponse(data, "silver");

    return price && price > 0;
  } catch (error) {
    console.error("API connection test failed:", error);
    return false;
  }
};

/**
 * Handles testing and syncing for a specific provider
 * @param {string} provider - Provider key
 */
const handleProviderSync = async (provider) => {
  const keyInput = document.getElementById(`apiKey_${provider}`);
  const radio = document.querySelector(
    `input[name="defaultProvider"][value="${provider}"]`,
  );
  if (!keyInput) return;

  const apiKey = keyInput.value.trim();
  if (!apiKey) {
    alert("Please enter your API key");
    return;
  }

  // Save configuration
  const config = loadApiConfig();
  config.keys[provider] = apiKey;
  if (radio && radio.checked) {
    config.provider = provider;
  }
  if (provider === "CUSTOM") {
    const baseInput = document.getElementById("apiBase_CUSTOM");
    const endpointInput = document.getElementById("apiEndpoint_CUSTOM");
    const formatSelect = document.getElementById("apiMetalFormat_CUSTOM");
    config.custom = {
      baseUrl: baseInput ? baseInput.value.trim() : "",
      endpoint: endpointInput ? endpointInput.value.trim() : "",
      metalFormat: formatSelect ? formatSelect.value : "word",
    };
  }
  config.timestamp = new Date().getTime();
  saveApiConfig(config);
  updateSyncButtonStates();
  setProviderStatus(provider, "disconnected");

  // Test connection
  const ok = await testApiConnection(provider, apiKey);
  if (!ok) {
    alert("API connection test failed.");
    setProviderStatus(provider, "error");
    return;
  }

  try {
    const data = await fetchSpotPricesFromApi(provider, apiKey);
    let updatedCount = 0;
    Object.entries(data).forEach(([metal, price]) => {
      const metalConfig = Object.values(METALS).find((m) => m.key === metal);
      if (metalConfig && price > 0) {
        localStorage.setItem(metalConfig.spotKey, price.toString());
        spotPrices[metal] = price;
        elements.spotPriceDisplay[metal].textContent = formatDollar(price);
        recordSpot(
          price,
          "api",
          metalConfig.name,
          API_PROVIDERS[provider].name,
        );
        const ts = document.getElementById(`spotTimestamp${metalConfig.name}`);
        if (ts) {
          ts.textContent = getLastUpdateTime(metalConfig.name) || "No data";
        }
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      saveApiCache(data, provider);
      updateSummary();
      setProviderStatus(provider, "connected");
      alert(
        `Successfully synced ${updatedCount} metal prices from ${API_PROVIDERS[provider].name}`,
      );
    } else {
      setProviderStatus(provider, "error");
      alert("No valid prices retrieved from API");
    }
  } catch (error) {
    console.error("API sync error:", error);
    setProviderStatus(provider, "error");
    alert("Failed to sync prices: " + error.message);
  }
};

/**
 * Updates sync button states based on API availability
 * @param {boolean} syncing - Whether sync is in progress
 */
const updateSyncButtonStates = (syncing = false) => {
  const hasApi =
    apiConfig && apiConfig.provider && apiConfig.keys[apiConfig.provider];

  Object.values(METALS).forEach((metalConfig) => {
    const syncBtn = document.getElementById(`syncBtn${metalConfig.name}`);
    if (syncBtn) {
      syncBtn.disabled = !hasApi || syncing;
      syncBtn.textContent = syncing ? "..." : "Sync";
      syncBtn.title = hasApi
        ? syncing
          ? "Syncing..."
          : "Sync from API"
        : "Configure API first";
    }
  });
};

/**
 * Updates API status display in modal
 */
/**
 * Shows settings modal and populates API fields
 */
const showSettingsModal = () => {
  const modal = document.getElementById("settingsModal");
  if (!modal) return;
  let currentConfig = loadApiConfig() || {
    provider: "",
    keys: {},
    cacheHours: 24,
    custom: { baseUrl: "", endpoint: "", metalFormat: "word" },
  };
  if (!currentConfig.provider) {
    currentConfig.provider = Object.keys(API_PROVIDERS)[0];
    saveApiConfig(currentConfig);
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  const themeValue = savedTheme ? savedTheme : "system";
  const themeRadio = document.querySelector(
    `input[name="themePreference"][value="${themeValue}"]`,
  );
  if (themeRadio) themeRadio.checked = true;

  Object.keys(API_PROVIDERS).forEach((prov) => {
    const input = document.getElementById(`apiKey_${prov}`);
    const radio = document.querySelector(
      `input[name="defaultProvider"][value="${prov}"]`,
    );
    if (input) input.value = currentConfig.keys?.[prov] || "";
    if (radio) radio.checked = currentConfig.provider === prov;
    setProviderStatus(prov, providerStatuses[prov] || "disconnected");
  });

  const baseInput = document.getElementById("apiBase_CUSTOM");
  if (baseInput) baseInput.value = currentConfig.custom?.baseUrl || "";
  const endpointInput = document.getElementById("apiEndpoint_CUSTOM");
  if (endpointInput) endpointInput.value = currentConfig.custom?.endpoint || "";
  const formatSelect = document.getElementById("apiMetalFormat_CUSTOM");
  if (formatSelect)
    formatSelect.value = currentConfig.custom?.metalFormat || "word";

  const durationSelect = document.getElementById("apiCacheDuration");
  if (durationSelect) {
    durationSelect.value = String(currentConfig.cacheHours ?? 24);
  }

  modal.style.display = "flex";
};

/**
 * Hides settings modal
 */
const hideSettingsModal = () => {
  const modal = document.getElementById("settingsModal");
  if (modal) {
    modal.style.display = "none";
  }
};

/**
 * Shows provider information modal
 * @param {string} providerKey
 */
const showProviderInfo = (providerKey) => {
  const modal = document.getElementById("apiInfoModal");
  if (!modal || !API_PROVIDERS[providerKey]) return;

  const provider = API_PROVIDERS[providerKey];
  const title = document.getElementById("apiInfoTitle");
  const body = document.getElementById("apiInfoBody");

  if (title) title.textContent = "Provider Information";
  if (body) {
    if (providerKey === "CUSTOM") {
      const cfg = loadApiConfig();
      body.innerHTML = `
        <div class="info-provider-name">Custom API</div>
        <div>Base URL: ${cfg.custom?.baseUrl || "(not set)"}</div>
        <div>Endpoint: ${cfg.custom?.endpoint || "(not set)"}</div>
        <div>Metal Format: ${cfg.custom?.metalFormat || "word"}</div>
        <div class="api-key-info">
          <div>📋 <strong>Configuration Tips:</strong></div>
          <ul>
            <li>Use {API_KEY} and {METAL} placeholders in your endpoint</li>
            <li>METAL will be replaced based on the selected metal format</li>
            <li>Ensure the API returns a numeric price in its response</li>
          </ul>
        </div>
      `;
    } else {
      body.innerHTML = `
        <div class="info-provider-name">${provider.name}</div>
        <div>Base URL: ${provider.baseUrl}</div>
        <div>Metals: Silver, Gold, Platinum, Palladium</div>
        <div class="api-key-info">
          <div>📋 <strong>API Key Management:</strong></div>
          <ul>
            <li>Visit the documentation link below to manage your API key</li>
            <li>You can view usage, reset, or regenerate your key there</li>
            <li>Keep your API key secure and never share it publicly</li>
          </ul>
        </div>
        <a class="btn info-docs-btn" href="${provider.documentation}" target="_blank" rel="noopener">
          📄 ${provider.name} Documentation & Key Management
        </a>
      `;
    }
  }

  modal.style.display = "flex";
};

/**
 * Hides provider information modal
 */
const hideProviderInfo = () => {
  const modal = document.getElementById("apiInfoModal");
  if (modal) {
    modal.style.display = "none";
  }
};

// Make modal controls available globally
window.showSettingsModal = showSettingsModal;
window.hideSettingsModal = hideSettingsModal;
window.showProviderInfo = showProviderInfo;
window.hideProviderInfo = hideProviderInfo;

window.handleProviderSync = handleProviderSync;
window.clearApiKey = clearApiKey;
window.clearApiCache = clearApiCache;
window.setDefaultProvider = setDefaultProvider;
window.setCacheDuration = setCacheDuration;

/**
 * Shows manual price input for a specific metal
 * @param {string} metal - Metal name (Silver, Gold, etc.)
 */
const showManualInput = (metal) => {
  const manualInput = document.getElementById(`manualInput${metal}`);
  if (manualInput) {
    manualInput.style.display = "block";

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
    manualInput.style.display = "none";

    // Clear the input
    const input = document.getElementById(`userSpotPrice${metal}`);
    if (input) {
      input.value = "";
    }
  }
};

/**
 * Resets spot price to default or API cached value
 * @param {string} metal - Metal name (Silver, Gold, etc.)
 */
const resetSpotPrice = (metal) => {
  const metalConfig = Object.values(METALS).find((m) => m.name === metal);
  if (!metalConfig) return;

  let resetPrice = metalConfig.defaultPrice;
  let source = "default";
  let providerName = null;

  // If we have cached API data, use that instead
  if (apiCache && apiCache.data && apiCache.data[metalConfig.key]) {
    resetPrice = apiCache.data[metalConfig.key];
    source = "api";
    providerName = API_PROVIDERS[apiCache.provider]?.name || null;
  }

  // Update price
  localStorage.setItem(metalConfig.spotKey, resetPrice.toString());
  spotPrices[metalConfig.key] = resetPrice;

  // Update display
  elements.spotPriceDisplay[metalConfig.key].textContent =
    formatDollar(resetPrice);

  // Record in history
  recordSpot(resetPrice, source, metalConfig.name, providerName);

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
    apiConfig:
      apiConfig && apiConfig.provider
        ? {
            provider: apiConfig.provider,
            providerName: API_PROVIDERS[apiConfig.provider]?.name || "Unknown",
            keyLength: apiConfig.keys[apiConfig.provider]
              ? apiConfig.keys[apiConfig.provider].length
              : 0,
            hasKey: !!apiConfig.keys[apiConfig.provider],
            timestamp: apiConfig.timestamp,
          }
        : null,
    spotPrices: { ...spotPrices },
  };

  return backupData;
};

/**
 * Downloads complete backup files including inventory and API configuration
 */
const downloadCompleteBackup = async () => {
  try {
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[T:]/g, "-");

    // 1. Create inventory CSV using existing export logic
    const inventory = loadData(LS_KEY, []);
    if (inventory.length > 0) {
      // Create CSV manually for backup instead of calling exportCsv()
      const headers = [
        "Metal",
        "Name",
        "Qty",
        "Type",
        "Weight(oz)",
        "Purchase Price",
        "Spot Price ($/oz)",
        "Premium ($/oz)",
        "Total Premium",
        "Purchase Location",
        "Storage Location",
        "Notes",
        "Date",
        "Collectable",
      ];
      const sortedInventory = [...inventory].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );

      const rows = sortedInventory.map((item) => [
        item.metal || "Silver",
        item.name,
        item.qty,
        item.type,
        parseFloat(item.weight).toFixed(4),
        formatDollar(item.price),
        item.isCollectable ? "N/A" : formatDollar(item.spotPriceAtPurchase),
        item.isCollectable ? "N/A" : formatDollar(item.premiumPerOz),
        item.isCollectable ? "N/A" : formatDollar(item.totalPremium),
        item.purchaseLocation,
        item.storageLocation || "Unknown",
        item.notes || "",
        item.date,
        item.isCollectable ? "Yes" : "No",
      ]);

      const inventoryCsv = Papa.unparse([headers, ...rows]);
      downloadFile(
        `inventory-backup-${timestamp}.csv`,
        inventoryCsv,
        "text/csv",
      );
    }

    // 2. Create spot history CSV
    const spotHistory = loadData(SPOT_HISTORY_KEY, []);
    if (spotHistory.length > 0) {
      const historyData = [
        ["Timestamp", "Metal", "Price", "Source"],
        ...spotHistory.map((entry) => [
          entry.timestamp,
          entry.metal,
          entry.spot,
          entry.source,
        ]),
      ];

      const historyCsv = Papa.unparse(historyData);
      downloadFile(
        `spot-price-history-${timestamp}.csv`,
        historyCsv,
        "text/csv",
      );
    }

    // 3. Create complete JSON backup
    const completeBackup = {
      version: APP_VERSION,
      timestamp: new Date().toISOString(),
      data: {
        inventory: inventory,
        spotHistory: spotHistory,
        spotPrices: { ...spotPrices },
        apiConfig:
          apiConfig && apiConfig.provider
            ? {
                provider: apiConfig.provider,
                providerName:
                  API_PROVIDERS[apiConfig.provider]?.name || "Unknown",
                hasKey: !!apiConfig.keys[apiConfig.provider],
                keyLength: apiConfig.keys[apiConfig.provider]
                  ? apiConfig.keys[apiConfig.provider].length
                  : 0,
                timestamp: apiConfig.timestamp,
              }
            : null,
      },
    };

    const backupJson = JSON.stringify(completeBackup, null, 2);
    downloadFile(
      `complete-backup-${timestamp}.json`,
      backupJson,
      "application/json",
    );

    // 4. Create API documentation and restoration guide
    const backupData = createBackupData();
    const apiInfo = `# Precious Metals Tool - Complete Backup

Generated: ${new Date().toLocaleString()}
Application Version: ${APP_VERSION}

## Backup Contents

1. **inventory-backup-${timestamp}.csv** - Complete inventory data
2. **spot-price-history-${timestamp}.csv** - Historical spot price data
3. **complete-backup-${timestamp}.json** - Full application backup
4. **backup-info-${timestamp}.md** - This documentation file

## API Configuration
${
  backupData.apiConfig
    ? `
- Provider: ${backupData.apiConfig.providerName}
- Has API Key: ${backupData.apiConfig.hasKey}
- Key Length: ${backupData.apiConfig.keyLength} characters
- Configured: ${new Date(backupData.apiConfig.timestamp).toLocaleString()}

**⚠️ Security Note:** API keys are not included in backups for security.
After restoring, reconfigure your API key in the API settings.

### API Key Management
${
  API_PROVIDERS[apiConfig?.provider]
    ? `
**${API_PROVIDERS[apiConfig.provider].name}**
- Documentation: ${API_PROVIDERS[apiConfig.provider].documentation}
- If you need to reset your API key, visit the documentation link above
`
    : ""
}
`
    : "No API configuration found."
}

## Current Data Summary
- Inventory Items: ${inventory.length}
- Spot Price History: ${spotHistory.length} entries
- Silver Price: ${spotPrices.silver || "Not set"}
- Gold Price: ${spotPrices.gold || "Not set"}
- Platinum Price: ${spotPrices.platinum || "Not set"}
- Palladium Price: ${spotPrices.palladium || "Not set"}

## Restoration Instructions

1. Import **inventory-backup-${timestamp}.csv** using the CSV import feature
2. Reconfigure API settings if needed (keys not backed up for security)
3. Use **complete-backup-${timestamp}.json** for full data restoration if needed

*This backup was created by Precious Metals Inventory Tool v${APP_VERSION}*
`;

    downloadFile(`backup-info-${timestamp}.md`, apiInfo, "text/markdown");

    alert(
      `Complete backup created! Downloaded files:\n\n✓ Inventory CSV (${inventory.length} items)\n✓ Spot price history (${spotHistory.length} entries)\n✓ Complete JSON backup\n✓ Documentation & restoration guide\n\nCheck your Downloads folder.`,
    );
  } catch (error) {
    console.error("Backup error:", error);
    alert("Error creating backup: " + error.message);
  }
};

// =============================================================================
