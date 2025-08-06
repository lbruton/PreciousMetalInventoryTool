// SEARCH FUNCTIONALITY
// =============================================================================

/**
 * Filters inventory based on current search query
 * 
 * @returns {Array} Filtered inventory items matching the search query
 */
const filterInventory = () => {
  if (!searchQuery.trim()) return inventory;

  const query = searchQuery.toLowerCase();
  return inventory.filter(item => {
    return (
      item.metal.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      item.purchaseLocation.toLowerCase().includes(query) ||
      (item.storageLocation && item.storageLocation.toLowerCase().includes(query)) ||
      item.date.includes(query) ||
      item.qty.toString().includes(query) ||
      item.weight.toString().includes(query) ||
      item.price.toString().includes(query) ||
      (item.isCollectable ? 'yes' : 'no').includes(query)
    );
  });
};

// =============================================================================
