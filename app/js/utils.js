// UTILITY FUNCTIONS
/**
 * Returns formatted version string
 * 
 * @param {string} [prefix='v'] - Prefix to add before version
 * @returns {string} Formatted version string (e.g., "v3.0.1")
 */
const getVersionString = (prefix = 'v') => `${prefix}${APP_VERSION}`;

/**
 * Returns full application title with version
 * 
 * @param {string} [baseTitle='Precious Metals Inventory Tool'] - Base application title
 * @returns {string} Full title with version
 */
const getAppTitle = (baseTitle = 'Precious Metals Inventory Tool') => `${baseTitle} ${getVersionString()}`;

// =============================================================================

/**
 * Pads a number with leading zeros to ensure two-digit format
 * 
 * @param {number} n - Number to pad
 * @returns {string} Two-digit string representation
 * @example pad2(5) returns "05", pad2(12) returns "12"
 */
const pad2 = n => n.toString().padStart(2, '0');

/**
 * Returns current date as ISO string (YYYY-MM-DD)
 * 
 * @returns {string} Current date in ISO format
 */
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
};

/**
 * Parses various date formats into standard YYYY-MM-DD format
 * 
 * Handles:
 * - ISO format (YYYY-MM-DD)
 * - US format (MM/DD/YYYY)
 * - European format (DD/MM/YYYY)
 * - Year-first format (YYYY/MM/DD)
 * 
 * @param {string} dateStr - Date string in any supported format
 * @returns {string} Date in YYYY-MM-DD format, or today's date if parsing fails
 */
function parseDate(dateStr) {
  if (!dateStr) return todayStr();

  // Try ISO format (YYYY-MM-DD) first
  let date = new Date(dateStr);
  if (!isNaN(date) && date.toString() !== 'Invalid Date') {
    return date.toISOString().split('T')[0];
  }

  // Try common US format MM/DD/YYYY
  const usMatch = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (usMatch) {
    const month = parseInt(usMatch[1], 10) - 1;
    const day = parseInt(usMatch[2], 10);
    const year = parseInt(usMatch[3], 10);

    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      date = new Date(year, month, day);
      if (!isNaN(date) && date.toString() !== 'Invalid Date') {
        return date.toISOString().split('T')[0];
      }
    }
  }

  // Try common European format DD/MM/YYYY
  const euMatch = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (euMatch) {
    const day = parseInt(euMatch[1], 10);
    const month = parseInt(euMatch[2], 10) - 1;
    const year = parseInt(euMatch[3], 10);

    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      date = new Date(year, month, day);
      if (!isNaN(date) && date.toString() !== 'Invalid Date') {
        return date.toISOString().split('T')[0];
      }
    }
  }

  // Try YYYY/MM/DD format
  const ymdMatch = dateStr.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);

    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      date = new Date(year, month, day);
      if (!isNaN(date) && date.toString() !== 'Invalid Date') {
        return date.toISOString().split('T')[0];
      }
    }
  }

  // If all parsing fails, return today's date
  return todayStr();
}

/**
 * Formats a number as a dollar amount with two decimal places
 * 
 * @param {number|string} n - Number to format
 * @returns {string} Formatted dollar string (e.g., "$1,234.56")
 */
const formatDollar = n => `$${parseFloat(n).toFixed(2)}`;

/**
 * Formats a profit/loss value with color coding
 * 
 * @param {number} value - Profit/loss value
 * @returns {string} HTML string with appropriate color styling
 */
const formatLossProfit = (value) => {
  const formatted = formatDollar(value);
  if (value > 0) {
    return `<span style="color: var(--success);">${formatted}</span>`;
  } else if (value < 0) {
    return `<span style="color: var(--danger);">${formatted}</span>`;
  }
  return formatted;
};

/**
 * Saves data to localStorage with JSON serialization
 * 
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 */
const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

/**
 * Loads data from localStorage with error handling
 * 
 * @param {string} key - Storage key
 * @param {any} [defaultValue=[]] - Default value if no data found
 * @returns {any} Parsed data or default value
 */
const loadData = (key, defaultValue = []) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

/**
 * Sorts inventory by date (newest first)
 * 
 * @param {Array} [data=inventory] - Data to sort
 * @returns {Array} Sorted inventory data
 */
const sortInventoryByDateNewestFirst = (data = inventory) => {
  return [...data].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // Descending order (newest first)
  });
};

// =============================================================================
