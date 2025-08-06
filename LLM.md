# LLM Development Guide - Precious Metals Inventory Tool

## 🎯 Project Context Prompt

You are working on the **Precious Metals Inventory Tool v3.0.2+**, a comprehensive client-side web application for tracking precious metal investments. This tool helps users manage their gold, silver, platinum, and palladium inventory with detailed analytics, import/export capabilities, and storage location tracking.

## 📁 Project Structure

```
PreciousMetalInventoryTool/
├── app/                          # Main application directory
│   ├── index.html               # Primary application interface
│   ├── css/
│   │   └── styles.css           # Complete application styling
│   └── js/                      # Modular JavaScript architecture
│       ├── constants.js         # App version, storage keys, metal configs
│       ├── state.js            # Global state variables and DOM references
│       ├── utils.js            # Utility functions, formatters, date handling
│       ├── inventory.js        # Core inventory CRUD operations
│       ├── events.js           # Event listeners and user interactions
│       ├── sorting.js          # Table sorting functionality
│       ├── search.js           # Search and filtering logic
│       ├── pagination.js       # Table pagination controls
│       ├── spot.js            # Spot price management
│       ├── theme.js           # Dark/light mode theme switching
│       ├── charts.js          # Chart.js integration for analytics
│       ├── detailsModal.js    # Details modal with breakdowns
│       └── init.js            # Application initialization
├── index.html                   # Landing page with version selector
├── sample.csv                   # Sample data for testing/import
├── changelog.md                 # Version history and feature tracking
└── structure.md                 # Project documentation
```

## 🏗️ Architecture Overview

### **Modular Design Pattern**
- **Separation of Concerns**: Each JS file handles specific functionality
- **Global State**: Managed in `state.js` with DOM element caching
- **Event-Driven**: User interactions handled in `events.js`
- **Data-Driven**: All data stored in localStorage, no server dependencies

### **Key Design Principles**
- **Backwards Compatibility**: All data migrations preserve existing user data
- **Responsive Design**: Mobile-first CSS with progressive enhancement
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Performance**: Efficient DOM manipulation, deferred script loading

## 📊 Data Structure

### **Inventory Item Object**
```javascript
{
  metal: "Silver|Gold|Platinum|Palladium",
  name: "Item name/description",
  qty: 1,                          // Integer quantity
  type: "Round|Bar|Coin|Note|Other",
  weight: 1.0,                     // Weight in ounces (float)
  price: 35.99,                    // Purchase price (float)
  date: "2024-01-15",             // YYYY-MM-DD format
  purchaseLocation: "dealer.com",  // Where purchased
  storageLocation: "Home Safe",    // Where stored (v3.0.1+)
  spotPriceAtPurchase: 32.50,     // Spot price when purchased
  isCollectable: false,            // Boolean for collectible status
  premiumPerOz: 3.49,             // Premium over spot per oz
  totalPremium: 3.49               // Total premium paid
}
```

### **Global State Variables** (in `state.js`)
```javascript
let inventory = [];              // Main inventory array
let spotPrices = {silver: 0, gold: 0, platinum: 0, palladium: 0};
let sortColumn = null;           // Current sort column
let sortDirection = 'asc';       // Current sort direction
let currentPage = 1;             // Pagination state
let itemsPerPage = 25;           // Items per page
let searchQuery = '';            // Current search query
let editingIndex = null;         // Index of item being edited
```

## 🔧 Key Functions & Locations

### **Core Inventory Operations** (`inventory.js`)
- `renderTable()` - Main table rendering function, called after any data change
- `saveInventory()` - Persists inventory to localStorage
- `loadInventory()` - Loads inventory with data migration for backwards compatibility
- `updateSummary()` - Updates all total/summary displays
- `editItem(idx)` - Opens edit modal for specific item
- `deleteItem(idx)` - Deletes item after confirmation
- `toggleCollectable(idx, checkbox)` - Toggles collectable status

### **Import/Export Functions** (`inventory.js`)
- `importCsv(file)` - Imports CSV data with validation
- `importJson(file)` - Imports JSON data with validation
- `importExcel(file)` - Imports Excel files using XLSX.js
- `exportCsv()` - Exports to CSV format
- `exportJson()` - Exports to JSON format
- `exportExcel()` - Exports to Excel format
- `exportPdf()` - Exports to PDF using jsPDF
- `exportHtml()` - Exports to standalone HTML

### **UI Interaction Functions** (`events.js`)
- `setupEventListeners()` - Main event listener initialization
- `setupColumnResizing()` - Enables column resizing functionality
- Form submission handlers for add/edit operations

