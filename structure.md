# Precious Metals Inventory Tool - Project Structure

## Current Structure (Version 3.0.3)

```text
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
- Version constant added to `constants.js` as `APP_VERSION = '3.0.1'`
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
- **state.js**: Global application state variables
- **inventory.js**: CRUD operations, calculations, data management
- **spot.js**: Spot price handling and history
- **theme.js**: Dark/light mode toggle and persistence
- **search.js**: Inventory search and filtering
- **sorting.js**: Table column sorting
- **pagination.js**: Table pagination controls
- **detailsModal.js**: Analytics modal with Chart.js pie charts
- **charts.js**: Chart.js utilities and configuration
- **importExport.js**: CSV, JSON, Excel, PDF, HTML import/export
- **events.js**: All DOM event listener setup
- **init.js**: Application bootstrap and initialization
- **utils.js**: Shared utility functions

### Styling (`css/styles.css`)
- Complete theming with CSS custom properties
- Dark and light mode support
- Responsive design for all screen sizes
- Component-based organization
- Modern CSS features and animations

This structure provides better maintainability, clearer separation of concerns, and easier version management going forward.
