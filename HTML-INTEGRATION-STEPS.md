# 🔧 HTML Integration Updates

## Step 2: Update app/index.html

Add these **two script tags** BEFORE the existing `<script defer src="js/spot.js"></script>` line:

```html
<!-- NEW: Add these two lines BEFORE the existing spot.js script -->
<script defer src="js/spot-api.js"></script>
<script defer src="js/spot-enhanced.js"></script>

<!-- EXISTING: Keep your existing scripts in the same order -->
<script defer src="js/constants.js"></script>
<script defer src="js/state.js"></script>
<script defer src="js/utils.js"></script>
<script defer src="js/charts.js"></script>
<script defer src="js/theme.js"></script>
<script defer src="js/search.js"></script>
<script defer src="js/sorting.js"></script>
<script defer src="js/pagination.js"></script>
<script defer src="js/detailsModal.js"></script>
<script defer src="js/spot.js"></script>  <!-- This gets enhanced by our new files -->
<script defer src="js/inventory.js"></script>
<script defer src="js/events.js"></script>
<script defer src="js/init.js"></script>
```

## Step 3: Add Refresh Button (Optional)

Add this button anywhere in your spot prices section:

```html
<!-- Add this in your spot prices section, after the existing spot price controls -->
<div style="text-align: center; margin: 1rem 0;">
  <button class="btn refresh-all-prices" onclick="refreshAllSpotPrices()" title="Refresh prices from API (web server mode only)">
    🔄 Refresh All Prices
  </button>
</div>
```

## Complete Script Loading Order:

The final script loading order should be:

1. `constants.js` - Configuration and version
2. `state.js` - Global state and DOM elements  
3. `utils.js` - Utility functions
4. `charts.js` - Chart functionality
5. `theme.js` - Theme management
6. `search.js` - Search functionality  
7. `sorting.js` - Table sorting
8. `pagination.js` - Pagination controls
9. `detailsModal.js` - Modal functionality
10. **`spot-api.js`** - **NEW: API integration layer**
11. **`spot-enhanced.js`** - **NEW: Enhanced spot functions**
12. `spot.js` - Original spot price functions (now enhanced)
13. `inventory.js` - Inventory management  
14. `events.js` - Event listeners
15. `init.js` - Application initialization

This order ensures that:
- ✅ All dependencies are loaded first
- ✅ API integration loads before spot.js 
- ✅ Enhanced functions override original ones
- ✅ Everything works in both file:// and web server modes
