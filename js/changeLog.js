/**
 * Change log tracking and rendering
 * Tracks the last 25 cell changes in the inventory table
 */

/**
 * Records a change to the change log and persists it
 * @param {string} itemName - Name of the inventory item
 * @param {string} field - Field that was changed
 * @param {any} oldValue - Previous value
 * @param {any} newValue - New value
 */
const logChange = (itemName, field, oldValue, newValue) => {
  changeLog.push({
    timestamp: Date.now(),
    itemName,
    field,
    oldValue,
    newValue,
  });
  if (changeLog.length > 25) {
    changeLog = changeLog.slice(-25);
  }
  localStorage.setItem('changeLog', JSON.stringify(changeLog));
};

/**
 * Compares two item objects and logs any differences
 * @param {Object} oldItem - Original item values
 * @param {Object} newItem - Updated item values
 */
const logItemChanges = (oldItem, newItem) => {
  const fields = [
    'date',
    'type',
    'metal',
    'name',
    'qty',
    'weight',
    'price',
    'spotPriceAtPurchase',
    'totalPremium',
    'purchaseLocation',
    'storageLocation',
    'isCollectable',
    'notes',
  ];

  fields.forEach((field) => {
    if (oldItem[field] !== newItem[field]) {
      logChange(newItem.name, field, oldItem[field], newItem[field]);
    }
  });
};

/**
 * Renders the change log table with the 10 most recent entries
 */
const renderChangeLog = () => {
  const tableBody = document.querySelector('#changeLogTable tbody');
  if (!tableBody) return;

  const recent = changeLog.slice(-10).reverse();
  const rows = recent.map((entry) => `
    <tr>
      <td class="shrink">${new Date(entry.timestamp).toLocaleString()}</td>
      <td class="shrink">${sanitizeHtml(entry.itemName)}</td>
      <td class="shrink">${sanitizeHtml(entry.field)}</td>
      <td class="shrink">${sanitizeHtml(String(entry.oldValue))}</td>
      <td class="shrink">${sanitizeHtml(String(entry.newValue))}</td>
    </tr>
  `);
  tableBody.innerHTML = rows.join('');
};

window.logChange = logChange;
window.logItemChanges = logItemChanges;
window.renderChangeLog = renderChangeLog;
