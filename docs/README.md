# Precious Metals Inventory Tool v3.0.1

The Precious Metals Inventory Tool is a comprehensive client-side web application for tracking precious metal investments. It's designed to help users manage their silver, gold, platinum, and palladium holdings with detailed financial metrics.

## Key Features

- **Multi-Metal Support**: Track Silver, Gold, Platinum, and Palladium investments
- **Comprehensive Calculations**: Automatic calculation of premiums, profits/losses, and averages
- **Collectable Item Support**: Special handling for collectible items with numismatic value
- **Dark/Light Theme**: Toggle between dark and light themes for optimal viewing
- **Import/Export**: Support for CSV, JSON, Excel, PDF, and HTML formats
- **Advanced Search**: Search and filter inventory by multiple criteria
- **Data Visualization**: Interactive pie charts for inventory breakdown analysis
- **Responsive Design**: Optimized for desktop and mobile devices
- **Local Storage**: All data stored locally in browser - no server required

## Installation

1. Clone or download this repository
2. Open `app/index.html` in a web browser
3. Click "Accept and Continue" to access the application

## Version Management

This application uses a dynamic version management system. The version is automatically updated throughout the application from `app/js/app/js/constants.js`. The HTML files now use this dynamic system instead of hardcoded version numbers. See [docs/VERSIONING.md](docs/VERSIONING.md) for details on how to update versions.

## Version History

See [changelog.md](changelog.md) for detailed version history and planned features.

## Code Quality

This project maintains high code quality standards with:
- Comprehensive JSDoc-style comments throughout all JavaScript modules
- Detailed HTML section comments explaining functionality
- Well-organized CSS with extensive documentation
- Modular architecture with clear separation of concerns
- LLM-friendly documentation for easy understanding and extension

## Data Privacy

All data is stored locally in your browser using localStorage. No data is transmitted to any external servers. Your information remains completely private.

## License

This project is open source and available for personal use.

## Developer Guide

This section provides an overview of the application's internal structure, intended for developers contributing to the Precious Metals Inventory Tool.

### Project Overview

The Precious Metals Inventory Tool is a client-side web application for managing silver, gold, platinum, and palladium investments. It includes features like:

- Real-time spot price handling
- Import/export (CSV, Excel, PDF, HTML)
- Theme support (light/dark)
- Inventory analytics
- Modal-based detail views
- Pagination and search functionality

### Project Structure

```
├── STRUCTURE.md
├── app
    ├── css
        ├── styles.css
    ├── index.html
    ├── js
        ├── charts.js
        ├── constants.js
        ├── detailsModal.js
        ├── events.js
        ├── init.js
        ├── inventory.js
        ├── pagination.js
        ├── search.js
        ├── sorting.js
        ├── spot.js
        ├── state.js
        ├── theme.js
        ├── utils.js
    ├── structure.md
├── docs
    ├── CHANGELOG.md
    ├── LLM.md
    ├── README.md
    ├── SOURCES.md
    ├── VERSIONING.md
├── index.html
├── sample.csv
```

### Contribution Tips

- Keep logic modular: each file serves a single responsibility.
- Follow accessibility and semantic HTML best practices.
- Always sanitize user input (especially when manipulating DOM).
- Style changes should respect dark/light mode behavior.

---

For questions or feedback, contact the project maintainer or open an issue in the GitHub repository.

### Architecture Overview

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

### Data Structure

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

### Modular Design Pattern

The application uses a modular architecture: each file handles one aspect of the system (inventory logic, UI rendering, theme switching, etc.). This approach improves maintainability and encourages focused development.

### Key Design Principles

- **Separation of concerns**: Keep logic, style, and structure isolated.
- **Reusability**: Shared logic (e.g. formatting) lives in `utils.js`.
- **Stateless components**: Most UI updates are driven by state.js.
- **Progressive enhancement**: Core functionality works without JS-heavy frameworks.

### Global State Variables (in `state.js`)

The app uses a lightweight shared state file to centralize values like:

- `inventory` – array of all item objects
- `spotPrices` – current metal prices
- `filters` – active search/filter settings
- `pagination` – current page state

### Key Functions & Locations

- **Inventory operations**: `addItem`, `editItem`, `deleteItem` → `inventory.js`
- **Import/export (CSV, Excel, PDF)**: `handleImport`, `handleExport` → `inventory.js`
- **UI interaction handlers**: Button click events, modals → `events.js`
- **Helpers**: Format currency, clean strings, compute totals → `utils.js`

### Styling System (`app/css/styles.css`)

The stylesheet uses semantic class names and CSS variables for easy theming:

- `--primary`, `--text-primary`, `--bg-primary` for theme colors
- `.card`, `.btn`, `.table` for consistent layout/UI blocks

> Dark mode is toggled with a root class and CSS variables adapt accordingly.

### Development Workflow

#### Adding New Features
1. Write logic in a new or existing module under `js/`
2. Bind events in `events.js`
3. Update `state.js` if persistent data is needed
4. Update UI in `app/index.html` and `app/css/styles.css`

#### Backwards Compatibility
Legacy browser support is deprioritized. The app is optimized for Chromium/Firefox/modern Safari.

#### Column Management
Adding a new table column requires updates to:
- HTML table
- Inventory item structure
- Import/export format
- Sorting and filtering logic

### Common Development Tasks

#### Add a New Metal Type
1. Add to dropdown in `app/index.html`
2. Update metal constants in `app/js/constants.js`
3. Update logic in `charts.js` and `inventory.js`
4. Add new color tokens in `app/css/styles.css`

#### Add New Table Columns
Update HTML, JS (`inventory.js`, `search.js`, `export`), and styling.

#### Modify UI Components
All interactive components are plain HTML+JS. Use semantic HTML and test across screen sizes.

#### Version Management
Versioning follows `MAJOR.MINOR.PATCH` format, documented in `docs/VERSIONING.md`.

### Critical Considerations

- **Data Integrity**: CSV imports must follow the expected schema.
- **Performance**: Avoid large DOM redraws; only update changed elements.
- **User Experience**: Keep the UI intuitive. Use modals sparingly.
- **File Dependencies**: This is a standalone app. No external JS frameworks required.

### Quick Start Commands

No build tools required.

```bash
# Launch locally
open app/index.html
```

### Pro Tips

- Use the browser console to inspect state: `console.log(state)`
- Customize themes by modifying `app/css/styles.css` variables
- Test with the provided `sample.csv` to validate import