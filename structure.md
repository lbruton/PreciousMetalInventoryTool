# Precious Metals Inventory Tool - Project Structure

## Current Structure (Version 3.0.5)

```text
├── STRUCTURE.md
├── app
    ├── css
        ├── styles.css
    ├── index.html
    ├── js
        ├── charts.js            # Chart.js utilities and pie chart rendering
        ├── constants.js         # Global constants and configuration
        ├── detailsModal.js      # Analytics modal with breakdown charts
        ├── events.js            # DOM event listener setup and management
        ├── init.js              # Application bootstrap and initialization
        ├── inventory.js         # CRUD operations, calculations, and import/export
        ├── pagination.js        # Table pagination controls and logic
        ├── search.js            # Search and filtering functionality
        ├── sorting.js           # Table column sorting utilities
        ├── spot.js              # Spot price handling and history
        ├── state.js             # Global application state and DOM caching
        ├── theme.js             # Dark/light theme management
        ├── utils.js             # Utility functions, validation, and helpers
    ├── structure.md
├── docs
    ├── CHANGELOG.md             # Detailed History of Application Changes
    ├── LLM.md                   # LLM Friendly technical summary of the complete implementation
    ├── VERSIONING.md            # Versioning notes
├── index.html
├── README.md                    # Human Readable Application Summary
├── sample.csv
```

## Key Changes in Version 3.0+ Structure 

### Simplified Landing Page
- Removed version dropdown selector
- Direct navigation to application
- Fixed title showing current version
- Streamlined user experience

### Renamed Application Folder
- Changed from `3.0/` to `app/` for better long-term maintenance
- Version tracking moved inside application files
- More intuitive folder naming

### Version Management
- Version constant added to `constants.js` as `APP_VERSION = '3.0.5'`
- Application title shows current version
- Version tracking centralized in code rather than folder structure

### Modular Architecture
- JavaScript split into 13 specialized modules
- CSS externalized for better maintainability
- Clear separation of concerns
- Deferred loading for better performance

## File Purposes

### Landing Page (`index.html`)
- Entry point for users
- Theme toggle functionality
- Direct link to main application
- Download link for sample data

### Main Application (`app/index.html`)
- Full inventory management interface
- Spot price controls for all metals
- Data entry forms
- Inventory table with pagination
- Import/export functionality
- Modal dialogs for editing and analytics

### Core JavaScript Modules
- **constants.js**: Configuration, metal definitions, storage keys, version
- **state.js**: Global application state variables and DOM element caching
- **inventory.js**: CRUD operations, calculations, data management, and import/export
- **spot.js**: Spot price handling and history
- **theme.js**: Dark/light mode toggle and persistence
- **search.js**: Inventory search and filtering
- **sorting.js**: Table column sorting
- **pagination.js**: Table pagination controls
- **detailsModal.js**: Analytics modal with Chart.js pie charts
- **charts.js**: Chart.js utilities and configuration
- **events.js**: All DOM event listener setup
- **init.js**: Application bootstrap and initialization
- **utils.js**: Shared utility functions, validation, and error handling

### Styling (`css/styles.css`)
- Complete theming with CSS custom properties
- Dark and light mode support
- Responsive design for all screen sizes
- Component-based organization
- Modern CSS features and animations

This structure provides better maintainability, clearer separation of concerns, and easier version management going forward.
