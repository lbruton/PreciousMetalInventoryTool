// SEARCH FUNCTIONALITY
// =============================================================================

/**
 * Filters inventory based on current search query
 * 
 * @returns {Array} Filtered inventory items matching the search query
 */
const filterInventory = () => {
  let result = inventory;

  if (columnFilter.field) {
    const value = columnFilter.value.toLowerCase();
    result = result.filter(item => {
      const fieldVal = (item[columnFilter.field] || '').toString().toLowerCase();
      return fieldVal === value;
    });
  }

  if (!searchQuery.trim()) return result;

  const query = searchQuery.toLowerCase();
  return result.filter(item => {
    return (
      item.metal.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      item.purchaseLocation.toLowerCase().includes(query) ||
      (item.storageLocation && item.storageLocation.toLowerCase().includes(query)) ||
      (item.notes && item.notes.toLowerCase().includes(query)) ||
      item.date.includes(query) ||
      item.qty.toString().includes(query) ||
      item.weight.toString().includes(query) ||
      item.price.toString().includes(query) ||
      (item.isCollectable ? 'yes' : 'no').includes(query)
    );
  });
};

/**
 * Applies a column-specific filter and re-renders the table
 * @param {string} field - Item property to filter by
 * @param {string} value - Value to match exactly
 */
const applyColumnFilter = (field, value) => {
  if (columnFilter.field === field && columnFilter.value === value) {
    columnFilter = { field: null, value: null };
  } else {
    columnFilter = { field, value };
  }
  searchQuery = '';
  if (elements.searchInput) elements.searchInput.value = '';
  currentPage = 1;
  renderTable();
};

// =============================================================================