### **Utility Functions** (`utils.js`)
- `formatDollar(n)` - Formats numbers as currency ($1,234.56)
- `formatLossProfit(value)` - Formats profit/loss with color coding
- `parseDate(dateStr)` - Parses various date formats to YYYY-MM-DD
- `todayStr()` - Returns today's date as YYYY-MM-DD
- `getVersionString()` - Returns formatted version string
- `getAppTitle()` - Returns full app title with version

## 🎨 Styling System (`styles.css`)

### **CSS Architecture**
- **CSS Custom Properties**: Comprehensive theming system with dark/light modes
- **Component-Based**: Organized by component (tables, forms, modals, etc.)
- **Responsive Design**: Mobile-first approach with progressive breakpoints
- **Accessibility**: Focus states, proper contrast ratios, screen reader support

### **Key CSS Classes**
- `.clickable-name` - Clickable item names for editing
- `.collectable-checkbox` - Styled checkboxes for collectable status
- `.delete-cell` - Centered delete button styling
- `.resize-handle` - Column resizing functionality
- `.modal` / `.details-modal-content` - Modal styling
- `.btn` / `.btn.danger` / `.btn.premium` - Button variations

## 🔄 Development Workflow

### **Adding New Features**
1. **Update constants.js**: Increment `APP_VERSION` if needed
2. **Modify data structure**: Add new fields to inventory objects in `inventory.js`
3. **Update forms**: Modify HTML forms and validation in `events.js`
4. **Update table**: Modify `renderTable()` to display new fields
5. **Update exports**: Modify all export functions to include new fields
6. **Update imports**: Modify import functions with backwards compatibility
7. **Update CSS**: Add styling for new elements
8. **Test migrations**: Ensure old data works with new features

### **Backwards Compatibility Pattern**
```javascript
// Always provide defaults for new fields
const processedItem = {
  ...existingFields,
  newField: item.newField || 'DefaultValue', // Always provide fallback
};
```

### **Column Management**
- Table uses `table-layout: fixed` for precise column control
- Column widths defined in CSS with nth-child selectors
- Resizing handles added dynamically in `setupColumnResizing()`
- Sort functionality accounts for column index changes

## 📝 Common Development Tasks

### **Adding a New Metal Type**
1. Update `METALS` constant in `constants.js`
2. Add spot price elements in HTML
3. Update `initializeSpotPriceElements()` in `init.js`
4. Add totals cards in HTML
5. Update `updateSummary()` calculations

### **Adding Table Columns**
1. Update HTML table headers
2. Modify `renderTable()` in `inventory.js`
3. Update all export functions
4. Update import functions with backwards compatibility
5. Add column width CSS rules
6. Update sorting logic if sortable

### **Modifying UI Components**
1. Update HTML structure
2. Add/modify CSS in appropriate section
3. Update event listeners in `events.js`
4. Test responsive behavior on mobile

### **Version Management**
- Single source of truth: `APP_VERSION` in `constants.js`
- Dynamic version loading using `getVersionString()` and `getAppTitle()`
- Update changelog.md with detailed feature descriptions

## 🚨 Critical Considerations

### **Data Integrity**
- Always maintain backwards compatibility
- Provide default values for new fields
- Test data migrations thoroughly
- Never remove fields without deprecation period

### **Performance**
- DOM element caching in `state.js`
- Efficient table re-rendering
- Minimal localStorage operations
- Deferred script loading

### **User Experience**
- Maintain existing workflows
- Progressive enhancement for new features
- Consistent visual feedback
- Accessibility compliance

### **File Dependencies**
- External libraries loaded via CDN (Chart.js, jsPDF, PapaParse, XLSX)
- Module loading order critical - see `init.js` for proper sequence
- Event listeners setup only after DOM ready

## 🎯 Quick Start Commands

When working on this project:
1. **Main entry point**: `/app/index.html`
2. **Key files to understand**: `state.js`, `inventory.js`, `events.js`
3. **Add features**: Start with data structure, then UI, then persistence
4. **Test imports/exports**: Use `sample.csv` for testing
5. **Version updates**: Update `constants.js` → automatic propagation

## 💡 Pro Tips

- **Table re-renders**: Call `renderTable()` after any inventory changes
- **Event handling**: Use `setupColumnResizing()` after table re-renders
- **CSS debugging**: Use browser dev tools to test responsive breakpoints
- **Data migration**: Test with existing localStorage data before deployment
- **Performance**: Monitor DOM manipulation in large inventories (100+ items)

---

**Remember**: This is a client-side application with no backend dependencies. All data persistence uses localStorage, and all functionality should work offline. Focus on user experience, data integrity, and backwards compatibility.