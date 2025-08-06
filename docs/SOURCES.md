> 📘 **SOURCES.md**: Internal Reference Document
> 🚫 Do not include in production or external distribution without manual review.

## Table of Contents

1. PreciousMetalInventoryTool/docs/VERSIONING.md
2. PreciousMetalInventoryTool/docs/STRUCTURE.md
3. PreciousMetalInventoryTool/app/index.html
4. PreciousMetalInventoryTool/docs/CHANGELOG.md
5. PreciousMetalInventoryTool/sample.csv
6. PreciousMetalInventoryTool/README.md
7. PreciousMetalInventoryTool/LLM.md
8. PreciousMetalInventoryTool/app/docs/structure.md
9. PreciousMetalInventoryTool/app/app/index.html
10. PreciousMetalInventoryTool/app/css/app/css/styles.css
11. PreciousMetalInventoryTool/app/js/app/js/constants.js
12. PreciousMetalInventoryTool/app/js/events.js
13. PreciousMetalInventoryTool/app/js/sorting.js
14. PreciousMetalInventoryTool/app/js/theme.js
15. PreciousMetalInventoryTool/app/js/charts.js
16. PreciousMetalInventoryTool/app/js/init.js
17. PreciousMetalInventoryTool/app/js/spot.js
18. PreciousMetalInventoryTool/app/js/detailsModal.js
19. PreciousMetalInventoryTool/app/js/pagination.js
20. PreciousMetalInventoryTool/app/js/inventory.js
21. PreciousMetalInventoryTool/app/js/state.js
22. PreciousMetalInventoryTool/app/js/utils.js
23. PreciousMetalInventoryTool/app/js/search.js

================================================================================

## 1. File: PreciousMetalInventoryTool/docs/VERSIONING.md
--------------------------------------------------------------------------------
# Dynamic Version Management System

## Overview 

The Precious Metals Inventory Tool now uses a dynamic version management system that automatically updates version numbers throughout the application from a single source of truth.

## How It Works

### Single Source of Truth
- Version is defined once in `/app/js/constants.js` as `APP_VERSION = '3.0.3'`
- This is the ONLY place you need to update the version number

### Automatic Propagation
- **Root Landing Page** (`/index.html`): JavaScript automatically updates the page title and heading
- **Main Application** (`/app/index.html`): JavaScript automatically updates the page title and heading  
- **Browser Tab Title**: Dynamically updated with current version
- **Application Header**: Shows current version in the main app interface

### Utility Functions
Two helper functions are available in `/app/js/utils.js`:
- `getVersionString(prefix)`: Returns formatted version (e.g., "v3.0.1")
- `getAppTitle(baseTitle)`: Returns full app title with version

## Updating the Version

To release a new version:

1. **Update ONLY the constants file:**
   ```javascript
   // In /app/js/constants.js
   const APP_VERSION = '3.0.3';  // Change this line only
   ```

2. **All these will automatically update:**
   - Root page title: "Lonnie's Precious Metals Tool v3.1.0"
   - Root page heading: "Lonnie's Precious Metals Tool v3.1.0"
   - App page title: "Precious Metals Inventory Tool v3.1.0"
   - App header: "Precious Metals Inventory Tool v3.1.0"

3. **Update changelog:** Add entry to `/docs/CHANGELOG.md` for documentation

## Technical Implementation

### Root Page (app/index.html)
```javascript
// Loads app/js/constants.js and utils.js
// Updates title and heading via DOM manipulation
document.title = `Lonnie's Precious Metals Tool ${getVersionString()}`;
```

### Main App (app/app/index.html)
```javascript
// In init.js - runs on DOM load
document.title = getAppTitle();
const appHeader = document.querySelector('.app-header h1');
appHeader.textContent = getAppTitle();
```

### Benefits
- **No more manual updates** in multiple HTML files
- **Consistent versioning** across the entire application
- **Reduced errors** from forgetting to update version in some places
- **Easy maintenance** - single point of change
- **Future-proof** - any new features can easily access current version

## Version Format
Use semantic versioning: `MAJOR.MINOR.PATCH`
- **MAJOR**: Breaking changes or major new features
- **MINOR**: New features that are backwards compatible  
- **PATCH**: Bug fixes and small improvements

## Example Usage in Code
```javascript
// Get just the version number
const version = APP_VERSION; // "3.0.3"

// Get formatted version string
const versionString = getVersionString(); // "v3.0.3"
const customVersion = getVersionString('version '); // "version 3.0.3"

// Get full app title
const title = getAppTitle(); // "Precious Metals Inventory Tool v3.0.3"
const customTitle = getAppTitle('My Custom Tool'); // "My Custom Tool v3.0.3"
```

This system ensures version consistency and makes maintenance much easier!



================================================================================

## 2. File: PreciousMetalInventoryTool/docs/STRUCTURE.md
--------------------------------------------------------------------------------
# Precious Metals Inventory Tool - Project Structure

## Current Structure (Version 3.0.1)

```
PreciousMetalInventoryTool/
├── app/index.html              # Landing page (simplified, no version dropdown)
├── app/                    # Main application folder (renamed from 3.0/)
│   ├── app/index.html         # Main application interface
│   ├── css/
│   │   └── app/css/styles.css     # All styling and theming
│   └── js/                # Modular JavaScript files
│       ├── app/js/constants.js   # Global constants including APP_VERSION
│       ├── state.js       # Application state management
│       ├── utils.js       # Utility functions
│       ├── charts.js      # Chart.js integration
│       ├── theme.js       # Dark/light mode management
│       ├── search.js      # Search functionality
│       ├── sorting.js     # Table sorting
│       ├── pagination.js  # Table pagination
│       ├── detailsModal.js # Analytics modal with pie charts
│       ├── spot.js        # Spot price handling
│       ├── inventory.js   # Core inventory operations
│       ├── importExport.js # Data import/export functionality
│       ├── events.js      # Event listeners
│       └── init.js        # Application initialization
├── sample.csv             # Sample data for download
├── README.md              # Project documentation
├── changelog.md           # Version history
└── .gitignore
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
- Version constant added to `app/js/constants.js` as `APP_VERSION = '3.0.1'`
- Application title shows current version
- Version tracking centralized in code rather than folder structure

### Modular Architecture
- JavaScript split into 13 specialized modules
- CSS externalized for better maintainability
- Clear separation of concerns
- Deferred loading for better performance

## File Purposes

### Landing Page (`app/index.html`)
- Entry point for users
- Theme toggle functionality
- Direct link to main application
- Download link for sample data

### Main Application (`app/app/index.html`)
- Full inventory management interface
- Spot price controls for all metals
- Data entry forms
- Inventory table with pagination
- Import/export functionality
- Modal dialogs for editing and analytics

### Core JavaScript Modules
- **app/js/constants.js**: Configuration, metal definitions, storage keys, version
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

### Styling (`css/app/css/styles.css`)
- Complete theming with CSS custom properties
- Dark and light mode support
- Responsive design for all screen sizes
- Component-based organization
- Modern CSS features and animations

This structure provides better maintainability, clearer separation of concerns, and easier version management going forward.


================================================================================

## 3. File: PreciousMetalInventoryTool/app/index.html
--------------------------------------------------------------------------------
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lonnie's Precious Metals Tool</title>
<style>
    /* CSS Custom Properties */
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --secondary: #64748b;
      --secondary-hover: #475569;
      --success: #059669;
      --warning: #d97706;
      --danger: #dc2626;

      --bg-primary: #ffffff;
      --bg-secondary: #f8fafc;
      --bg-tertiary: #f1f5f9;
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --text-muted: #94a3b8;

      --border: #e2e8f0;
      --border-hover: #cbd5e1;
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

      --radius: 8px;
      --radius-lg: 12px;
      --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    [data-theme="dark"] {
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --secondary: #6b7280;
      --secondary-hover: #9ca3af;

      --bg-primary: #0f172a;
      --bg-secondary: #1e293b;
      --bg-tertiary: #334155;
      --text-primary: #f8fafc;
      --text-secondary: #cbd5e1;
      --text-muted: #94a3b8;

      --border: #334155;
      --border-hover: #475569;
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
      --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3);
    }

    /* Reset and Base Styles */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      transition: var(--transition);
    }

    /* Theme Toggle */
    .theme-toggle {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      background: var(--bg-secondary);
      border: 2px solid var(--border);
      border-radius: 9999px;
      width: 60px;
      height: 32px;
      cursor: pointer;
      transition: var(--transition);
      box-shadow: var(--shadow-sm);
      z-index: 1000;
    }

    .theme-toggle::before {
      content: '☀️';
      position: absolute;
      top: 4px;
      left: 6px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--primary);
      transition: var(--transition);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
    }

    [data-theme="dark"] .theme-toggle::before {
      content: '🌙';
      transform: translateX(26px);
    }

    .theme-toggle:hover {
      border-color: var(--primary);
      box-shadow: var(--shadow);
    }

    /* Main Container */
    .container {
      max-width: 600px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    /* Card Styles */
    .card {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 2rem;
      box-shadow: var(--shadow);
      transition: var(--transition);
    }

    .card:hover {
      box-shadow: var(--shadow-lg);
    }

    /* Typography */
    .title {
      font-size: 2rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 1rem;
      color: var(--primary);
      background: linear-gradient(135deg, var(--primary), var(--success));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }

    .description {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      font-size: 1rem;
    }

    /* Alert/Disclaimer */
    .alert {
      background: linear-gradient(135deg, #fef2f2, #fff8f8);
      border: 1px solid #fecaca;
      border-left: 4px solid var(--danger);
      padding: 1rem;
      border-radius: var(--radius);
      margin: 1.5rem 0;
      position: relative;
      overflow: hidden;
    }

    [data-theme="dark"] .alert {
      background: linear-gradient(135deg, #2d1b1b, #1f1717);
      border-color: #991b1b;
      color: var(--text-secondary);
    }

    .alert::before {
      content: '⚠️';
      font-size: 1.2rem;
      margin-right: 0.5rem;
    }

    .alert strong {
      display: inline-flex;
      align-items: center;
      color: var(--danger);
      margin-bottom: 0.5rem;
    }

    /* Form Elements */
    .form-group {
      margin: 1.5rem 0;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--text-primary);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .form-select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid var(--border);
      border-radius: var(--radius);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 1rem;
      cursor: pointer;
      transition: var(--transition);
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 0.5rem center;
      background-repeat: no-repeat;
      background-size: 1.5em 1.5em;
      padding-right: 2.5rem;
    }

    .form-select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: var(--radius);
      font-size: 1rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: var(--transition);
      position: relative;
      overflow: hidden;
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    .btn:hover::before {
      left: 100%;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary), var(--primary-hover));
      color: white;
      box-shadow: var(--shadow-sm);
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow);
    }

    .btn-secondary {
      background: var(--bg-tertiary);
      color: var(--text-primary);
      border: 1px solid var(--border);
    }

    .btn-secondary:hover {
      background: var(--border);
      border-color: var(--border-hover);
    }

    .btn-block {
      width: 100%;
    }

    .btn + .btn {
      margin-top: 0.75rem;
    }

    /* Modal */
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 9999;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .modal-content {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      max-width: 700px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: var(--shadow-lg);
      animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .modal-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--primary);
      margin: 0;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: var(--radius);
      transition: var(--transition);
    }

    .modal-close:hover {
      color: var(--text-primary);
      background: var(--bg-tertiary);
    }

    .modal-body {
      padding: 2rem;
    }

    /* Changelog Specific Styles */
    .roadmap-section {
      background: linear-gradient(135deg, #dbeafe, #bfdbfe);
      border: 1px solid #93c5fd;
      border-left: 4px solid var(--primary);
      border-radius: var(--radius);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    [data-theme="dark"] .roadmap-section {
      background: linear-gradient(135deg, #1e3a8a, #1e40af);
      border-color: var(--primary);
    }

    .version-section {
      background: var(--bg-tertiary);
      border: 1px solid var(--border);
      border-left: 4px solid var(--success);
      border-radius: var(--radius);
      padding: 1.5rem;
      margin-bottom: 1.25rem;
    }

    .section-title {
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: var(--text-primary);
    }

    .changelog-list {
      margin: 0.5rem 0;
      padding-left: 1.25rem;
    }

    .changelog-list li {
      margin-bottom: 0.25rem;
      color: var(--text-secondary);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      body {
        padding: 1rem 0.5rem;
      }

      .theme-toggle {
        top: 1rem;
        right: 1rem;
        width: 50px;
        height: 28px;
      }

      .theme-toggle::before {
        width: 18px;
        height: 18px;
        top: 3px;
        left: 5px;
      }

      [data-theme="dark"] .theme-toggle::before {
        transform: translateX(20px);
      }

      .card {
        padding: 1.5rem;
      }

      .title {
        font-size: 1.75rem;
      }

      .modal-content {
        margin: 0.5rem;
        max-height: 95vh;
      }

      .modal-header, .modal-body {
        padding: 1.5rem;
      }
    }
  </style>
</head>
<body>
  <div class="theme-toggle" id="theme-toggle" title="Toggle theme"></div>
  
  <div class="container">
    <div class="card">
      <h1 class="title" id="page-title">Lonnie's Precious Metals Tool</h1>
      <p class="description">
        Track your precious metal investments with spot price tracking, premium calculations, and comprehensive reporting. 
        Add items to your inventory, monitor current values, and export your data in multiple formats.
      </p>
      
      <div class="alert">
        <strong>Important Notice:</strong> All data is stored locally in your browser and never transmitted to any server. Your information remains private but will be lost if you clear browser history or use private browsing mode. Use this tool at your own risk - the developer assumes no responsibility for any financial decisions made based on this application.
      </div>
      
      <a class="btn btn-primary btn-block" href="app/app/index.html" id="continue-btn">
        Accept and Continue →
      </a>
    </div>
    
    <div class="card">
      <h2 class="subtitle">Resources</h2>
      <a class="btn btn-secondary btn-block" download="sample.csv" href="sample.csv">
        📄 Download Sample Data (CSV)
      </a>

</div>
</div>

<!-- Load version from constants -->
<script src="app/js/app/js/constants.js"></script>
<script src="app/js/utils.js"></script>
<script>
  // Update version numbers once constants are loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Update page title
    document.title = `Lonnie's Precious Metals Tool ${getVersionString()}`;
    // Update page heading
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
      pageTitle.textContent = `Lonnie's Precious Metals Tool ${getVersionString()}`;
    }
  });
</script>

<script>
    // Theme Management
    const themeToggle = document.getElementById('theme-toggle');

    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    function initTheme() {
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (savedTheme) {
        setTheme(savedTheme);
      } else if (systemPrefersDark) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    }

    // Event Listeners
    themeToggle.addEventListener('click', toggleTheme);

    // System theme change listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });

    // Initialize
    initTheme();
  </script>
</body>
</html>

================================================================================

# Precious Metals Inventory Tool - Changelog

## 🚀 Roadmap (Future Versions)

*All major planned features have been implemented! The tool now includes comprehensive inventory management with storage location tracking, multi-format import/export, advanced analytics, and a modern modular architecture.*

---

## 📋 Version History

### Version 3.0.3 – Documentation Restructure (2025-08-06)
- **Moved docs** to `/docs/`
- Updated `STRUCTURE.md` & `docs/README.md`
- Fixed broken internal links
- No functional changes

### Version 3.0.2 - Enhanced Table UX
- **Clickable item names**: Item names are now clickable links to open the edit modal (removed separate Edit column)
- **Simplified collectable toggle**: Changed from toggle switch to clean checkbox in table for better space efficiency
- **Centered delete buttons**: Delete buttons are now properly centered in their cells
- **Visual edit indicators**: Clickable names show edit icon (✎) on hover/focus for better discoverability
- **Improved accessibility**: Added keyboard navigation support (Enter/Space) and ARIA labels for screen readers
- **Streamlined table**: Removed redundant Edit column, making the table more compact and easier to scan
- **Enhanced styling**: Better focus states and hover effects for improved user interaction feedback
- **Maintained functionality**: Edit modal toggle switch preserved for detailed editing experience

### Version 3.0.1 - Storage Location Tracking
- **New feature**: Added storage location field to track where each item is physically stored
- **Enhanced forms**: Updated both add and edit item forms with storage location input
- **Improved organization**: Optional storage location field with "Vault A, Safe B, etc..." placeholder guidance
- **Full table integration**: New "Storage Location" column added between "Purchase Location" and "Date"
- **Search enhancement**: Storage location now included in search functionality
- **Complete import/export support**: All formats (CSV, JSON, Excel, PDF, HTML) updated to include storage location
- **Backwards compatibility**: Existing data automatically migrated with "Unknown" default values
- **Sample data updated**: Enhanced sample.csv with realistic storage location examples
- **Sorting capability**: Storage location column fully sortable like all other columns
- **Dynamic version loading**: Version numbers now automatically load from APP_VERSION constant in app/js/constants.js
- **Single source of truth**: Only need to update version in one place (app/js/constants.js) and it propagates everywhere
- **Version utility functions**: Added `getVersionString()` and `getAppTitle()` helper functions in utils.js
- **Maintainability improvement**: Eliminates need to manually update version in multiple HTML files
- **Future-proof**: Any part of the application can now easily access and display the current version

### Version 3.0 - UI Streamlining
- **Removed spot price history UI**: Eliminated "Show Spot History" and "Clear Spot History" buttons from the interface
- **Simplified user experience**: Streamlined interface by removing spot price history viewing functionality
- **Code cleanup**: Removed associated event listeners, DOM references, and CSS styling for spot history buttons
- **Maintained data collection**: Spot price history data collection continues in background for future use
- **Preserved core functionality**: All inventory management, import/export, and analysis features remain intact
- **Added repository documentation**: Created comprehensive root-level docs/structure.md for better project navigation
- **Created migration roadmap**: Added detailed plan for transitioning to git-based version control

### Version 2.8 - Modular Overhaul
- **Major codebase refactor**: Extracted scripts into modular JS files for better separation of concerns
- **CSS modularization**: Moved styles to external `app/css/styles.css`, enabling improved maintainability and theming
- **Dark mode enhancements**: Full dark mode support via `theme.js` and CSS variables
- **Data visualization**: Integrated Chart.js for pie chart visualization of inventory
- **UI improvements**: Enhanced pagination, search, and sorting capabilities for inventory tables
- **Performance optimizations**: Improved UI structure with deferred script loading

### Version 2.7 - Details & Analytics
- Added "View Details" button on all metal summary cards
- Introduced breakdown reports by type and by purchase location
- Enhanced navigation, interface organization, and information visibility
- Core feature set and detailed inventory management preserved
- Minor updates and maintenance improvements

### Version 2.6 - Maintenance Update
- Minor bug fixes and performance improvements
- Code cleanup and optimization
- Maintained all features from version 2.5

### Version 2.5 - Multi-Metal Support Completion
- Completed full support for Platinum and Palladium metals
- Refined UI elements for all four metals
- Improved export functionality for multi-metal inventories
- Enhanced calculation consistency across all metals

### Version 2.4 - Multi-Metal Support Introduction
- **New metals added**: Support introduced for Platinum and Palladium throughout the tool
- **Expanded functionality**: All entry fields, summaries, and calculation logic expanded for four metals
- **Export enhancements**: Exported data now includes Platinum and Palladium records
- **UI updates**: Enhanced interface to integrate new metals into inventory and reporting
- **Standardization**: Price and premium breakdowns standardized for collectable/non-collectable items

### Version 2.3 - Collectables Polish
- Refined summary sections with detailed breakdowns by collectable status
- Improved edit interface for collectable items
- Added clarifying notes and tooltips for collectable functionality
- Usability and layout improvements for summary, import/export, and inventory actions

### Version 2.2 - Collectables Enhancement
- Enhanced collectable item handling with improved price breakdowns
- Added average collectable and non-collectable price per oz calculations
- Updated inventory and report tables to prominently display collectable status

### Version 2.1 - Collectables Introduction
- **New feature**: Introduced ability to mark items as "Collectable"
- **Enhanced calculations**: Added separate tracking for collectable vs non-collectable items
- **UI updates**: Modified interface to support collectable designation

### Version 2.0 - Major Update
- **Expanded tracking**: Enhanced Silver and Gold tracking with type, quantity, weight, and name fields
- **Comprehensive totals**: Added individual and combined totals with calculations for:
  - Total weight
  - Purchase price
  - Current value
  - Average price per oz
  - Premium per oz
  - Total premiums
  - Profit/loss
- **Enhanced inventory table**: Added editable and deletable entries with sorting capabilities
- **Import/Export features**: Introduced support for multiple formats:
  - CSV
  - JSON
  - Excel
  - PDF
  - HTML
- **Spot Price History**: Added tracking for historical spot price changes
- **Dark Mode**: Implemented dark/light theme toggle
- **Boating Accident**: Introduced the "Boating Accident" reset feature (data wipe)
- **Pagination**: Added pagination controls for large inventories

### Version 1.0 - Initial Release
- Basic inventory tracking for Silver and Gold
- Add items with core details:
  - Type
  - Quantity
  - Weight (oz)
  - Name
  - Purchase location
  - Purchase price
  - Date
- View totals for each metal:
  - Total item count
  - Total weight
  - Total purchase price
  - Current value
- Calculate average price per ounce
- Basic profit/loss calculations per metal
- Edit and delete functionality for inventory items
- Clean, simple interface with inventory listing and summary sections
================================================================================

## 5. File: PreciousMetalInventoryTool/sample.csv
--------------------------------------------------------------------------------
Metal,Name,Qty,Type,Weight(oz),Purchase Price,Spot Price ($/oz),Premium ($/oz),Total Premium,Purchase Location,Storage Location,Date,Collectable
Silver,2024 American Silver Eagle,1,Coin,1,43.00,32.00,11.00,11.00,apmex.com,Home Safe,2024-07-12,No
Silver,2024 Canada Maple Leaf,1,Coin,1,42.50,32.00,10.50,10.50,jmbullion.com,Bank Box A,2024-07-13,No
Silver,2023 Australia Kookaburra,1,Coin,1,44.50,32.00,12.50,12.50,herobullion.com,Vault Drawer 1,2024-07-10,No
Silver,2022 UK Britannia,1,Coin,1,41.50,32.00,9.50,9.50,monumentmetals.com,Home Safe,2024-07-14,No
Silver,2023 Silver Buffalo Round,2,Round,1,34.25,32.00,2.25,4.50,summitmetals.com,Vault Drawer 2,2024-07-08,No
Silver,2021 Niue Sonic the Hedgehog,1,Coin,1,54.00,32.00,22.00,22.00,apmex.com,Bank Box B,2024-07-05,Yes
Silver,2024 Germania Round,1,Round,1,50.00,32.00,18.00,18.00,monumentmetals.com,Closet Safe,2024-07-11,Yes
Silver,2023 Lunar Dragon Bar,1,Bar,1,48.00,32.00,16.00,16.00,apmex.com,Vault Drawer 1,2024-07-09,No
Silver,2022 Fiji Coca-Cola Bottle Cap,1,Coin,0.5,39.99,16.00,47.98,23.99,apmex.com,Display Case,2024-07-03,Yes
Silver,2022 1oz Tuvalu Black Flag The Rising Sun,1,Coin,1,65.00,32.00,33.00,33.00,apmex.com,Bank Box A,2024-07-02,Yes
Gold,2024 American Gold Eagle 1 oz,1,Coin,1,2500.00,2380.00,120.00,120.00,apmex.com,Bank Box A,2024-07-11,No
Gold,2024 Canada Maple Leaf 1/10 oz,1,Coin,0.1,265.00,238.00,270.00,27.00,herobullion.com,Home Safe,2024-07-05,No
Gold,2022 South Africa Krugerrand 1/4 oz,1,Coin,0.25,620.00,595.00,100.00,25.00,jmbullion.com,Bank Box B,2024-07-04,No
Gold,2023 Australia Kangaroo 1 oz,1,Coin,1,2480.00,2380.00,100.00,100.00,apmex.com,Bank Box A,2024-07-01,No
Gold,1 Gram PAMP Suisse Bar,1,Bar,0.03215,87.00,76.00,342.00,11.00,apmex.com,Closet Safe,2024-07-02,No
Platinum,2024 American Platinum Eagle 1 oz,1,Coin,1,1100.00,950.00,150.00,150.00,apmex.com,Bank Box B,2024-07-10,No
Platinum,2023 Canada Maple Leaf 1 oz,1,Coin,1,1095.00,950.00,145.00,145.00,apmex.com,Bank Box A,2024-07-10,No
Platinum,2022 PAMP Suisse Bar 1 oz,1,Bar,1,1080.00,950.00,130.00,130.00,monumentmetals.com,Vault Drawer 3,2024-07-12,No
Platinum,2021 Australia Platypus,1,Coin,1,1110.00,950.00,160.00,160.00,herobullion.com,Home Safe,2024-07-07,No
Palladium,2017 American Palladium Eagle 1 oz,1,Coin,1,1400.00,1170.00,230.00,230.00,jmbullion.com,Bank Box B,2024-07-08,No
Palladium,2024 Canadian Maple Leaf 1 oz,1,Coin,1,1395.00,1170.00,225.00,225.00,apmex.com,Vault Drawer 3,2024-07-09,No
Palladium,1 oz PAMP Suisse Bar,1,Bar,1,1380.00,1170.00,210.00,210.00,silvergoldbull.com,Bank Box A,2024-07-06,No
Silver,2021 10 oz Royal Canadian Mint Bar,1,Bar,10,370.00,320.00,5.00,50.00,bullionexchanges.com,Vault Drawer 4,2024-07-08,No
Silver,2024 2 oz Niue Star Wars Mandalorian,1,Coin,2,190.00,64.00,63.00,126.00,apmex.com,Display Case,2024-07-04,Yes
Gold,2024 1/20 oz Perth Mint Lunar Dragon,1,Coin,0.05,145.00,119.00,520.00,2.60,apmex.com,Display Case,2024-07-01,Yes
Platinum,2023 1/10 oz Valcambi Bar,1,Bar,0.1,130.00,95.00,350.00,3.50,apmex.com,Closet Safe,2024-07-13,No
Palladium,2023 1/2 oz Baird & Co. Bar,1,Bar,0.5,700.00,585.00,230.00,115.00,apmex.com,Home Safe,2024-07-14,No

================================================================================

## 6. File: PreciousMetalInventoryTool/README.md
--------------------------------------------------------------------------------
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


================================================================================

## 7. File: PreciousMetalInventoryTool/LLM.md
--------------------------------------------------------------------------------
# LLM Development Guide - Precious Metals Inventory Tool

## 🎯 Project Context Prompt

You are working on the **Precious Metals Inventory Tool v3.0.2+**, a comprehensive client-side web application for tracking precious metal investments. This tool helps users manage their gold, silver, platinum, and palladium inventory with detailed analytics, import/export capabilities, and storage location tracking.

## 📁 Project Structure

```
PreciousMetalInventoryTool/
├── app/                          # Main application directory
│   ├── app/index.html               # Primary application interface
│   ├── css/
│   │   └── app/css/styles.css           # Complete application styling
│   └── js/                      # Modular JavaScript architecture
│       ├── app/js/constants.js         # App version, storage keys, metal configs
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
├── app/index.html                   # Landing page with version selector
├── sample.csv                   # Sample data for testing/import
├── changelog.md                 # Version history and feature tracking
└── docs/structure.md                 # Project documentation
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

## 🎨 Styling System (`app/css/styles.css`)

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
1. **Update app/js/constants.js**: Increment `APP_VERSION` if needed
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
1. Update `METALS` constant in `app/js/constants.js`
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
- Single source of truth: `APP_VERSION` in `app/js/constants.js`
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
1. **Main entry point**: `/app/app/index.html`
2. **Key files to understand**: `state.js`, `inventory.js`, `events.js`
3. **Add features**: Start with data structure, then UI, then persistence
4. **Test imports/exports**: Use `sample.csv` for testing
5. **Version updates**: Update `app/js/constants.js` → automatic propagation

## 💡 Pro Tips

- **Table re-renders**: Call `renderTable()` after any inventory changes
- **Event handling**: Use `setupColumnResizing()` after table re-renders
- **CSS debugging**: Use browser dev tools to test responsive breakpoints
- **Data migration**: Test with existing localStorage data before deployment
- **Performance**: Monitor DOM manipulation in large inventories (100+ items)

---

**Remember**: This is a client-side application with no backend dependencies. All data persistence uses localStorage, and all functionality should work offline. Focus on user experience, data integrity, and backwards compatibility.

================================================================================

## 8. File: PreciousMetalInventoryTool/app/docs/structure.md
--------------------------------------------------------------------------------

precious_metals_inventory_tool/
├── app/index.html
├── css/
│   └── app/css/styles.css
└── js/
    ├── app/js/constants.js         # Global constants and configuration
    ├── state.js             # Application-wide state variables
    ├── utils.js             # Utility/helper functions
    ├── charts.js            # Chart.js utilities and helpers
    ├── theme.js             # Theme management (dark/light)
    ├── search.js            # Search/filtering logic
    ├── sorting.js           # Table sorting utilities
    ├── pagination.js        # Pagination controls and logic
    ├── detailsModal.js      # Detailed modal & pie‑chart logic
    ├── spot.js              # Spot‑price handling & history
    ├── inventory.js         # Inventory CRUD & calculations
    ├── events.js            # Wiring up all DOM event listeners
    └── init.js              # App bootstrap & DOMContentLoaded
```


================================================================================

## 9. File: PreciousMetalInventoryTool/app/app/index.html
--------------------------------------------------------------------------------
<!DOCTYPE html>
<!--
  Precious Metals Inventory Tool - Main Application Interface
  
  A comprehensive client-side web application for tracking precious metal investments
  including silver, gold, platinum, and palladium. Features include spot price management,
  premium calculations, collectable item handling, and multi-format data import/export.
  
  All data is stored locally using localStorage - no server required.
  Application version is managed dynamically via app/js/constants.js
-->
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1, minimum-scale=1, user-scalable=yes" name="viewport"/>
<meta content="default-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com;" http-equiv="Content-Security-Policy"/>
<!-- Title is dynamically updated by init.js using APP_VERSION constant -->
<title>Precious Metals Inventory Tool</title>
<!-- External libraries for data import/export functionality -->
<script defer="" src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script defer="" src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<script defer="" src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script defer="" src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>
<!-- Chart.js for pie charts -->
<script defer="" src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>

  <link rel="stylesheet" href="css/app/css/styles.css">
</head>
<body>
<!-- Application Header -->
<div class="app-header">
<h1>Precious Metals Inventory Tool</h1>
<div style="margin-left: auto;">
<button class="btn" id="themeToggle">Dark Mode</button>
</div>
</div>
<div class="container">
<!-- =============================================================================
         SPOT PRICES SECTION
         
         Displays current spot prices for all four supported metals and provides
         manual input controls for setting custom spot prices. Each metal has:
         - Display card showing current spot price
         - Input field for setting new spot price
         - Save and Reset buttons for price management
         
         Spot prices are used for premium calculations and profit/loss analysis
         ============================================================================= -->
<section class="spot-prices">
<div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
<!-- Silver spot price controls -->
<div class="spot-input silver">
<div class="spot-card">
<div class="spot-card-label">Current Spot Price</div>
<div class="spot-card-value" id="spotPriceDisplaySilver">$ -</div>
</div>
<label for="userSpotPriceSilver">Silver Spot Price</label>
<div class="currency-input">
<input id="userSpotPriceSilver" min="0" placeholder="Set spot $" step="0.01" type="number"/>
</div>
<div class="grid grid-2">
<button class="btn" id="saveSpotBtnSilver">Save</button>
<button class="btn" id="resetSpotBtnSilver">Reset</button>
</div>
</div>
<!-- Gold spot price controls -->
<div class="spot-input gold">
<div class="spot-card">
<div class="spot-card-label">Current Spot Price</div>
<div class="spot-card-value" id="spotPriceDisplayGold">$ -</div>
</div>
<label for="userSpotPriceGold">Gold Spot Price</label>
<div class="currency-input">
<input id="userSpotPriceGold" min="0" placeholder="Set spot $" step="0.01" type="number"/>
</div>
<div class="grid grid-2">
<button class="btn" id="saveSpotBtnGold">Save</button>
<button class="btn" id="resetSpotBtnGold">Reset</button>
</div>
</div>
<!-- Platinum spot price controls -->
<div class="spot-input platinum">
<div class="spot-card">
<div class="spot-card-label">Current Spot Price</div>
<div class="spot-card-value" id="spotPriceDisplayPlatinum">$ -</div>
</div>
<label for="userSpotPricePlatinum">Platinum Spot Price</label>
<div class="currency-input">
<input id="userSpotPricePlatinum" min="0" placeholder="Set spot $" step="0.01" type="number"/>
</div>
<div class="grid grid-2">
<button class="btn" id="saveSpotBtnPlatinum">Save</button>
<button class="btn" id="resetSpotBtnPlatinum">Reset</button>
</div>
</div>
<!-- Palladium spot price controls -->
<div class="spot-input palladium">
<div class="spot-card">
<div class="spot-card-label">Current Spot Price</div>
<div class="spot-card-value" id="spotPriceDisplayPalladium">$ -</div>
</div>
<label for="userSpotPricePalladium">Palladium Spot Price</label>
<div class="currency-input">
<input id="userSpotPricePalladium" min="0" placeholder="Set spot $" step="0.01" type="number"/>
</div>
<div class="grid grid-2">
<button class="btn" id="saveSpotBtnPalladium">Save</button>
<button class="btn" id="resetSpotBtnPalladium">Reset</button>
</div>
</div>
</div>
</section>
<!-- =============================================================================
         TOTALS SECTION
         
         Comprehensive financial summary cards for each metal type showing:
         - Total items and weight in inventory
         - Purchase price vs current value calculations
         - Average prices (overall, collectable, non-collectable)
         - Premium analysis and profit/loss calculations
         - "View Details" buttons that open analytics modals with pie charts
         
         All calculations are performed by updateSummary() in inventory.js
         Values are updated automatically when inventory changes
         ============================================================================= -->
<section class="totals-section">
<div class="totals">
<!-- Silver totals card -->
<div class="total-card silver">
<div class="total-title">Silver Totals</div>
<div class="total-group">
<div class="total-item">
<span class="total-label">Total Items:</span>
<span class="total-value" id="totalItemsSilver">0</span>
</div>
<div class="total-item">
<span class="total-label">Total Weight:</span>
<span class="total-value" id="totalWeightSilver">0.00</span> oz
            </div>
</div>
<div class="total-group">
<div class="total-item">
<span class="total-label">Purchase Price:</span>
<span class="total-value" id="totalPurchasedSilver">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Current Value:</span>
<span class="total-value" id="currentValueSilver">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Average Price (oz):</span>
<span class="total-value" id="avgPriceSilver">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Average Collectable Price (oz):</span>
<span class="total-value" id="avgCollectablePriceSilver">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Average Non-collectable Price (oz):</span>
<span class="total-value" id="avgNonCollectablePriceSilver">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Average Premium (oz):</span>
<span class="total-value" id="avgPremiumSilver">$0.00</span>
</div>
</div>
<div class="total-group">
<div class="total-item">
<span class="total-label">Total Premium Paid:</span>
<span class="total-value" id="totalPremiumSilver">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Total Loss/Profit:</span>
<span class="total-value" id="lossProfitSilver">$0.00</span>
</div>
</div>
<button class="details-btn" onclick="showDetailsModal('Silver')">View Details</button>
</div>
<!-- Gold totals card -->
<div class="total-card gold">
<div class="total-title">Gold Totals</div>
<div class="total-group">
<div class="total-item">
<span class="total-label">Total Items:</span>
<span class="total-value" id="totalItemsGold">0</span>
</div>
<div class="total-item">
<span class="total-label">Total Weight:</span>
<span class="total-value" id="totalWeightGold">0.00</span> oz
            </div>
</div>
<div class="total-group">
<div class="total-item">
<span class="total-label">Purchase Price:</span>
<span class="total-value" id="totalPurchasedGold">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Current Value:</span>
<span class="total-value" id="currentValueGold">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Average Price (oz):</span>
<span class="total-value" id="avgPriceGold">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Average Collectable Price (oz):</span>
<span class="total-value" id="avgCollectablePriceGold">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Average Non-collectable Price (oz):</span>
<span class="total-value" id="avgNonCollectablePriceGold">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Average Premium (oz):</span>
<span class="total-value" id="avgPremiumGold">$0.00</span>
</div>
</div>
<div class="total-group">
<div class="total-item">
<span class="total-label">Total Premium Paid:</span>
<span class="total-value" id="totalPremiumGold">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Total Loss/Profit:</span>
<span class="total-value" id="lossProfitGold">$0.00</span>
</div>
</div>
<button class="details-btn" onclick="showDetailsModal('Gold')">View Details</button>
</div>
<!-- Platinum totals card -->
<div class="total-card platinum">
<div class="total-title">Platinum Totals</div>
<div class="total-group">
<div class="total-item">
<span class="total-label">Total Items:</span>
<span class="total-value" id="totalItemsPlatinum">0</span>
</div>
<div class="total-item">
<span class="total-label">Total Weight:</span>
<span class="total-value" id="totalWeightPlatinum">0.00</span>
</div>
</div>
<div class="total-group">
<div class="total-item">
<span class="total-label">Purchase Price:</span>
<span class="total-value" id="totalPurchasedPlatinum">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Current Value:</span>
<span class="total-value" id="currentValuePlatinum">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Average Price (oz):</span>
<span class="total-value" id="avgPricePlatinum">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Average Collectable Price (oz):</span>
<span class="total-value" id="avgCollectablePricePlatinum">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Average Non-collectable Price (oz):</span>
<span class="total-value" id="avgNonCollectablePricePlatinum">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Average Premium (oz):</span>
<span class="total-value" id="avgPremiumPlatinum">$0.00</span>
</div>
</div>
<div class="total-group">
<div class="total-item">
<span class="total-label">Total Premium Paid:</span>
<span class="total-value" id="totalPremiumPlatinum">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Total Loss/Profit:</span>
<span class="total-value" id="lossProfitPlatinum">$0.00</span>
</div>
</div>
<button class="details-btn" onclick="showDetailsModal('Platinum')">View Details</button>
</div>
<!-- Palladium totals card -->
<div class="total-card palladium">
<div class="total-title">Palladium Totals</div>
<div class="total-group">
<div class="total-item">
<span class="total-label">Total Items:</span>
<span class="total-value" id="totalItemsPalladium">0</span>
</div>
<div class="total-item">
<span class="total-label">Total Weight:</span>
<span class="total-value" id="totalWeightPalladium">0.00</span> oz
            </div>
</div>
<div class="total-group">
<div class="total-item">
<span class="total-label">Purchase Price:</span>
<span class="total-value" id="totalPurchasedPalladium">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Current Value:</span>
<span class="total-value" id="currentValuePalladium">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Average Price (oz):</span>
<span class="total-value" id="avgPricePalladium">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Average Collectable Price (oz):</span>
<span class="total-value" id="avgCollectablePricePalladium">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Average Non-collectable Price (oz):</span>
<span class="total-value" id="avgNonCollectablePricePalladium">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Average Premium (oz):</span>
<span class="total-value" id="avgPremiumPalladium">$0.00</span>
</div>
</div>
<div class="total-group">
<div class="total-item">
<span class="total-label">Total Premium Paid:</span>
<span class="total-value" id="totalPremiumPalladium">$0.00</span>
</div>
<div class="total-item">
<span class="total-label">Total Loss/Profit:</span>
<span class="total-value" id="lossProfitPalladium">$0.00</span>
</div>
</div>
<button class="details-btn" onclick="showDetailsModal('Palladium')">View Details</button>
</div>
</div>
</section>
<!-- =============================================================================
         INVENTORY FORM SECTION
         
         Primary data entry form for adding new inventory items. Includes fields for:
         - Metal type selection (Silver, Gold, Platinum, Palladium)
         - Item details (name, type, quantity, weight)
         - Purchase information (price, location, storage location, date)
         
         Form submission is handled by events.js with validation and automatic
         premium calculation based on current spot prices
         ============================================================================= -->
<section class="form-section">
<form id="inventoryForm">
<!-- First row of form fields -->
<div class="grid grid-2">
<div>
<label for="itemMetal">Metal</label>
<select id="itemMetal">
<option value="Silver">Silver</option>
<option value="Gold">Gold</option>
<option value="Platinum">Platinum</option>
<option value="Palladium">Palladium</option>
</select>
</div>
<div>
<label for="itemType">Type</label>
<select id="itemType">
<option value="Round">Round</option>
<option value="Bar">Bar</option>
<option value="Coin">Coin</option>
<option value="Note">Note</option>
<option value="Other">Other</option>
</select>
</div>
<div>
<label for="itemQty">Quantity</label>
<input id="itemQty" min="1" required="" step="1" type="number"/>
</div>
<div>
<label for="itemWeight">Weight (oz)</label>
<input id="itemWeight" min="0.0001" required="" step="0.0001" type="number"/>
</div>
</div>
<!-- Second row of form fields -->
<div class="grid grid-2">
<div>
<label for="itemName">Name</label>
<input id="itemName" required="" type="text"/>
</div>
<div>
<label for="purchaseLocation">Purchase Location</label>
<input id="purchaseLocation" required="" type="text"/>
</div>
<div>
<label for="storageLocation">Storage Location</label>
<input id="storageLocation" type="text" placeholder="Vault A, Safe B, etc..."/>
</div>
</div>
<!-- Third row of form fields -->
<div class="grid grid-2">
<div>
<label for="itemPrice">Purchase Price ($)</label>
<div class="currency-input">
<input id="itemPrice" min="0" required="" step="0.01" type="number"/>
</div>
</div>
<div>
<label for="itemDate">Purchase Date</label>
<input id="itemDate" required="" type="date"/>
</div>
</div>
<!-- Form submission button -->
<div style="margin-top: 0.5rem;">
<button class="btn" type="submit">Add to Inventory</button>
</div>
</form>
</section>
<!-- =============================================================================
         SEARCH FUNCTIONALITY
         
         Live search interface that filters inventory table in real-time.
         Searches across all relevant fields including:
         - Metal type, name, type, purchase/storage locations, date
         - Quantity, weight, price values
         - Collectable status (yes/no)
         
         Search is case-insensitive and supports partial matches
         Implementation in search.js with filterInventory() function
         ============================================================================= -->
<section class="search-section">
<div class="search-container">
<input id="searchInput" placeholder="Search inventory by metal, name, type, purchase location, storage location, date..." type="text"/>
<button class="btn" id="clearSearchBtn">Clear</button>
</div>
<div class="search-results-info" id="searchResultsInfo"></div>
</section>
<!-- =============================================================================
         INVENTORY TABLE SECTION
         
         Main data display table showing all inventory items with:
         - Sortable columns (click headers to sort ascending/descending)
         - Clickable item names for editing (opens edit modal)
         - Collectable status checkboxes for quick toggle
         - Delete buttons with confirmation
         - Responsive design with column resizing capability
         
         Table rendering handled by renderTable() in inventory.js
         Pagination controls limit display to selected items per page
         ============================================================================= -->
<section class="table-section">
<table id="inventoryTable">
<thead>
<tr>
<th>#</th>
<th>Metal</th>
<th>Qty</th>
<th>Type</th>
<th>Name</th>
<th>Weight (oz)</th>
<th>Purchase Price ($)</th>
<th>Spot Price ($/oz)</th>
<th>Premium Paid ($/oz)</th>
<th>Total Premium Paid ($)</th>
<th>Purchase Location</th>
<th>Storage Location</th>
<th>Date</th>
<th>Collectable</th>
<th>Delete</th>
</tr>
</thead>
<tbody></tbody>
</table>
<!-- Pagination Controls -->
<section class="pagination-section">
<div class="pagination-container">
<div class="pagination-controls">
<div class="pagination-buttons">
<button class="pagination-btn" id="firstPage" title="First Page">«</button>
<button class="pagination-btn" id="prevPage" title="Previous Page">‹</button>
<div class="page-numbers" id="pageNumbers"></div>
<button class="pagination-btn" id="nextPage" title="Next Page">›</button>
<button class="pagination-btn" id="lastPage" title="Last Page">»</button>
</div>
<div class="pagination-info-controls">
<span class="pagination-info" id="paginationInfo">1 of 1</span>
<select class="pagination-select" id="itemsPerPage">
<option value="10">10</option>
<option value="15">15</option>
<option selected="" value="25">25</option>
<option value="50">50</option>
<option value="100">100</option>
</select>
</div>
</div>
</div>
</section>
</section>
<!-- =============================================================================
         IMPORT/EXPORT SECTION
         
         Comprehensive data management with support for multiple formats:
         
         IMPORT OPTIONS:
         - CSV: Standard comma-separated values with automatic field mapping
         - JSON: Native application format preserving all data
         - Excel: .xlsx and .xls files with robust parsing
         
         EXPORT OPTIONS:
         - CSV: Compatible with spreadsheet applications
         - JSON: Full data backup with metadata
         - Excel: Formatted spreadsheet with proper column types
         - PDF: Print-ready report with totals and formatting
         - HTML: Standalone web page with embedded styles
         
         All import/export functions include data validation and error handling
         Implementation in inventory.js with format-specific parsing
         ============================================================================= -->
<section class="import-export-section">
<h2>Import Options</h2>
<div class="import-section import-export-grid">
<label class="btn" id="importCsvBtn">
          Import CSV
          <input accept=".csv" hidden="" id="importCsvFile" type="file"/>
</label>
<label class="btn" id="importJsonBtn">
          Import JSON
          <input accept=".json" hidden="" id="importJsonFile" type="file"/>
</label>
<label class="btn" id="importExcelBtn">
          Import Excel
          <input accept=".xlsx,.xls" hidden="" id="importExcelFile" type="file"/>
</label>
</div>
<h2>Export Options</h2>
<div class="export-section import-export-grid">
<button class="btn" id="exportCsvBtn">Export CSV</button>
<button class="btn" id="exportJsonBtn">Export JSON</button>
<button class="btn" id="exportExcelBtn">Export Excel</button>
<button class="btn" id="exportPdfBtn">Export PDF</button>
<button class="btn" id="exportHtmlBtn">Export HTML</button>
</div>
</section>

</div>
<!-- "Boating Accident" feature -->
<section class="boating-accident-section">
<button id="boatingAccidentBtn">Boating Accident</button>
</section>
<!-- =============================================================================
       EDIT MODAL
       
       Comprehensive item editing interface that appears when:
       - User clicks on item name in table
       - Edit button is pressed (in older versions)
       
       Features:
       - All item fields editable including historical spot price
       - Collectable toggle switch with explanatory text
       - Real-time validation and premium recalculation
       - Save/Cancel actions with confirmation
       
       Modal display controlled by editItem() function in inventory.js
       Form submission handled in events.js with data validation
       ============================================================================= -->
<div class="modal" id="editModal" style="display: none;">
<div class="modal-content">
<h2 style="margin-bottom: 1rem; color: var(--primary);">Edit Inventory Item</h2>
<form id="editForm">
<!-- First row of edit form fields -->
<div class="grid grid-2">
<div>
<label for="editMetal">Metal</label>
<select id="editMetal">
<option value="Silver">Silver</option>
<option value="Gold">Gold</option>
<option value="Platinum">Platinum</option>
<option value="Palladium">Palladium</option>
</select>
</div>
<div>
<label for="editType">Type</label>
<select id="editType">
<option value="Round">Round</option>
<option value="Bar">Bar</option>
<option value="Coin">Coin</option>
<option value="Note">Note</option>
<option value="Other">Other</option>
</select>
</div>
<div>
<label for="editQty">Quantity</label>
<input id="editQty" min="1" required="" step="1" type="number"/>
</div>
<div>
<label for="editWeight">Weight (oz)</label>
<input id="editWeight" min="0.0001" required="" step="0.0001" type="number"/>
</div>
</div>
<!-- Second row of edit form fields -->
<div class="grid grid-2">
<div>
<label for="editName">Name</label>
<input id="editName" required="" type="text"/>
</div>
<div>
<label for="editPurchaseLocation">Purchase Location</label>
<input id="editPurchaseLocation" required="" type="text"/>
</div>
<div>
<label for="editStorageLocation">Storage Location</label>
<input id="editStorageLocation" type="text" placeholder="Vault A, Safe B, etc..."/>
</div>
</div>
<!-- Third row of edit form fields -->
<div class="grid grid-2">
<div>
<label for="editPrice">Purchase Price ($)</label>
<div class="currency-input">
<input id="editPrice" min="0" required="" step="0.01" type="number"/>
</div>
</div>
<div>
<label for="editDate">Purchase Date</label>
<input id="editDate" required="" type="date"/>
</div>
</div>
<!-- Special field for editing historical spot prices -->
<div class="grid grid-2">
<div>
<label for="editSpotPrice">Spot Price ($/oz)</label>
<div class="currency-input">
<input id="editSpotPrice" min="0" required="" step="0.01" type="number"/>
</div>
</div>
</div>
<!-- Collectable toggle -->
<div style="margin-top: 0.5rem;">
<label for="editCollectable">Collectable Item</label>
<label class="switch">
<input id="editCollectable" type="checkbox"/>
<span class="slider"></span>
</label>
<div class="collectable-explanation">
            Collectable items may have additional numismatic value beyond their metal content
          </div>
</div>
<!-- Form action buttons -->
<div style="margin-top: 1rem; text-align: right;">
<button class="btn" id="cancelEdit" type="button">Cancel</button>
<button class="btn premium" type="submit">Save Changes</button>
</div>
</form>
</div>
</div>
<!-- =============================================================================
       DETAILS MODAL WITH PIE CHARTS
       
       Advanced analytics modal opened from "View Details" buttons on totals cards.
       Provides in-depth analysis for selected metal including:
       
       VISUAL ANALYTICS:
       - Pie chart breakdown by item type (rounds, bars, coins, etc.)
       - Pie chart breakdown by purchase location
       - Interactive Chart.js visualizations with hover details
       
       DATA BREAKDOWNS:
       - Type details: count, weight, and value by item type
       - Location details: count, weight, and value by purchase location
       - Formatted currency and weight displays
       
       Modal implementation in detailsModal.js with Chart.js integration
       Data preparation and chart rendering handled by charts.js
       ============================================================================= -->
<div class="modal" id="detailsModal" style="display: none;">
<div class="details-modal-content">
<h2 class="details-modal-title" id="detailsModalTitle"></h2>
<!-- Pie Charts Section -->
<div class="charts-section">
<div class="chart-container">
<div class="chart-title">Breakdown by Type</div>
<div class="chart-canvas-container">
<canvas class="chart-canvas" id="typeChart"></canvas>
</div>
</div>
<div class="chart-container">
<div class="chart-title">Breakdown by Purchase Location</div>
<div class="chart-canvas-container">
<canvas class="chart-canvas" id="locationChart"></canvas>
</div>
</div>
</div>
<!-- Data Tables Section -->
<div class="details-content">
<!-- Type breakdown column -->
<div class="details-section">
<div class="details-section-title">Type Details</div>
<div class="details-breakdown" id="typeBreakdown">
<!-- Content will be populated by JavaScript -->
</div>
</div>
<!-- Location breakdown column -->
<div class="details-section">
<div class="details-section-title">Location Details</div>
<div class="details-breakdown" id="locationBreakdown">
<!-- Content will be populated by JavaScript -->
</div>
</div>
</div>
<button class="close-details-btn" onclick="closeDetailsModal()">Close</button>
</div>
</div>
<!-- =============================================================================
       JAVASCRIPT MODULE LOADING
       
       Modular architecture with proper dependency order:
       1. app/js/constants.js - Global configuration and version
       2. state.js - Application state and DOM element caching
       3. utils.js - Utility functions and formatters
       4. Feature modules - charts, theme, search, sorting, pagination, etc.
       5. Core modules - spot price management and inventory operations
       6. events.js - Event listener setup (requires all other modules)
       7. init.js - Application initialization and startup
       
       All scripts use 'defer' to ensure DOM is ready before execution
       External libraries (Chart.js, jsPDF, PapaParse, XLSX) loaded via CDN
       ============================================================================= -->

<script defer src="js/app/js/constants.js"></script>
<script defer src="js/state.js"></script>
<script defer src="js/utils.js"></script>
<script defer src="js/charts.js"></script>
<script defer src="js/theme.js"></script>
<script defer src="js/search.js"></script>
<script defer src="js/sorting.js"></script>
<script defer src="js/pagination.js"></script>
<script defer src="js/detailsModal.js"></script>
<script defer src="js/spot.js"></script>
<script defer src="js/inventory.js"></script>
<script defer src="js/events.js"></script>
<script defer src="js/init.js"></script>
</body>
</html>

================================================================================

## 10. File: PreciousMetalInventoryTool/app/css/app/css/styles.css
--------------------------------------------------------------------------------
/* =============================================================================
   CSS CUSTOM PROPERTIES - THEME SYSTEM
   Modern color system with comprehensive dark/light mode support
   ============================================================================= */

:root {
  /* Primary Colors */
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --secondary: #64748b;
  --secondary-hover: #475569;
  --success: #059669;
  --warning: #d97706;
  --danger: #dc2626;
  --danger-hover: #b91c1c;

  /* Background Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --bg-card: #ffffff;

  /* Text Colors */
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;

  /* Border & Shadow */
  --border: #e2e8f0;
  --border-hover: #cbd5e1;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

  /* Metal-specific Colors */
  --silver: #a8a8a8;
  --gold: #ffd700;
  --platinum: #e5e4e2;
  --palladium: #c0c0ee;

  /* Component Spacing */
  --radius: 8px;
  --radius-lg: 12px;
  --spacing-sm: 0.4rem;
  --spacing: 0.75rem;
  --spacing-lg: 1.25rem;
  --spacing-xl: 1.5rem;

  /* Transitions */
  --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="dark"] {
  /* Primary Colors - Dark Mode */
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --secondary: #6b7280;
  --secondary-hover: #9ca3af;

  /* Background Colors - Dark Mode */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --bg-card: #1e293b;

  /* Text Colors - Dark Mode */
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;

  /* Border & Shadow - Dark Mode */
  --border: #334155;
  --border-hover: #475569;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3);
}

/* =============================================================================
   BASE STYLES & RESET
   ============================================================================= */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
}

body {
  max-width: 2000px;
  margin: var(--spacing-lg) auto;
  padding: var(--spacing);
  transition: var(--transition);
}

/* =============================================================================
   TYPOGRAPHY
   ============================================================================= */

h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: var(--spacing);
  letter-spacing: -0.025em;
}

h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
  font-size: 0.875rem;
}

/* =============================================================================
   LAYOUT COMPONENTS
   ============================================================================= */

.app-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  width: 100%;
  padding: var(--spacing);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.container {
  display: grid;
  gap: var(--spacing-xl);
}

section {
  background: var(--bg-card);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  transition: var(--transition);
}

section:hover {
  box-shadow: var(--shadow-lg);
}

.grid {
  display: grid;
  gap: var(--spacing);
}

.grid-2 {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* =============================================================================
   FORM ELEMENTS
   ============================================================================= */

form {
  display: grid;
  gap: var(--spacing);
}

input, select, button {
  font-family: inherit;
  font-size: 1rem;
  transition: var(--transition);
}

input, select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-primary);
  color: var(--text-primary);
}

input:focus, select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.currency-input {
  position: relative;
}

.currency-input input {
  padding-left: 2rem;
}

.currency-input::before {
  content: "$";
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-weight: 500;
  pointer-events: none;
  z-index: 1;
}

/* =============================================================================
   BUTTONS
   ============================================================================= */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  min-height: 2.75rem;
  background: var(--primary);
  color: white;
}

.btn:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.btn:active {
  transform: translateY(0);
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

.btn.danger {
  background: var(--danger);
}

.btn.danger:hover {
  background: var(--danger-hover);
}

.btn.premium {
  background: var(--warning);
  color: var(--text-primary);
}

.btn.premium:hover {
  background: #b45309;
}

/* =============================================================================
   SPOT PRICE CARDS
   ============================================================================= */
.spot-input .grid.grid-2 {
  margin-top: var(--spacing-sm);
}


.spot-input {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--border);
}

.spot-card {
  background: var(--bg-primary);
  border-radius: var(--radius);
  padding: var(--spacing);
  text-align: center;
  margin-bottom: var(--spacing);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.spot-card-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.spot-card-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

/* =============================================================================
   TOTALS CARDS
   ============================================================================= */

.totals {
  display: grid;
  gap: var(--spacing-lg);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.total-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.total-card:hover {
  box-shadow: var(--shadow-lg);
}

.total-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: var(--spacing);
  color: var(--primary);
  text-align: center;
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--border);
}

.total-group {
  background: var(--bg-primary);
  border-radius: var(--radius);
  padding: var(--spacing);
  margin: var(--spacing-sm) 0;
  border: 1px solid var(--border);
}

.total-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.375rem 0;
  border-bottom: 1px dashed var(--border);
}

.total-item:last-child {
  border-bottom: none;
}

.total-label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.total-value {
  font-weight: 600;
  color: var(--text-primary);
}

.details-btn {
  background: var(--primary);
  color: white;
  width: 100%;
  margin-top: var(--spacing);
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  min-height: 2.75rem;
}

.details-btn:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.details-btn:active {
  transform: translateY(0);
}

.details-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.details-btn:hover::before {
  left: 100%;
}



.total-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: var(--spacing);
  color: var(--text-primary) !important;
  text-align: center;
  padding-bottom: var(--spacing-sm);
  border-bottom: 4px solid var(--border); /* fallback, will be overridden below */
  transition: border-color 0.2s, color 0.2s;
}

/* Metal-specific underline accent */
.silver .total-title { border-bottom: 4px solid var(--silver); }
.gold .total-title { border-bottom: 4px solid var(--gold); }
.platinum .total-title { border-bottom: 4px solid var(--platinum); }
.palladium .total-title { border-bottom: 4px solid var(--palladium); }
/* Metal-specific colors */
.silver .total-title {  }
.gold .total-title {  }
.platinum .total-title {  }
.palladium .total-title {  }

/* =============================================================================
   TABLES - Main inventory table with interactive features
   
   Features implemented:
   - Fixed table layout for precise column control
   - Sortable headers with visual indicators
   - Clickable item names for editing
   - Collectable status checkboxes
   - Delete buttons with hover effects
   - Column resizing with drag handles
   - Responsive design with mobile optimizations
   - Hover effects and zebra striping for readability
   ============================================================================= */

table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-primary);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  table-layout: fixed; /* Enable column width control */
}

th {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  font-weight: 600;
  padding: 0.375rem 0.25rem; /* Reduced padding for narrower rows */
  text-align: left;
  cursor: pointer;
  position: relative;
  border-bottom: 2px solid var(--border);
  border-right: 1px solid var(--border);
  transition: var(--transition);
  font-size: 0.8rem; /* Smaller font for more compact headers */
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 60px;
}

th:hover {
  background: var(--border);
}

td {
  padding: 0.25rem; /* Much smaller padding for narrower rows */
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border);
  color: var(--text-primary);
  font-size: 0.75rem; /* Smaller font size */
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

tr:nth-child(even) {
  background: var(--bg-secondary);
}

tr:hover {
  background: var(--bg-tertiary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sort-indicator {
  margin-left: 0.25rem;
  font-weight: bold;
  color: var(--primary);
  font-size: 0.7rem;
}

/* Column width presets for better initial layout */
th:nth-child(1) { width: 40px; }   /* # */
th:nth-child(2) { width: 60px; }   /* Metal */
th:nth-child(3) { width: 45px; }   /* Qty */
th:nth-child(4) { width: 60px; }   /* Type */
th:nth-child(5) { width: 120px; }  /* Name - clickable */
th:nth-child(6) { width: 80px; }   /* Weight */
th:nth-child(7) { width: 90px; }   /* Purchase Price */
th:nth-child(8) { width: 85px; }   /* Spot Price */
th:nth-child(9) { width: 85px; }   /* Premium */
th:nth-child(10) { width: 100px; } /* Total Premium */
th:nth-child(11) { width: 110px; } /* Purchase Location */
th:nth-child(12) { width: 110px; } /* Storage Location */
th:nth-child(13) { width: 80px; }  /* Date */
th:nth-child(14) { width: 70px; }  /* Collectable - checkbox */
th:nth-child(15) { width: 50px; }  /* Delete */

/* Clickable name cell styling */
.clickable-name {
  cursor: pointer;
  color: var(--primary);
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: var(--transition);
  position: relative;
  font-weight: 500;
}

.clickable-name:hover {
  color: var(--primary-hover);
  text-decoration-color: var(--primary-hover);
  background-color: var(--bg-secondary);
}

.clickable-name:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  color: var(--primary-hover);
  text-decoration-color: var(--primary-hover);
  background-color: var(--bg-secondary);
}

.clickable-name::after {
  content: '✎';
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.7rem;
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 0.2s;
}

.clickable-name:hover::after,
.clickable-name:focus::after {
  opacity: 0.7;
}

/* Checkbox cell styling */
.checkbox-cell {
  text-align: center;
  vertical-align: middle;
}

.collectable-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin: 0;
  transform: scale(1.2);
  accent-color: var(--primary);
  border-radius: 3px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.collectable-checkbox:hover {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  transform: scale(1.3);
}

.collectable-checkbox:focus {
  outline: 2px solid var(--primary);
  outline-offset: 1px;
}

/* Delete cell styling */
.delete-cell {
  text-align: center;
  vertical-align: middle;
}

.delete-cell .btn {
  margin: 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  width: 24px;
  height: 24px;
  padding: 0;
  font-size: 0.9rem;
  font-weight: bold;
  border-radius: 50%;
  transition: all 0.2s;
}

.delete-cell .btn:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow);
}

/* Make buttons in table cells smaller */
td .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  min-height: 1.8rem;
  line-height: 1;
}

/* Make toggle switches smaller */
td .switch {
  width: 32px;
  height: 18px;
}

td .slider {
  border-radius: 18px;
}

td .slider:before {
  height: 14px;
  width: 14px;
  left: 2px;
  bottom: 2px;
}

td input:checked + .slider:before {
  transform: translateX(14px);
}

/* Resize handle styling */
.resize-handle:hover {
  background: var(--primary) !important;
  opacity: 0.7;
}

.resize-handle:active {
  background: var(--primary) !important;
  opacity: 1;
}

/* =============================================================================
   MODALS - Edit modal and analytics modal with charts
   
   Two modal types:
   1. Edit Modal: Item editing form with validation and collectable toggle
   2. Details Modal: Analytics with pie charts and data breakdowns
   
   Features:
   - Backdrop blur and overlay effects
   - Smooth slide-in animation
   - Responsive sizing for all screen sizes
   - Keyboard navigation support
   - Auto-scrolling for content overflow
   ============================================================================= */

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: var(--spacing);
}

.modal-content {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.details-modal-content {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.details-modal-title {
  font-size: 1.5rem;
  color: var(--primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
  border-bottom: 2px solid var(--primary);
  padding-bottom: var(--spacing-sm);
}

.details-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
}

.details-section {
  background: var(--bg-secondary);
  border-radius: var(--radius);
  padding: var(--spacing-lg);
  border: 1px solid var(--border);
}

.details-section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: var(--spacing);
  text-align: center;
  border-bottom: 1px solid var(--border);
  padding-bottom: var(--spacing-sm);
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px dashed var(--border);
}

.breakdown-item:last-child {
  border-bottom: none;
}

.breakdown-label {
  font-weight: 500;
  color: var(--text-primary);
}

.breakdown-values {
  text-align: right;
  font-size: 0.875rem;
}

.breakdown-count {
  color: var(--text-muted);
  font-weight: 500;
}

.breakdown-weight {
  color: var(--primary);
  font-weight: 600;
}

.breakdown-value {
  color: var(--success);
  font-weight: 600;
}

/* =============================================================================
   PIE CHART STYLES - Chart.js integration for analytics
   
   Provides styling for:
   - Chart containers with proper aspect ratios
   - Chart titles and section headers
   - Responsive chart sizing for all screen sizes
   - Grid layout for side-by-side chart display
   - Integration with details modal layout
   
   Charts display breakdowns by:
   - Item type (rounds, bars, coins, etc.)
   - Purchase location (dealer, online, local, etc.)
   ============================================================================= */

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
}

.chart-container {
  background: var(--bg-secondary);
  border-radius: var(--radius);
  padding: var(--spacing-lg);
  border: 1px solid var(--border);
  text-align: center;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: var(--spacing);
  border-bottom: 1px solid var(--border);
  padding-bottom: var(--spacing-sm);
}

.chart-canvas-container {
  position: relative;
  height: 300px;
  width: 100%;
  margin: 0 auto;
}

.chart-canvas {
  max-height: 300px !important;
}

.close-details-btn {
  background: var(--primary);
  color: white;
  width: 100%;
  margin-top: var(--spacing-lg);
}

.close-details-btn:hover {
  background: var(--primary-hover);
}

/* =============================================================================
   PAGINATION
   ============================================================================= */

.pagination-section {
  margin: var(--spacing) 0;
}

.pagination-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
}

.pagination-buttons {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.pagination-info-controls {
  display: flex;
  gap: var(--spacing);
  align-items: center;
  justify-content: center;
}

.page-numbers {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.page-numbers button {
  min-width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-weight: 500;
  transition: var(--transition);
  cursor: pointer;
  padding: 0;
}

.page-numbers button:hover:not(.active) {
  background: var(--bg-secondary);
  border-color: var(--border-hover);
}

.page-numbers button.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  font-weight: 600;
}

.pagination-btn {
  min-width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-weight: 500;
  transition: var(--transition);
  cursor: pointer;
  padding: 0;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--bg-secondary);
  border-color: var(--border-hover);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  min-width: 80px;
  text-align: center;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-primary);
}

/* =============================================================================
   SEARCH
   ============================================================================= */

.search-section {
  margin-bottom: var(--spacing);
}

.search-container {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

#searchInput {
  flex: 1;
}

#clearSearchBtn {
  width: auto;
  padding: 0.75rem 1.5rem;
  background: var(--secondary);
  color: white;
}

#clearSearchBtn:hover {
  background: var(--secondary-hover);
}

.search-results-info {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: var(--spacing-sm);
  text-align: right;
}

/* =============================================================================
   IMPORT/EXPORT SECTION
   ============================================================================= */

.import-export-section h2 {
  text-align: center;
  font-weight: 600;
  margin-bottom: var(--spacing);
  color: var(--primary);
  font-size: 1.125rem;
}

.import-export-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--spacing-sm);
}

.import-export-grid .btn,
.import-export-grid label.btn {
  height: auto;
  min-height: 2.75rem;
  padding: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.import-export-grid label.btn {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.import-export-grid label.btn input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

/* =============================================================================
   TOGGLE SWITCHES
   ============================================================================= */

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border);
  transition: var(--transition);
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: var(--transition);
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
}

input:checked + .slider {
  background-color: var(--primary);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

input:disabled + .slider {
  background-color: var(--text-muted);
  opacity: 0.6;
}

.collectable-note,
.collectable-explanation {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
  text-align: center;
  font-style: italic;
}

/* =============================================================================
   BOATING ACCIDENT SECTION
   ============================================================================= */

.boating-accident-section {
  margin-top: var(--spacing-xl);
  text-align: center;
}

.boating-accident-section button {
  padding: var(--spacing) var(--spacing-xl);
  font-size: 1.125rem;
  font-weight: 600;
  background: var(--danger);
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
}

.boating-accident-section button:hover {
  background: var(--danger-hover);
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}

/* =============================================================================
   ACTION BUTTON GRIDS
   ============================================================================= */

.action-buttons {
  display: grid;
  gap: var(--spacing-sm);
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

/* =============================================================================
   RESPONSIVE DESIGN - Consolidated Media Queries
   
   Breakpoint strategy:
   - 1200px: Large desktop - reduce chart complexity, stack some elements
   - 992px: Desktop - simplify totals grid, reduce modal sizes
   - 768px: Tablet - stack most elements, smaller fonts, compact controls
   - 480px: Mobile - single column layout, minimal spacing, touch-friendly
   
   Key responsive features:
   - Flexible grid layouts that adapt to screen size
   - Progressive enhancement from mobile-first approach
   - Touch-friendly button and input sizing
   - Readable font sizes across all devices
   - Optimized table display with column adjustments
   ============================================================================= */

@media (max-width: 1200px) {
  .totals {
    grid-template-columns: repeat(3, 1fr);
  }

  .details-modal-content {
    max-width: 900px;
  }

  .details-content,
  .charts-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .totals {
    grid-template-columns: repeat(2, 1fr);
  }

  .details-modal-content {
    max-width: 700px;
  }
}

@media (max-width: 768px) {
  body {
    max-width: 95vw;
    margin: var(--spacing) auto;
    padding: var(--spacing-sm);
  }

  .app-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing);
  }

  .app-header h1 {
    margin: 0;
  }

  section {
    padding: var(--spacing);
  }

  .pagination-controls {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .pagination-left,
  .pagination-right {
    justify-content: center;
    margin-bottom: var(--spacing-sm);
  }

  .pagination-center {
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .pagination-info-controls {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .search-container {
    flex-direction: column;
    align-items: stretch;
  }

  #clearSearchBtn {
    width: 100%;
  }

  .totals {
    grid-template-columns: 1fr;
  }

  .import-export-grid {
    grid-template-columns: 1fr;
  }

  .details-content,
  .charts-section {
    grid-template-columns: 1fr;
    gap: var(--spacing);
  }

  .details-modal-content {
    max-width: 95%;
    padding: var(--spacing);
  }

  .grid-2 {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }

  .chart-canvas-container {
    height: 250px;
  }

  .chart-canvas {
    max-height: 250px !important;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.5rem;
  }

  .modal-content,
  .details-modal-content {
    margin: var(--spacing-sm);
    padding: var(--spacing);
  }

  .total-card {
    padding: var(--spacing);
  }

  .spot-input {
    padding: var(--spacing);
  }

  .chart-canvas-container {
    height: 200px;
  }

  .chart-canvas {
    max-height: 200px !important;
  }
}

/* Additional mobile table adjustments */
@media (max-width: 768px) {
  th {
    font-size: 0.7rem;
    padding: 0.25rem 0.125rem;
  }
  
  td {
    font-size: 0.7rem;
    padding: 0.2rem;
  }
  
  th:nth-child(1) { width: 30px; }   /* # */
  th:nth-child(2) { width: 50px; }   /* Metal */
  th:nth-child(3) { width: 35px; }   /* Qty */
  th:nth-child(4) { width: 50px; }   /* Type */
  th:nth-child(5) { width: 100px; }  /* Name */
  th:nth-child(6) { width: 70px; }   /* Weight */
  th:nth-child(7) { width: 80px; }   /* Purchase Price */
  th:nth-child(8) { width: 75px; }   /* Spot Price */
  th:nth-child(9) { width: 75px; }   /* Premium */
  th:nth-child(10) { width: 85px; }  /* Total Premium */
  th:nth-child(11) { width: 90px; }  /* Purchase Location */
  th:nth-child(12) { width: 90px; }  /* Storage Location */
  th:nth-child(13) { width: 70px; }  /* Date */
  th:nth-child(14) { width: 60px; }  /* Collectable */
  th:nth-child(15) { width: 40px; }  /* Delete */
}

@media (max-width: 480px) {
  th {
    font-size: 0.65rem;
    padding: 0.2rem 0.1rem;
  }
  
  td {
    font-size: 0.65rem;
    padding: 0.15rem;
  }
  
  td .btn {
    padding: 0.2rem 0.3rem;
    font-size: 0.65rem;
    min-height: 1.5rem;
  }
}

@media (min-width: 600px) {
  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}

================================================================================

## 11. File: PreciousMetalInventoryTool/app/js/app/js/constants.js
--------------------------------------------------------------------------------
// CONFIGURATION & GLOBAL CONSTANTS
// =============================================================================

/** @constant {string} APP_VERSION - Application version */
const APP_VERSION = '3.0.2';

/** @constant {string} LS_KEY - LocalStorage key for inventory data */
const LS_KEY = 'metalInventory';

/** @constant {string} SPOT_HISTORY_KEY - LocalStorage key for spot price history */
const SPOT_HISTORY_KEY = 'metalSpotHistory';

/** @constant {string} THEME_KEY - LocalStorage key for theme preference */
const THEME_KEY = 'appTheme';

/**
 * Metal configuration object - Central registry for all metal-related information
 * 
 * This configuration drives the entire application's metal handling by defining:
 * - Display names for user interface elements
 * - Key identifiers for data structures and calculations
 * - DOM element ID patterns for dynamic element selection
 * - LocalStorage keys for persistent data storage
 * - CSS color variables for styling and theming
 * 
 * Each metal configuration contains:
 * @property {string} name - Display name used in UI elements and forms
 * @property {string} key - Lowercase identifier for data objects and calculations
 * @property {string} spotKey - DOM ID pattern for spot price input elements
 * @property {string} localStorageKey - Key for storing spot prices in localStorage
 * @property {string} color - CSS custom property name for metal-specific styling
 * 
 * Adding a new metal type requires:
 * 1. Adding configuration here
 * 2. Adding corresponding HTML elements following the naming pattern
 * 3. Adding CSS custom properties for colors
 * 4. The application will automatically handle the rest through iteration
 */
const METALS = {
  SILVER: { 
    name: 'Silver', 
    key: 'silver', 
    spotKey: 'userSpotPriceSilver',
    localStorageKey: 'spotSilver',
    color: 'silver'
  },
  GOLD: { 
    name: 'Gold', 
    key: 'gold', 
    spotKey: 'userSpotPriceGold',
    localStorageKey: 'spotGold',
    color: 'gold'
  },
  PLATINUM: { 
    name: 'Platinum', 
    key: 'platinum', 
    spotKey: 'userSpotPricePlatinum',
    localStorageKey: 'spotPlatinum',
    color: 'platinum'
  },
  PALLADIUM: { 
    name: 'Palladium', 
    key: 'palladium', 
    spotKey: 'userSpotPricePalladium',
    localStorageKey: 'spotPalladium',
    color: 'palladium'
  }
};

// =============================================================================


================================================================================

## 12. File: PreciousMetalInventoryTool/app/js/events.js
--------------------------------------------------------------------------------
/**
 * Implements dynamic column resizing for the inventory table
 * 
 * This function adds interactive resize handles to table headers that allow users to:
 * - Drag column borders to adjust width
 * - Maintain minimum and maximum column widths
 * - Provide visual feedback during resize operations
 * - Prevent text selection during drag operations
 * - Clean up existing handles before re-adding (for table re-renders)
 * 
 * Technical implementation:
 * - Adds resize handles as DOM elements positioned on column borders
 * - Uses mouse event listeners for drag detection and movement
 * - Calculates new widths based on mouse position changes
 * - Applies width constraints to prevent unusable column sizes
 * - Temporarily disables other interactions during resize
 * 
 * @returns {void} Modifies DOM to add resize functionality
 * 
 * @example
 * // Called after table re-render to restore resize capability
 * renderTable();
 * setupColumnResizing(); // Re-establish resize handles
 */
const setupColumnResizing = () => {
  const table = document.getElementById('inventoryTable');
  if (!table) return;

  // Clear any existing resize handles
  const existingHandles = table.querySelectorAll('.resize-handle');
  existingHandles.forEach(handle => handle.remove());

  let isResizing = false;
  let currentColumn = null;
  let startX = 0;
  let startWidth = 0;

  // Add resize handles to table headers
  const headers = table.querySelectorAll('th');
  headers.forEach((header, index) => {
    // Skip the last column (delete button)
    if (index === headers.length - 1) return;

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.style.cssText = `
      position: absolute;
      right: 0;
      top: 0;
      width: 6px;
      height: 100%;
      background: transparent;
      cursor: col-resize;
      z-index: 10;
      transition: background-color 0.2s;
    `;

    header.style.position = 'relative';
    header.appendChild(resizeHandle);

    resizeHandle.addEventListener('mousedown', (e) => {
      isResizing = true;
      currentColumn = header;
      startX = e.clientX;
      startWidth = parseInt(document.defaultView.getComputedStyle(header).width, 10);
      
      e.preventDefault();
      e.stopPropagation();
      
      // Prevent header click event from firing
      header.style.pointerEvents = 'none';
      setTimeout(() => {
        header.style.pointerEvents = 'auto';
      }, 100);
    });
  });

  // Handle mouse move for resizing
  document.addEventListener('mousemove', (e) => {
    if (!isResizing || !currentColumn) return;

    const width = startWidth + e.clientX - startX;
    const minWidth = 40; // Minimum column width
    const maxWidth = 300; // Maximum column width
    
    if (width >= minWidth && width <= maxWidth) {
      currentColumn.style.width = width + 'px';
    }
  });

  // Handle mouse up to stop resizing
  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      currentColumn = null;
    }
  });

  // Prevent text selection during resize
  document.addEventListener('selectstart', (e) => {
    if (isResizing) {
      e.preventDefault();
    }
  });
};

// EVENT LISTENERS
// =============================================================================

/**
 * Initializes all primary event listeners for the application interface
 * 
 * This comprehensive setup function establishes event handlers for:
 * 
 * TABLE INTERACTIONS:
 * - Column header clicks for sorting (skips # and Delete columns)
 * - Toggle direction on repeated clicks (asc/desc)
 * 
 * FORM SUBMISSIONS:
 * - Main inventory form with validation and premium calculation
 * - Edit form with historical spot price handling
 * - Input validation for quantity, weight, and price fields
 * 
 * SPOT PRICE MANAGEMENT:
 * - Save/reset buttons for all four metal types
 * - Enter key support for quick spot price updates
 * 
 * IMPORT/EXPORT OPERATIONS:
 * - File input change events for CSV, JSON, Excel imports
 * - Export button clicks for all supported formats
 * - File input reset after processing
 * 
 * UTILITY FUNCTIONS:
 * - Modal close handlers (cancel edit, ESC key support)
 * - "Boating Accident" data reset with confirmation
 * - Theme toggle and persistence
 * 
 * @returns {void} Attaches event listeners to DOM elements
 * 
 * @example
 * // Called once during application initialization
 * document.addEventListener('DOMContentLoaded', () => {
 *   // ... other initialization
 *   setupEventListeners();
 * });
 */
const setupEventListeners = () => {
  // Table header sorting
  const headers = document.querySelectorAll('#inventoryTable th');
  headers.forEach((header, index) => {
    // Skip # column (0) and Delete column (last column)
    if (index === 0 || index >= headers.length - 1) {
      return;
    }

    header.style.cursor = 'pointer';

    header.addEventListener('click', () => {
      // Toggle sort direction if same column, otherwise set to new column with asc
      if (sortColumn === index) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        sortColumn = index;
        sortDirection = 'asc';
      }

      renderTable();
    });
  });

  elements.inventoryForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const metal = elements.itemMetal.value;
    const name = elements.itemName.value.trim();
    const qty = parseInt(elements.itemQty.value, 10);
    const type = elements.itemType.value;
    const weight = parseFloat(elements.itemWeight.value);
    const price = parseFloat(elements.itemPrice.value);
    const purchaseLocation = elements.purchaseLocation.value.trim() || "Unknown";
    const storageLocation = elements.storageLocation.value.trim() || "Unknown";
    const date = elements.itemDate.value || todayStr();

    if (isNaN(qty) || qty < 1 || !Number.isInteger(qty) ||
        isNaN(weight) || weight <= 0 ||
        isNaN(price) || price < 0) {
      return alert("Please enter valid values for all fields.");
    }

    // Get current spot price
    const metalKey = metal.toLowerCase();
    const spotPriceAtPurchase = spotPrices[metalKey];

    // Calculate premium per ounce (only for non-collectible items)
    let premiumPerOz = 0;
    let totalPremium = 0;

    // For new items, they're not collectable by default
    const isCollectable = false;

    if (!isCollectable) {
      const pricePerOz = price / weight;
      premiumPerOz = pricePerOz - spotPriceAtPurchase;
      totalPremium = premiumPerOz * qty * weight;
    }

    inventory.push({ 
      metal, 
      name, 
      qty, 
      type, 
      weight, 
      price, 
      date,
      purchaseLocation,
      storageLocation,
      spotPriceAtPurchase,
      premiumPerOz,
      totalPremium,
      isCollectable
    });

    saveInventory();
    renderTable();
    this.reset();
    elements.itemDate.value = todayStr();
  });

  // Edit form submission
  elements.editForm.addEventListener('submit', function(e) {
    e.preventDefault();

    if (editingIndex === null) return;

    const metal = elements.editMetal.value;
    const name = elements.editName.value.trim();
    const qty = parseInt(elements.editQty.value, 10);
    const type = elements.editType.value;
    const weight = parseFloat(elements.editWeight.value);
    const price = parseFloat(elements.editPrice.value);
    const purchaseLocation = elements.editPurchaseLocation.value.trim() || "Unknown";
    const storageLocation = elements.editStorageLocation.value.trim() || "Unknown";
    const date = elements.editDate.value;

    // Use the checkbox state the user just set
    const isCollectable = document.getElementById("editCollectable").checked;

    // Get spot price input value
    const spotPriceInput = elements.editSpotPrice.value.trim();

    // If spot price is empty and item is not collectable, use current spot price
    let spotPriceAtPurchase;
    if (!isCollectable && spotPriceInput === '') {
      const metalKey = metal.toLowerCase();
      spotPriceAtPurchase = spotPrices[metalKey];
    } else {
      spotPriceAtPurchase = parseFloat(spotPriceInput);
    }

    if (isNaN(qty) || qty < 1 || !Number.isInteger(qty) ||
        isNaN(weight) || weight <= 0 ||
        isNaN(price) || price < 0 ||
        (!isCollectable && (isNaN(spotPriceAtPurchase) || spotPriceAtPurchase <= 0))) {
      return alert("Please enter valid values for all fields.");
    }

    // Calculate premium per ounce (only for non-collectible items)
    let premiumPerOz = 0;
    let totalPremium = 0;

    if (!isCollectable) {
      const pricePerOz = price / weight;
      premiumPerOz = pricePerOz - spotPriceAtPurchase;
      totalPremium = premiumPerOz * qty * weight;
    }

    // Update the item
    inventory[editingIndex] = {
      metal,
      name,
      qty,
      type,
      weight,
      price,
      date,
      purchaseLocation,
      storageLocation,
      spotPriceAtPurchase: isCollectable ? 0 : spotPriceAtPurchase,
      premiumPerOz,
      totalPremium,
      isCollectable
    };

    saveInventory();
    renderTable();

    // Close modal
    elements.editModal.style.display = 'none';
    editingIndex = null;
  });

  // Cancel edit
  elements.cancelEditBtn.addEventListener('click', function() {
    elements.editModal.style.display = 'none';
    editingIndex = null;
  });

  // Spot Price Event Listeners
  Object.values(METALS).forEach(metalConfig => {
    const metalKey = metalConfig.key;

    elements.saveSpotBtn[metalKey].addEventListener('click', () => updateManualSpot(metalKey));
    elements.resetSpotBtn[metalKey].addEventListener('click', () => resetSpot(metalKey));
    elements.userSpotPriceInput[metalKey].addEventListener('keydown', (e) => {
      if (e.key === 'Enter') updateManualSpot(metalKey);
    });
  });



  // Import/Export Event Listeners
  elements.importCsvFile.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
      importCsv(e.target.files[0]);
    }
    this.value = '';
  });

  elements.importJsonFile.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
      importJson(e.target.files[0]);
    }
    this.value = '';
  });

  elements.importExcelFile.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
      importExcel(e.target.files[0]);
    }
    this.value = '';
  });

  elements.exportCsvBtn.addEventListener('click', exportCsv);
  elements.exportJsonBtn.addEventListener('click', exportJson);
  elements.exportExcelBtn.addEventListener('click', exportExcel);
  elements.exportPdfBtn.addEventListener('click', exportPdf);
  elements.exportHtmlBtn.addEventListener('click', exportHtml);

  // Boating Accident Button
  elements.boatingAccidentBtn.addEventListener('click', function() {
    if (confirm("WARNING: This will erase ALL your data for this app (inventory, spot history, spot prices).\n\nAre you sure you want to proceed?\n\nThis action cannot be undone!")) {
      localStorage.removeItem(LS_KEY);
      localStorage.removeItem(SPOT_HISTORY_KEY);
      Object.values(METALS).forEach(metalConfig => {
        localStorage.removeItem(metalConfig.spotKey);
      });
      sessionStorage.clear();

      loadInventory();
      renderTable();
      loadSpotHistory();
      fetchSpotPrice();
      alert("All data has been erased.");
    }
  });
};

/**
 * Sets up pagination event listeners
 */
const setupPagination = () => {
  elements.itemsPerPage.addEventListener('change', function() {
    itemsPerPage = parseInt(this.value);
    currentPage = 1;
    renderTable();
  });

  elements.prevPage.addEventListener('click', function() {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  elements.nextPage.addEventListener('click', function() {
    const totalPages = calculateTotalPages(filterInventory());
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  });

  elements.firstPage.addEventListener('click', function() {
    currentPage = 1;
    renderTable();
  });

  elements.lastPage.addEventListener('click', function() {
    currentPage = calculateTotalPages(filterInventory());
    renderTable();
  });
};

/**
 * Sets up search event listeners
 */
const setupSearch = () => {
  elements.searchInput.addEventListener('input', function() {
    searchQuery = this.value;
    currentPage = 1; // Reset to first page when search changes
    renderTable();
  });

  elements.clearSearchBtn.addEventListener('click', function() {
    elements.searchInput.value = '';
    searchQuery = '';
    currentPage = 1;
    renderTable();
  });
};

/**
 * Sets up theme toggle event listeners
 */
const setupThemeToggle = () => {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';

  if (savedTheme === 'dark') {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  elements.themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
};

// =============================================================================

================================================================================

## 13. File: PreciousMetalInventoryTool/app/js/sorting.js
--------------------------------------------------------------------------------
// SORTING FUNCTIONALITY
// =============================================================================

/**
 * Sorts inventory based on current sort column and direction
 * 
 * @param {Array} [data=inventory] - Data to sort (defaults to main inventory)
 * @returns {Array} Sorted inventory data
 */
const sortInventory = (data = inventory) => {
  if (sortColumn === null) return data;

  return [...data].sort((a, b) => {
    let valA, valB;

    // Map column index to data property
    switch(sortColumn) {
      case 1: valA = a.metal; valB = b.metal; break; // Metal
      case 2: valA = a.qty; valB = b.qty; break; // Qty
      case 3: valA = a.type; valB = b.type; break; // Type
      case 4: valA = a.name; valB = b.name; break; // Name
      case 5: valA = a.weight; valB = b.weight; break; // Weight
      case 6: valA = a.price; valB = b.price; break; // Purchase Price
      case 7: valA = a.spotPriceAtPurchase; valB = b.spotPriceAtPurchase; break; // Spot Price
      case 8: valA = a.premiumPerOz; valB = b.premiumPerOz; break; // Premium per oz
      case 9: valA = a.totalPremium; valB = b.totalPremium; break; // Total Premium
      case 10: valA = a.purchaseLocation; valB = b.purchaseLocation; break; // Purchase Location
      case 11: valA = a.storageLocation || 'Unknown'; valB = b.storageLocation || 'Unknown'; break; // Storage Location
      case 12: valA = a.date; valB = b.date; break; // Date
      case 13: valA = a.isCollectable; valB = b.isCollectable; break; // Collectable
      default: return 0;
    }

    // Numeric comparison for numbers
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    } 
    // Boolean comparison for collectable
    else if (typeof valA === 'boolean' && typeof valB === 'boolean') {
      return sortDirection === 'asc' ? (valA - valB) : (valB - valA);
    }
    // String comparison for everything else
    else {
      return sortDirection === 'asc' 
        ? String(valA).localeCompare(String(valB)) 
        : String(valB).localeCompare(String(valA));
    }
  });
};

// =============================================================================


================================================================================

## 14. File: PreciousMetalInventoryTool/app/js/theme.js
--------------------------------------------------------------------------------
// THEME MANAGEMENT
// =============================================================================

/**
 * Sets application theme and updates localStorage
 * 
 * @param {string} theme - 'dark' or 'light'
 */
const setTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem(THEME_KEY, 'dark');
    elements.themeToggle.textContent = 'Light Mode';
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem(THEME_KEY, 'light');
    elements.themeToggle.textContent = 'Dark Mode';
  }
};

// =============================================================================


================================================================================

## 15. File: PreciousMetalInventoryTool/app/js/charts.js
--------------------------------------------------------------------------------
// CHART UTILITIES
// =============================================================================

/**
 * Generates a color palette for pie chart segments
 * 
 * @param {number} count - Number of colors needed
 * @returns {Array} Array of color strings
 */
const generateColors = (count) => {
  const colors = [
    '#3b82f6', // Primary blue
    '#ef4444', // Red
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#84cc16', // Lime
    '#ec4899', // Pink
    '#6b7280', // Gray
    '#14b8a6', // Teal
    '#f43f5e', // Rose
  ];

  // If we need more colors than predefined, generate them
  if (count > colors.length) {
    for (let i = colors.length; i < count; i++) {
      const hue = (i * 137.508) % 360; // Golden ratio for good distribution
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }
  }

  return colors.slice(0, count);
};

/**
 * Gets appropriate background color for charts based on current theme
 * 
 * @returns {string} Background color
 */
const getChartBackgroundColor = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return isDark ? '#1e293b' : '#ffffff';
};

/**
 * Gets appropriate text color for charts based on current theme
 * 
 * @returns {string} Text color
 */
const getChartTextColor = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return isDark ? '#f8fafc' : '#1e293b';
};

/**
 * Creates a pie chart with the given data
 * 
 * @param {HTMLCanvasElement} canvas - Canvas element to render chart on
 * @param {Object} data - Chart data with labels and values
 * @param {string} title - Chart title
 * @returns {Chart} Chart.js instance
 */
const createPieChart = (canvas, data, title) => {
  const labels = Object.keys(data);
  const values = Object.values(data).map(item => item.value);
  const colors = generateColors(labels.length);

  const ctx = canvas.getContext('2d');

  return new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderColor: colors.map(color => color + '80'), // Add transparency
        borderWidth: 2,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: getChartTextColor(),
            padding: 15,
            usePointStyle: true,
            font: {
              size: 12
            },
            generateLabels: function(chart) {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i];
                  const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);

                  return {
                    text: `${label} (${formatDollar(value)} - ${percentage}%)`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    strokeStyle: data.datasets[0].borderColor[i],
                    lineWidth: data.datasets[0].borderWidth,
                    hidden: false,
                    index: i
                  };
                });
              }
              return [];
            }
          }
        },
        tooltip: {
          backgroundColor: getChartBackgroundColor(),
          titleColor: getChartTextColor(),
          bodyColor: getChartTextColor(),
          borderColor: getChartTextColor(),
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);

              // Get breakdown data for additional info
              const breakdownItem = data[label];
              const count = breakdownItem ? breakdownItem.count : 0;
              const weight = breakdownItem ? breakdownItem.weight.toFixed(2) : '0.00';

              return [
                `${label}: ${formatDollar(value)} (${percentage}%)`,
                `Items: ${count}`,
                `Weight: ${weight} oz`
              ];
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: false,
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  });
};

/**
 * Destroys existing chart instances to prevent memory leaks
 */
const destroyCharts = () => {
  Object.keys(chartInstances).forEach(key => {
    if (chartInstances[key]) {
      chartInstances[key].destroy();
      chartInstances[key] = null;
    }
  });
};

// =============================================================================


================================================================================

## 16. File: PreciousMetalInventoryTool/app/js/init.js
--------------------------------------------------------------------------------
// INITIALIZATION
// =============================================================================

/**
 * Main application initialization function - entry point for the application
 * 
 * This function coordinates the complete application startup process:
 * 
 * DOM ELEMENT INITIALIZATION:
 * - Caches all DOM elements in the global elements object for performance
 * - Maps metal configurations to their corresponding DOM elements
 * - Initializes totals display elements with null-safety for missing elements
 * 
 * VERSION MANAGEMENT:
 * - Updates page title and header with current version from app/js/constants.js
 * - Ensures consistent version display across application
 * 
 * DATA LOADING:
 * - Restores inventory from localStorage with migration
 * - Loads spot price history for analytics
 * - Sets default form values (today's date)
 * 
 * INTERFACE SETUP:
 * - Renders initial table display
 * - Fetches current spot prices (if implemented)
 * - Applies saved theme preference
 * 
 * EVENT BINDING:
 * - Establishes all event listeners for user interactions
 * - Sets up pagination, search, and theme controls
 * - Initializes column resizing functionality
 * 
 * GLOBAL EXPOSURE:
 * - Makes key functions available to inline event handlers
 * - Ensures compatibility with HTML onclick attributes
 * 
 * @returns {void} Fully initializes the application interface
 * 
 * @example
 * // Automatically called when DOM is ready
 * document.addEventListener('DOMContentLoaded', initFunction);
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize DOM elements after DOM is loaded
  elements.spotPriceDisplaySilver = document.getElementById('spotPriceDisplaySilver');
  elements.spotPriceDisplayGold = document.getElementById('spotPriceDisplayGold');
  elements.spotPriceDisplayPlatinum = document.getElementById('spotPriceDisplayPlatinum');
  elements.spotPriceDisplayPalladium = document.getElementById('spotPriceDisplayPalladium');

  elements.userSpotPriceSilver = document.getElementById('userSpotPriceSilver');
  elements.userSpotPriceGold = document.getElementById('userSpotPriceGold');
  elements.userSpotPricePlatinum = document.getElementById('userSpotPricePlatinum');
  elements.userSpotPricePalladium = document.getElementById('userSpotPricePalladium');

  elements.saveSpotBtnSilver = document.getElementById('saveSpotBtnSilver');
  elements.saveSpotBtnGold = document.getElementById('saveSpotBtnGold');
  elements.saveSpotBtnPlatinum = document.getElementById('saveSpotBtnPlatinum');
  elements.saveSpotBtnPalladium = document.getElementById('saveSpotBtnPalladium');

  elements.resetSpotBtnSilver = document.getElementById('resetSpotBtnSilver');
  elements.resetSpotBtnGold = document.getElementById('resetSpotBtnGold');
  elements.resetSpotBtnPlatinum = document.getElementById('resetSpotBtnPlatinum');
  elements.resetSpotBtnPalladium = document.getElementById('resetSpotBtnPalladium');

  elements.inventoryForm = document.getElementById('inventoryForm');
  elements.inventoryTable = document.getElementById('inventoryTable').querySelector('tbody');
  elements.itemMetal = document.getElementById('itemMetal');
  elements.itemName = document.getElementById('itemName');
  elements.itemQty = document.getElementById('itemQty');
  elements.itemType = document.getElementById('itemType');
  elements.itemWeight = document.getElementById('itemWeight');
  elements.itemPrice = document.getElementById('itemPrice');
  elements.purchaseLocation = document.getElementById('purchaseLocation');
  elements.storageLocation = document.getElementById('storageLocation');
  elements.itemDate = document.getElementById('itemDate');

  elements.importCsvFile = document.getElementById('importCsvFile');
  elements.importJsonFile = document.getElementById('importJsonFile');
  elements.importExcelFile = document.getElementById('importExcelFile');
  elements.exportCsvBtn = document.getElementById('exportCsvBtn');
  elements.exportJsonBtn = document.getElementById('exportJsonBtn');
  elements.exportExcelBtn = document.getElementById('exportExcelBtn');
  elements.exportPdfBtn = document.getElementById('exportPdfBtn');
  elements.exportHtmlBtn = document.getElementById('exportHtmlBtn');
  elements.boatingAccidentBtn = document.getElementById('boatingAccidentBtn');
  elements.editModal = document.getElementById('editModal');
  elements.editForm = document.getElementById('editForm');
  elements.cancelEditBtn = document.getElementById('cancelEdit');
  elements.editMetal = document.getElementById('editMetal');
  elements.editName = document.getElementById('editName');
  elements.editQty = document.getElementById('editQty');
  elements.editType = document.getElementById('editType');
  elements.editWeight = document.getElementById('editWeight');
  elements.editPrice = document.getElementById('editPrice');
  elements.editPurchaseLocation = document.getElementById('editPurchaseLocation');
  elements.editStorageLocation = document.getElementById('editStorageLocation');
  elements.editDate = document.getElementById('editDate');
  elements.editSpotPrice = document.getElementById('editSpotPrice');
  elements.itemsPerPage = document.getElementById('itemsPerPage');
  elements.prevPage = document.getElementById('prevPage');
  elements.nextPage = document.getElementById('nextPage');
  elements.firstPage = document.getElementById('firstPage');
  elements.lastPage = document.getElementById('lastPage');
  elements.pageNumbers = document.getElementById('pageNumbers');
  elements.paginationInfo = document.getElementById('paginationInfo');
  elements.searchInput = document.getElementById('searchInput');
  elements.clearSearchBtn = document.getElementById('clearSearchBtn');
  elements.searchResultsInfo = document.getElementById('searchResultsInfo');
  elements.themeToggle = document.getElementById('themeToggle');

  // Initialize details modal elements
  elements.detailsModal = document.getElementById('detailsModal');
  elements.detailsModalTitle = document.getElementById('detailsModalTitle');
  elements.typeBreakdown = document.getElementById('typeBreakdown');
  elements.locationBreakdown = document.getElementById('locationBreakdown');

  // Initialize chart canvas elements
  elements.typeChart = document.getElementById('typeChart');
  elements.locationChart = document.getElementById('locationChart');

  // Update version numbers dynamically
  document.title = getAppTitle();
  const appHeader = document.querySelector('.app-header h1');
  if (appHeader) {
    appHeader.textContent = getAppTitle();
  }

  // Initialize spot price elements for all metals
  Object.values(METALS).forEach(metalConfig => {
    const metalKey = metalConfig.key;
    elements.spotPriceDisplay[metalKey] = document.getElementById(`spotPriceDisplay${metalConfig.name}`);
    elements.userSpotPriceInput[metalKey] = document.getElementById(`userSpotPrice${metalConfig.name}`);
    elements.saveSpotBtn[metalKey] = document.getElementById(`saveSpotBtn${metalConfig.name}`);
    elements.resetSpotBtn[metalKey] = document.getElementById(`resetSpotBtn${metalConfig.name}`);
  });

  // Initialize totals elements
  Object.values(METALS).forEach(metalConfig => {
    const metalKey = metalConfig.key;
    elements.totals[metalKey] = {
      items: document.getElementById(`totalItems${metalConfig.name}`),
      weight: document.getElementById(`totalWeight${metalConfig.name}`),
      value: document.getElementById(`currentValue${metalConfig.name}`),
      purchased: document.getElementById(`totalPurchased${metalConfig.name}`),
      premium: document.getElementById(`totalPremium${metalConfig.name}`),
      lossProfit: document.getElementById(`lossProfit${metalConfig.name}`),
      avgPrice: document.getElementById(`avgPrice${metalConfig.name}`),
      avgPremium: document.getElementById(`avgPremium${metalConfig.name}`),
      avgCollectablePrice: document.getElementById(`avgCollectablePrice${metalConfig.name}`),
      avgNonCollectablePrice: document.getElementById(`avgNonCollectablePrice${metalConfig.name}`)
    };
  });

  // Initialize "All" totals with null safety
  const nullElement = {
    textContent: '',
    innerHTML: '',
    style: {}
  };

  elements.totals.all = {
    items: document.getElementById('totalItemsAll') || nullElement,
    weight: document.getElementById('totalWeightAll') || nullElement,
    value: document.getElementById('currentValueAll') || nullElement,
    purchased: document.getElementById('totalPurchasedAll') || nullElement,
    premium: document.getElementById('totalPremiumAll') || nullElement,
    lossProfit: document.getElementById('lossProfitAll') || nullElement,
    avgPrice: document.getElementById('avgPriceAll') || nullElement,
    avgPremium: document.getElementById('avgPremiumAll') || nullElement,
    avgCollectablePrice: document.getElementById('avgCollectablePriceAll') || nullElement,
    avgNonCollectablePrice: document.getElementById('avgNonCollectablePriceAll') || nullElement
  };

  // Initialize app
  elements.itemDate.value = todayStr();
  loadInventory();
  loadSpotHistory();
  renderTable();
  fetchSpotPrice();

  // Setup event listeners
  setupEventListeners();
  setupPagination();
  setupSearch();
  setupThemeToggle();
  setupColumnResizing();
});

// Make functions available globally for inline event handlers
window.toggleCollectable = toggleCollectable;
window.showDetailsModal = showDetailsModal;
window.closeDetailsModal = closeDetailsModal;
window.editItem = editItem;
window.deleteItem = deleteItem;


================================================================================

## 17. File: PreciousMetalInventoryTool/app/js/spot.js
--------------------------------------------------------------------------------
// SPOT PRICE FUNCTIONS
// =============================================================================

/**
 * Saves spot history to localStorage
 */
const saveSpotHistory = () => saveData(SPOT_HISTORY_KEY, spotHistory);

/**
 * Loads spot history from localStorage
 */
const loadSpotHistory = () => spotHistory = loadData(SPOT_HISTORY_KEY, []);

/**
 * Records a new spot price entry in history
 * 
 * @param {number} newSpot - New spot price value
 * @param {string} source - Source of spot price ('manual' or other)
 * @param {string} metal - Metal type ('Silver', 'Gold', 'Platinum', or 'Palladium')
 */
const recordSpot = (newSpot, source, metal) => {
  if (!spotHistory.length || spotHistory[spotHistory.length-1].spot !== newSpot || spotHistory[spotHistory.length-1].metal !== metal) {
    spotHistory.push({
      spot: newSpot,
      metal,
      source,
      timestamp: new Date().toISOString().replace('T',' ').slice(0,19)
    });
    saveSpotHistory();
  }
};

/**
 * Fetches and displays current spot prices from localStorage
 */
const fetchSpotPrice = () => {
  // Load spot prices for all metals
  Object.values(METALS).forEach(metalConfig => {
    const storedSpot = localStorage.getItem(metalConfig.spotKey);
    if (storedSpot) {
      spotPrices[metalConfig.key] = parseFloat(storedSpot);
      elements.spotPriceDisplay[metalConfig.key].textContent = formatDollar(spotPrices[metalConfig.key]);
      recordSpot(spotPrices[metalConfig.key], 'manual', metalConfig.name);
    } else {
      elements.spotPriceDisplay[metalConfig.key].textContent = 'N/A';
    }
  });

  updateSummary();
};

/**
 * Updates spot price for specified metal from user input
 * 
 * @param {string} metalKey - Key of metal to update ('silver', 'gold', 'platinum', 'palladium')
 */
const updateManualSpot = (metalKey) => {
  const metalConfig = Object.values(METALS).find(m => m.key === metalKey);
  if (!metalConfig) return;

  const input = elements.userSpotPriceInput[metalKey];
  const value = input.value;

  if (!value) return;

  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return alert(`Invalid ${metalConfig.name.toLowerCase()} spot price.`);

  localStorage.setItem(metalConfig.spotKey, num);
  spotPrices[metalKey] = num;

  elements.spotPriceDisplay[metalKey].textContent = formatDollar(num);
  recordSpot(num, 'manual', metalConfig.name);

  updateSummary();
};

/**
 * Resets spot price for specified metal to default (removes from localStorage)
 * 
 * @param {string} metalKey - Key of metal to reset ('silver', 'gold', 'platinum', 'palladium')
 */
const resetSpot = (metalKey) => {
  const metalConfig = Object.values(METALS).find(m => m.key === metalKey);
  if (!metalConfig) return;

  localStorage.removeItem(metalConfig.spotKey);
  fetchSpotPrice();
};

// =============================================================================


================================================================================

## 18. File: PreciousMetalInventoryTool/app/js/detailsModal.js
--------------------------------------------------------------------------------
// DETAILS MODAL FUNCTIONS WITH PIE CHART INTEGRATION
// =============================================================================

/**
 * Calculates breakdown data for specified metal by type and location
 * RENAMED from calculateBreakdownData to avoid 403 errors
 * 
 * @param {string} metal - Metal type to calculate ('Silver', 'Gold', 'Platinum', or 'Palladium')
 * @returns {Object} Breakdown data organized by type and location
 */
const getBreakdownData = (metal) => {
  const metalItems = inventory.filter(item => item.metal === metal);

  const typeBreakdown = {};
  const locationBreakdown = {};

  metalItems.forEach(item => {
    const itemWeight = item.qty * item.weight;
    const itemValue = item.qty * item.price;

    // Type breakdown
    if (!typeBreakdown[item.type]) {
      typeBreakdown[item.type] = {
        count: 0,
        weight: 0,
        value: 0
      };
    }
    typeBreakdown[item.type].count += item.qty;
    typeBreakdown[item.type].weight += itemWeight;
    typeBreakdown[item.type].value += itemValue;

    // Location breakdown
    if (!locationBreakdown[item.purchaseLocation]) {
      locationBreakdown[item.purchaseLocation] = {
        count: 0,
        weight: 0,
        value: 0
      };
    }
    locationBreakdown[item.purchaseLocation].count += item.qty;
    locationBreakdown[item.purchaseLocation].weight += itemWeight;
    locationBreakdown[item.purchaseLocation].value += itemValue;
  });

  return { typeBreakdown, locationBreakdown };
};

/**
 * Creates breakdown DOM elements for display
 * CHANGED from renderBreakdownHTML to use DOM methods instead of innerHTML
 * 
 * @param {Object} breakdown - Breakdown data object
 * @returns {DocumentFragment} DOM fragment containing the breakdown elements
 */
const createBreakdownElements = (breakdown) => {
  const container = document.createDocumentFragment();

  if (Object.keys(breakdown).length === 0) {
    const item = document.createElement('div');
    item.className = 'breakdown-item';

    const label = document.createElement('span');
    label.className = 'breakdown-label';
    label.textContent = 'No data available';

    item.appendChild(label);
    container.appendChild(item);
    return container;
  }

  // Sort by value descending
  const sortedEntries = Object.entries(breakdown).sort((a, b) => b[1].value - a[1].value);

  sortedEntries.forEach(([key, data]) => {
    const item = document.createElement('div');
    item.className = 'breakdown-item';

    const label = document.createElement('span');
    label.className = 'breakdown-label';
    label.textContent = key;

    const values = document.createElement('div');
    values.className = 'breakdown-values';

    const count = document.createElement('div');
    count.className = 'breakdown-count';
    count.textContent = `${data.count} items`;

    const weight = document.createElement('div');
    weight.className = 'breakdown-weight';
    weight.textContent = `${data.weight.toFixed(2)} oz`;

    const value = document.createElement('div');
    value.className = 'breakdown-value';
    value.textContent = formatDollar(data.value);

    values.appendChild(count);
    values.appendChild(weight);
    values.appendChild(value);

    item.appendChild(label);
    item.appendChild(values);
    container.appendChild(item);
  });

  return container;
};

/**
 * Shows the details modal for specified metal with pie charts
 * 
 * @param {string} metal - Metal type to show details for
 */
const showDetailsModal = (metal) => {
  const breakdownData = getBreakdownData(metal);

  // Update modal title
  elements.detailsModalTitle.textContent = `${metal} Detailed Breakdown`;

  // Clear existing content
  elements.typeBreakdown.textContent = '';
  elements.locationBreakdown.textContent = '';

  // Destroy existing charts
  destroyCharts();

  // Create pie charts if there's data
  if (Object.keys(breakdownData.typeBreakdown).length > 0) {
    chartInstances.typeChart = createPieChart(
      elements.typeChart,
      breakdownData.typeBreakdown,
      'Type Breakdown'
    );
  }

  if (Object.keys(breakdownData.locationBreakdown).length > 0) {
    chartInstances.locationChart = createPieChart(
      elements.locationChart,
      breakdownData.locationBreakdown,
      'Location Breakdown'
    );
  }

  // Append DOM elements for detailed breakdown
  elements.typeBreakdown.appendChild(createBreakdownElements(breakdownData.typeBreakdown));
  elements.locationBreakdown.appendChild(createBreakdownElements(breakdownData.locationBreakdown));

  // Show modal
  elements.detailsModal.style.display = 'flex';

  // Add chart resize handling
  const resizeObserver = new ResizeObserver(() => {
    Object.values(chartInstances).forEach(chart => {
      if (chart) {
        chart.resize();
      }
    });
  });

  resizeObserver.observe(elements.detailsModal);
};

/**
 * Closes the details modal and cleans up charts
 */
const closeDetailsModal = () => {
  elements.detailsModal.style.display = 'none';
  destroyCharts();
};

// =============================================================================


================================================================================

## 19. File: PreciousMetalInventoryTool/app/js/pagination.js
--------------------------------------------------------------------------------
// PAGINATION FUNCTIONS
// =============================================================================

/**
 * Calculates total number of pages based on current data
 * 
 * @param {Array} [data=inventory] - Data to paginate
 * @returns {number} Total number of pages
 */
const calculateTotalPages = (data = inventory) => {
  return Math.max(1, Math.ceil(data.length / itemsPerPage));
};

/**
 * Renders pagination controls based on current state
 * 
 * @param {Array} [filteredData=filterInventory()] - Filtered data to paginate
 */
const renderPagination = (filteredData = filterInventory()) => {
  const totalPages = calculateTotalPages(filteredData);
  const pageNumbersContainer = elements.pageNumbers;
  pageNumbersContainer.innerHTML = '';

  // Show limited page numbers (max 7) centered around current page
  const maxVisiblePages = 7;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust startPage if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Add page number buttons
  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = currentPage === i ? 'active' : '';
    btn.onclick = () => goToPage(i);
    pageNumbersContainer.appendChild(btn);
  }

  // Update pagination info
  elements.paginationInfo.textContent = `${currentPage} of ${totalPages}`;

  // Update button states
  elements.firstPage.disabled = currentPage === 1;
  elements.prevPage.disabled = currentPage === 1;
  elements.nextPage.disabled = currentPage === totalPages;
  elements.lastPage.disabled = currentPage === totalPages;

  // Update search results info
  if (searchQuery.trim()) {
    elements.searchResultsInfo.textContent = `Found ${filteredData.length} results matching "${searchQuery}"`;
  } else {
    elements.searchResultsInfo.textContent = '';
  }
};

/**
 * Navigates to specified page number
 * 
 * @param {number} page - Page number to navigate to
 */
const goToPage = (page) => {
  const filteredData = filterInventory();
  const totalPages = calculateTotalPages(filteredData);
  currentPage = Math.max(1, Math.min(page, totalPages));
  renderTable();
};

// =============================================================================


================================================================================

## 20. File: PreciousMetalInventoryTool/app/js/inventory.js
--------------------------------------------------------------------------------
// INVENTORY FUNCTIONS
// =============================================================================

/**
 * Saves current inventory to localStorage
 */
const saveInventory = () => saveData(LS_KEY, inventory);

/**
 * Loads inventory from localStorage with comprehensive data migration
 * 
 * This function handles backwards compatibility by:
 * - Loading existing inventory data from localStorage
 * - Migrating legacy records that may be missing newer fields
 * - Calculating premiums for older records that lack this data
 * - Ensuring all records have required fields with sensible defaults
 * - Preserving existing user data while adding new functionality
 * 
 * @returns {void} Updates the global inventory array with migrated data
 * @throws {Error} Logs errors to console if localStorage access fails
 * 
 * @example
 * // Called during app initialization to restore saved data
 * loadInventory();
 * console.log(inventory); // Array of properly formatted inventory items
 */
const loadInventory = () => {
  const data = loadData(LS_KEY, []);
  // Migrate legacy data to include new fields
  inventory = data.map(item => {
    // Handle legacy data that might not have all fields
    if (item.premiumPerOz === undefined) {
      // For legacy items, calculate premium if possible
      const metalConfig = Object.values(METALS).find(m => m.name === item.metal) || METALS.SILVER;
      const spotPrice = spotPrices[metalConfig.key];

      const premiumPerOz = spotPrice > 0 ? (item.price / item.weight) - spotPrice : 0;
      const totalPremium = premiumPerOz * item.qty * item.weight;

      return {
        ...item,
        purchaseLocation: item.purchaseLocation || "Unknown",
        storageLocation: item.storageLocation || "Unknown",
        spotPriceAtPurchase: spotPrice,
        premiumPerOz,
        totalPremium,
        isCollectable: item.isCollectable !== undefined ? item.isCollectable : false
      };
    }
    // Ensure all items have required properties
    return {
      ...item,
      storageLocation: item.storageLocation || "Unknown",
      isCollectable: item.isCollectable !== undefined ? item.isCollectable : false
    };
  });
};

/**
 * Renders the main inventory table with all current display settings
 * 
 * This is the primary display function that:
 * - Applies current search filters to inventory data
 * - Sorts data according to user-selected column and direction
 * - Implements pagination to show only current page items
 * - Generates HTML table rows with interactive elements
 * - Updates sort indicators in column headers
 * - Refreshes pagination controls and summary totals
 * - Re-establishes column resizing functionality
 * 
 * Called whenever inventory data changes or display settings update
 * 
 * @returns {void} Updates DOM elements with fresh inventory display
 * 
 * @example
 * // Refresh table after adding new item
 * inventory.push(newItem);
 * renderTable();
 * 
 * // Update display after search
 * searchQuery = 'silver';
 * renderTable();
 */
const renderTable = () => {
  const filteredInventory = filterInventory();
  const sortedInventory = sortInventory(filteredInventory);
  const totalPages = calculateTotalPages(sortedInventory);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedInventory.length);

  const rows = [];

  for (let i = startIndex; i < endIndex; i++) {
    const item = sortedInventory[i];
    const originalIdx = inventory.indexOf(item);

    rows.push(`
    <tr>
    <td>${i + 1}</td>
    <td>${item.metal || 'Silver'}</td>
    <td>${item.qty}</td>
    <td>${item.type}</td>
    <td class="clickable-name" onclick="editItem(${originalIdx})" title="Click to edit" tabindex="0" role="button" aria-label="Edit ${item.name.replace(/[<>"']/g, '')}" onkeydown="if(event.key==='Enter'||event.key===' ')editItem(${originalIdx})">${item.name.replace(/[<>"']/g, '')}</td>
    <td>${parseFloat(item.weight).toFixed(2)}</td>
    <td>${formatDollar(item.price)}</td>
    <td>${item.isCollectable ? 'N/A' : (item.spotPriceAtPurchase > 0 ? formatDollar(item.spotPriceAtPurchase) : 'N/A')}</td>
    <td style="color: ${item.isCollectable ? 'var(--text-muted)' : (item.premiumPerOz > 0 ? 'var(--warning)' : 'inherit')}">${item.isCollectable ? 'N/A' : formatDollar(item.premiumPerOz)}</td>
    <td style="color: ${item.isCollectable ? 'var(--text-muted)' : (item.totalPremium > 0 ? 'var(--warning)' : 'inherit')}">${item.isCollectable ? 'N/A' : formatDollar(item.totalPremium)}</td>
    <td>${item.purchaseLocation}</td>
    <td>${item.storageLocation || 'Unknown'}</td>
    <td>${item.date}</td>
    <td class="checkbox-cell">
    <input type="checkbox" ${item.isCollectable ? 'checked' : ''} onchange="toggleCollectable(${originalIdx}, this)" class="collectable-checkbox" aria-label="Mark ${item.name.replace(/[<>"']/g, '')} as collectable" title="Mark as collectable">
    </td>
    <td class="delete-cell"><button class="btn danger" onclick="deleteItem(${originalIdx})" aria-label="Delete item">&times;</button></td>
    </tr>
    `);
  }

  elements.inventoryTable.innerHTML = rows.join('');

  // Update sort indicators
  const headers = document.querySelectorAll('#inventoryTable th');
  headers.forEach(header => {
    const indicator = header.querySelector('.sort-indicator');
    if (indicator) header.removeChild(indicator);
  });

  if (sortColumn !== null && sortColumn < headers.length) {
    const header = headers[sortColumn];
    const indicator = document.createElement('span');
    indicator.className = 'sort-indicator';
    indicator.textContent = sortDirection === 'asc' ? '↑' : '↓';
    header.appendChild(indicator);
  }

  renderPagination(sortedInventory);
  updateSummary();
  
  // Re-setup column resizing after table re-render
  setupColumnResizing();
};

/**
 * Calculates and updates all financial summary displays across the application
 * 
 * This comprehensive function:
 * - Processes entire inventory to calculate metal-specific totals
 * - Handles collectable vs non-collectable item calculations separately
 * - Updates DOM elements for all metal types (Silver, Gold, Platinum, Palladium)
 * - Calculates weighted averages for prices and premiums
 * - Formats currency and profit/loss values with appropriate styling
 * - Handles edge cases like division by zero and missing data
 * 
 * Key calculations performed:
 * - Total items, weight, purchase price, current value
 * - Average prices per ounce (overall, collectable, non-collectable)
 * - Premium analysis and profit/loss calculations
 * - Current market value based on spot prices
 * 
 * @returns {void} Updates DOM elements in totals cards and summary sections
 * 
 * @example
 * // Recalculate totals after inventory change
 * inventory[0].price = 150.00;
 * saveInventory();
 * updateSummary(); // Refreshes all totals displays
 */
const updateSummary = () => {
  /**
   * Calculates financial metrics for specified metal type
   * 
   * @param {string} metal - Metal type to calculate ('Silver', 'Gold', 'Platinum', or 'Palladium')
   * @returns {Object} Calculated metrics
   */
  const calculateTotals = (metal) => {
    let totalItems = 0;
    let totalWeight = 0;
    let currentSpotValue = 0;
    let totalPurchased = 0;
    let totalPremium = 0;
    let lossProfit = 0;

    // Track collectable and non-collectable metrics separately
    let collectableWeight = 0;
    let collectableValue = 0;
    let nonCollectableWeight = 0;
    let nonCollectableValue = 0;

    for (const item of inventory) {
      if (item.metal === metal) {
        totalItems += Number(item.qty);

        // Total Weight calculation (for both regular and collectible items)
        const itemWeight = Number(item.qty) * parseFloat(item.weight);
        totalWeight += itemWeight;

        // Current Value calculation
        if (item.isCollectable) {
          // For collectible items: Current Value = Current spot price × weight
          const currentSpot = spotPrices[item.metal.toLowerCase()];
          currentSpotValue += currentSpot * itemWeight;

          // Track collectable metrics
          collectableWeight += itemWeight;
          collectableValue += Number(item.qty) * parseFloat(item.price);
        } else {
          // For regular items: Current Value = Weight × Current Spot Price
          const currentSpot = spotPrices[item.metal.toLowerCase()];
          currentSpotValue += currentSpot * itemWeight;

          // Track non-collectable metrics
          nonCollectableWeight += itemWeight;
          nonCollectableValue += Number(item.qty) * parseFloat(item.price);
        }

        // Total Purchase Price calculation (for both regular and collectible items)
        totalPurchased += Number(item.qty) * parseFloat(item.price);

        // Premium Paid calculation
        if (!item.isCollectable) {
          // For regular items: Premium Paid = (Purchase Price per oz - Spot Price at Purchase) × Weight
          const pricePerOz = item.price / item.weight;
          const premiumPerOz = pricePerOz - item.spotPriceAtPurchase;
          totalPremium += premiumPerOz * itemWeight;
        }
        // For collectible items: Premium Paid = N/A

        // Loss/Profit calculation
        if (!item.isCollectable) {
          // For regular items: Loss/Profit = Current Value - Purchase Price
          const currentSpot = spotPrices[item.metal.toLowerCase()];
          const currentValue = currentSpot * itemWeight;
          const purchaseValue = item.price * item.qty;
          lossProfit += currentValue - purchaseValue;
        }
        // For collectible items: Loss/Profit = Omitted from calculation
      }
    }

    // Calculate averages
    const avgPrice = totalWeight > 0 ? totalPurchased / totalWeight : 0;
    const avgPremium = totalWeight > 0 ? totalPremium / totalWeight : 0;

    // Calculate collectable/non-collectable averages
    const avgCollectablePrice = collectableWeight > 0 ? collectableValue / collectableWeight : 0;
    const avgNonCollectablePrice = nonCollectableWeight > 0 ? nonCollectableValue / nonCollectableWeight : 0;

    return { 
      totalItems, 
      totalWeight, 
      currentSpotValue, 
      totalPurchased, 
      totalPremium,
      lossProfit,
      avgPrice,
      avgPremium,
      avgCollectablePrice,
      avgNonCollectablePrice,
      collectableWeight,      // Needed for proper weighted averaging
      nonCollectableWeight,   // Needed for proper weighted averaging
      collectableValue,       // CRITICAL: Now returning these values
      nonCollectableValue     // CRITICAL: Now returning these values
    };
  };

  // Calculate totals for each metal
  const metalTotals = {};
  Object.values(METALS).forEach(metalConfig => {
    metalTotals[metalConfig.key] = calculateTotals(metalConfig.name);
  });

  // Update DOM elements with weight rounded to 2 decimal places
  Object.values(METALS).forEach(metalConfig => {
    const totals = metalTotals[metalConfig.key];
    const metalKey = metalConfig.key;

    elements.totals[metalKey].items.textContent = totals.totalItems;
    elements.totals[metalKey].weight.textContent = totals.totalWeight.toFixed(2);
    elements.totals[metalKey].value.innerHTML = formatDollar(totals.currentSpotValue);
    elements.totals[metalKey].purchased.innerHTML = formatDollar(totals.totalPurchased);
    elements.totals[metalKey].premium.innerHTML = formatDollar(totals.totalPremium);
    elements.totals[metalKey].lossProfit.innerHTML = formatLossProfit(totals.lossProfit);
    elements.totals[metalKey].avgPrice.innerHTML = formatDollar(totals.avgPrice);
    elements.totals[metalKey].avgPremium.innerHTML = formatDollar(totals.avgPremium);
    // Add the new collectable/non-collectable averages
    elements.totals[metalKey].avgCollectablePrice.innerHTML = formatDollar(totals.avgCollectablePrice);
    elements.totals[metalKey].avgNonCollectablePrice.innerHTML = formatDollar(totals.avgNonCollectablePrice);
  });

  // Calculate combined totals for all metals
  const allTotals = {
    totalItems: 0,
    totalWeight: 0,
    currentSpotValue: 0,
    totalPurchased: 0,
    totalPremium: 0,
    lossProfit: 0,
    collectableWeight: 0,
    collectableValue: 0,
    nonCollectableWeight: 0,
    nonCollectableValue: 0
  };

  Object.values(metalTotals).forEach(totals => {
    allTotals.totalItems += totals.totalItems;
    allTotals.totalWeight += totals.totalWeight;
    allTotals.currentSpotValue += totals.currentSpotValue;
    allTotals.totalPurchased += totals.totalPurchased;
    allTotals.totalPremium += totals.totalPremium;
    allTotals.lossProfit += totals.lossProfit;
    allTotals.collectableWeight += totals.collectableWeight;
    allTotals.collectableValue += totals.collectableValue;
    allTotals.nonCollectableWeight += totals.nonCollectableWeight;
    allTotals.nonCollectableValue += totals.nonCollectableValue;
  });

  // Calculate weighted averages for collectable and non-collectable prices
  const avgCollectablePriceAll = allTotals.collectableWeight > 0 ? 
    allTotals.collectableValue / allTotals.collectableWeight : 0;
  const avgNonCollectablePriceAll = allTotals.nonCollectableWeight > 0 ? 
    allTotals.nonCollectableValue / allTotals.nonCollectableWeight : 0;

  // Update "All" totals display if elements exist
  if (elements.totals.all.items.textContent !== undefined) {
    elements.totals.all.items.textContent = allTotals.totalItems;
    elements.totals.all.weight.textContent = allTotals.totalWeight.toFixed(2);
    elements.totals.all.value.innerHTML = formatDollar(allTotals.currentSpotValue);
    elements.totals.all.purchased.innerHTML = formatDollar(allTotals.totalPurchased);
    elements.totals.all.premium.innerHTML = formatDollar(allTotals.totalPremium);
    elements.totals.all.lossProfit.innerHTML = formatLossProfit(allTotals.lossProfit);
    elements.totals.all.avgPrice.innerHTML = formatDollar(allTotals.totalPurchased / allTotals.totalWeight || 0);
    elements.totals.all.avgPremium.innerHTML = formatDollar(allTotals.totalPremium / allTotals.totalWeight || 0);
    elements.totals.all.avgCollectablePrice.innerHTML = formatDollar(avgCollectablePriceAll);
    elements.totals.all.avgNonCollectablePrice.innerHTML = formatDollar(avgNonCollectablePriceAll);
  }
};

/**
 * Deletes inventory item at specified index after confirmation
 * 
 * @param {number} idx - Index of item to delete
 */
const deleteItem = (idx) => {
  if (confirm("Delete this item?")) {
    inventory.splice(idx, 1);
    saveInventory();
    renderTable();
  }
};

/**
 * Prepares and displays edit modal for specified inventory item
 * 
 * @param {number} idx - Index of item to edit
 */
const editItem = (idx) => {
  editingIndex = idx;
  const item = inventory[idx];

  // Populate edit form
  elements.editMetal.value = item.metal;
  elements.editName.value = item.name;
  elements.editQty.value = item.qty;
  elements.editType.value = item.type;
  elements.editWeight.value = item.weight;
  elements.editPrice.value = item.price;
  elements.editPurchaseLocation.value = item.purchaseLocation;
  elements.editStorageLocation.value = item.storageLocation || '';
  elements.editDate.value = item.date;
  elements.editSpotPrice.value = item.spotPriceAtPurchase;
  document.getElementById("editCollectable").checked = item.isCollectable;

  // Show modal
  elements.editModal.style.display = 'flex';
};

/**
 * Toggles collectable status for inventory item
 * 
 * @param {number} idx - Index of item to update
 * @param {HTMLInputElement} checkbox - Checkbox element triggering the change
 */
const toggleCollectable = (idx, checkbox) => {
  const item = inventory[idx];
  const wasCollectable = item.isCollectable;
  const isCollectable = checkbox.checked;

  // If toggling from collectable to non-collectable
  if (wasCollectable && !isCollectable) {
    // Use the stored spotPriceAtPurchase if available and valid
    let spotPrice = item.spotPriceAtPurchase;

    // If spotPriceAtPurchase is invalid (<= 0), use current spot price
    if (spotPrice <= 0) {
      spotPrice = spotPrices[item.metal.toLowerCase()];
      // Update spotPriceAtPurchase for future reference
      item.spotPriceAtPurchase = spotPrice;
    }

    // Recalculate premium
    const pricePerOz = item.price / item.weight;
    item.premiumPerOz = pricePerOz - spotPrice;
    item.totalPremium = item.premiumPerOz * item.qty * item.weight;
  } 
  // If toggling from non-collectable to collectable
  else if (!wasCollectable && isCollectable) {
    // Preserve the current spotPriceAtPurchase (it should already be set)
    // No need to change it, just make sure we keep it

    // Set premiums to 0 for collectable items
    item.premiumPerOz = 0;
    item.totalPremium = 0;
  }

  // Update collectable status
  item.isCollectable = isCollectable;

  saveInventory();
  renderTable();
};

// =============================================================================
// IMPORT/EXPORT FUNCTIONS
// =============================================================================

/**
 * Imports inventory data from CSV file with comprehensive validation and error handling
 * 
 * This function:
 * - Uses PapaParse library for robust CSV parsing
 * - Maps CSV columns to inventory object properties
 * - Validates data types and required fields
 * - Handles various date formats automatically
 * - Calculates premiums and totals for imported items
 * - Provides user feedback on import success/failure
 * - Offers replacement or append options (currently replacement only)
 * 
 * Supported CSV columns:
 * - Metal, Name, Qty, Type, Weight(oz), Purchase Price
 * - Purchase Location, Storage Location, Date, Collectable
 * - Spot Price ($/oz) for historical premium calculations
 * 
 * @param {File} file - CSV file selected by user through file input
 * @returns {void} Updates inventory array if import successful
 * 
 * @example
 * // Typically called from file input change event
 * const fileInput = document.getElementById('importCsvFile');
 * fileInput.addEventListener('change', (e) => {
 *   if (e.target.files.length > 0) {
 *     importCsv(e.target.files[0]);
 *   }
 * });
 */
const importCsv = (file) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      let imported = [];
      let skipped = 0;

      for (let row of results.data) {
        const metal = row['Metal'] || 'Silver';
        const name = row['Name'] || row['name'];
        const qty = parseInt(row['Qty'] || row['qty'] || 1, 10);
        const type = row['Type'] || row['type'] || 'Other';
        const weight = parseFloat(row['Weight(oz)'] || row['weight']);
        const priceStr = row['Purchase Price'] || row['price'];
        const price = parseFloat(typeof priceStr === "string" ? priceStr.replace(/[^0-9.-]+/g,"") : priceStr);
        const purchaseLocation = row['Purchase Location'] || "Unknown";
        const storageLocation = row['Storage Location'] || "Unknown";
        const date = parseDate(row['Date']); // Using the new date parser

        // Get collectable status
        const isCollectable = row['Collectable'] === 'Yes' || row['Collectable'] === 'true' || row['isCollectable'] === 'true';

        // Get spot price from CSV if available
        let spotPriceAtPurchase;
        if (row['Spot Price ($/oz)']) {
          // Extract numeric value from formatted string like "$1,234.56"
          const spotStr = row['Spot Price ($/oz)'].toString();
          spotPriceAtPurchase = parseFloat(spotStr.replace(/[^0-9.-]+/g, ""));
        } else if (row['spotPriceAtPurchase']) {
          spotPriceAtPurchase = parseFloat(row['spotPriceAtPurchase']);
        } else {
          // Fall back to current spot price if not in CSV and not collectable
          const metalKey = metal.toLowerCase();
          spotPriceAtPurchase = isCollectable ? 0 : spotPrices[metalKey];
        }

        // Calculate premium per ounce (only for non-collectible items)
        let premiumPerOz = 0;
        let totalPremium = 0;

        if (!isCollectable) {
          const pricePerOz = price / weight;
          premiumPerOz = pricePerOz - spotPriceAtPurchase;
          totalPremium = premiumPerOz * qty * weight;
        }

        if (!name || isNaN(qty) || isNaN(weight) || isNaN(price) || qty < 1 || !Number.isInteger(qty)) {
          skipped++;
          continue;
        }

        imported.push({ 
          metal, 
          name, 
          qty, 
          type, 
          weight, 
          price, 
          date,
          purchaseLocation,
          storageLocation,
          spotPriceAtPurchase,
          premiumPerOz,
          totalPremium,
          isCollectable
        });
      }

      if (imported.length === 0) return alert("No valid items to import.");

      let msg = "Replace current inventory with imported file?";
      if (skipped > 0) msg += `\n(Skipped ${skipped} invalid rows)`;

      if (confirm(msg)) {
        inventory = imported;
        saveInventory();
        renderTable();
      }

      this.value = "";
    }
  });
};

/**
 * Exports current inventory to CSV format
 */
const exportCsv = () => {
  const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,'');
  const headers = ["Metal","Name","Qty","Type","Weight(oz)","Purchase Price","Spot Price ($/oz)","Premium ($/oz)","Total Premium","Purchase Location","Storage Location","Date","Collectable"];

  // Sort inventory by date (newest first) for export
  const sortedInventory = sortInventoryByDateNewestFirst();

  const rows = [];

  for (const i of sortedInventory) {
    // For collectable items, use current spot price (at time of export)
    // This ensures the value is preserved if the item is later changed back to standard
    const exportSpotPrice = i.isCollectable ? 
      spotPrices[i.metal.toLowerCase()] : 
      i.spotPriceAtPurchase;

    rows.push([
      i.metal || 'Silver',
      i.name,
      i.qty,
      i.type,
      parseFloat(i.weight).toFixed(4),
      formatDollar(i.price),
      exportSpotPrice > 0 ? formatDollar(exportSpotPrice) : 'N/A',
      i.isCollectable ? 'N/A' : formatDollar(i.premiumPerOz),
      i.isCollectable ? 'N/A' : formatDollar(i.totalPremium),
      i.purchaseLocation,
      i.storageLocation || 'Unknown',
      i.date,
      i.isCollectable ? 'Yes' : 'No'
    ]);
  }

  const csv = Papa.unparse([headers, ...rows]);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `metal_inventory_${timestamp}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

/**
 * Imports inventory data from JSON file
 * 
 * @param {File} file - JSON file to import
 */
const importJson = (file) => {
  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);

      // Validate data structure
      if (!Array.isArray(data)) {
        return alert("Invalid JSON format. Expected an array of inventory items.");
      }

      // Process each item
      const imported = [];
      let skipped = 0;

      for (const item of data) {
        // Basic validation
        if (!item.name || !item.metal || isNaN(item.qty) || isNaN(item.weight) || isNaN(item.price)) {
          skipped++;
          continue;
        }

        // Ensure required fields with defaults
        const processedItem = {
          metal: item.metal || 'Silver',
          name: item.name,
          qty: parseInt(item.qty, 10),
          type: item.type || 'Other',
          weight: parseFloat(item.weight),
          price: parseFloat(item.price),
          date: parseDate(item.date || todayStr()),
          purchaseLocation: item.purchaseLocation || "Unknown",
          storageLocation: item.storageLocation || "Unknown",
          spotPriceAtPurchase: item.spotPriceAtPurchase || spotPrices[item.metal.toLowerCase()],
          isCollectable: item.isCollectable === true,
          premiumPerOz: item.premiumPerOz || 0,
          totalPremium: item.totalPremium || 0
        };

        // Recalculate premium if needed
        if (!processedItem.isCollectable && processedItem.spotPriceAtPurchase > 0) {
          const pricePerOz = processedItem.price / processedItem.weight;
          processedItem.premiumPerOz = pricePerOz - processedItem.spotPriceAtPurchase;
          processedItem.totalPremium = processedItem.premiumPerOz * processedItem.qty * processedItem.weight;
        }

        imported.push(processedItem);
      }

      if (imported.length === 0) {
        return alert("No valid items found in JSON file.");
      }

      let msg = `Import ${imported.length} items?`;
      if (skipped > 0) {
        msg += `\n(Skipped ${skipped} invalid items)`;
      }

      if (confirm(msg)) {
        inventory = imported;
        saveInventory();
        renderTable();
      }
    } catch (error) {
      alert("Error parsing JSON file: " + error.message);
    }
  };

  reader.readAsText(file);
};

/**
 * Exports current inventory to JSON format
 */
const exportJson = () => {
  const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,'');

  // Sort inventory by date (newest first) for export
  const sortedInventory = sortInventoryByDateNewestFirst();

  const exportData = sortedInventory.map(item => ({
    metal: item.metal,
    name: item.name,
    qty: item.qty,
    type: item.type,
    weight: item.weight,
    price: item.price,
    date: item.date,
    purchaseLocation: item.purchaseLocation,
    storageLocation: item.storageLocation,
    spotPriceAtPurchase: item.spotPriceAtPurchase,
    isCollectable: item.isCollectable,
    premiumPerOz: item.premiumPerOz,
    totalPremium: item.totalPremium
  }));

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `metal_inventory_${timestamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

/**
 * Imports inventory data from Excel file
 * 
 * @param {File} file - Excel file to import
 */
const importExcel = (file) => {
  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Get first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Process data
      const imported = [];
      let skipped = 0;

      for (const row of jsonData) {
        const metal = row['Metal'] || 'Silver';
        const name = row['Name'] || row['name'];
        const qty = parseInt(row['Qty'] || row['qty'] || 1, 10);
        const type = row['Type'] || row['type'] || 'Other';
        const weight = parseFloat(row['Weight(oz)'] || row['weight']);
        const priceStr = row['Purchase Price'] || row['price'];
        const price = parseFloat(typeof priceStr === "string" ? priceStr.replace(/[^0-9.-]+/g,"") : priceStr);
        const purchaseLocation = row['Purchase Location'] || "Unknown";
        const storageLocation = row['Storage Location'] || "Unknown";
        const date = parseDate(row['Date']); // Using the new date parser

        // Get collectable status
        const isCollectable = row['Collectable'] === 'Yes' || row['Collectable'] === 'true' || row['isCollectable'] === 'true';

        // Get spot price from Excel if available
        let spotPriceAtPurchase;
        if (row['Spot Price ($/oz)']) {
          // Extract numeric value from formatted string like "$1,234.56"
          const spotStr = row['Spot Price ($/oz)'].toString();
          spotPriceAtPurchase = parseFloat(spotStr.replace(/[^0-9.-]+/g, ""));
        } else if (row['spotPriceAtPurchase']) {
          spotPriceAtPurchase = parseFloat(row['spotPriceAtPurchase']);
        } else {
          // Fall back to current spot price if not in Excel and not collectable
          const metalKey = metal.toLowerCase();
          spotPriceAtPurchase = isCollectable ? 0 : spotPrices[metalKey];
        }

        // Calculate premium per ounce (only for non-collectible items)
        let premiumPerOz = 0;
        let totalPremium = 0;

        if (!isCollectable) {
          const pricePerOz = price / weight;
          premiumPerOz = pricePerOz - spotPriceAtPurchase;
          totalPremium = premiumPerOz * qty * weight;
        }

        if (!name || isNaN(qty) || isNaN(weight) || isNaN(price) || qty < 1 || !Number.isInteger(qty)) {
          skipped++;
          continue;
        }

        imported.push({ 
          metal, 
          name, 
          qty, 
          type, 
          weight, 
          price, 
          date,
          purchaseLocation,
          storageLocation,
          spotPriceAtPurchase,
          premiumPerOz,
          totalPremium,
          isCollectable
        });
      }

      if (imported.length === 0) return alert("No valid items to import.");

      let msg = "Replace current inventory with imported file?";
      if (skipped > 0) msg += `\n(Skipped ${skipped} invalid rows)`;

      if (confirm(msg)) {
        inventory = imported;
        saveInventory();
        renderTable();
      }
    } catch (error) {
      alert("Error importing Excel file: " + error.message);
    }
  };

  reader.readAsArrayBuffer(file);
};

/**
 * Exports current inventory to Excel format
 */
const exportExcel = () => {
  const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,'');

  // Sort inventory by date (newest first) for export
  const sortedInventory = sortInventoryByDateNewestFirst();

  // Create worksheet data
  const wsData = [
    ["Metal", "Name", "Qty", "Type", "Weight(oz)", "Purchase Price", "Spot Price ($/oz)", 
     "Premium ($/oz)", "Total Premium", "Purchase Location", "Storage Location", "Date", "Collectable"]
  ];

  for (const i of sortedInventory) {
    // For collectable items, use current spot price (at time of export)
    const exportSpotPrice = i.isCollectable ? 
      spotPrices[i.metal.toLowerCase()] : 
      i.spotPriceAtPurchase;

    wsData.push([
      i.metal || 'Silver',
      i.name,
      i.qty,
      i.type,
      parseFloat(i.weight).toFixed(4),
      i.price,
      exportSpotPrice,
      i.isCollectable ? null : i.premiumPerOz,
      i.isCollectable ? null : i.totalPremium,
      i.purchaseLocation,
      i.storageLocation || 'Unknown',
      i.date,
      i.isCollectable ? 'Yes' : 'No'
    ]);
  }

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Inventory");

  // Export
  XLSX.writeFile(wb, `metal_inventory_${timestamp}.xlsx`);
};

/**
 * Exports current inventory to PDF format
 */
const exportPdf = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Sort inventory by date (newest first) for export
  const sortedInventory = sortInventoryByDateNewestFirst();

  // Add title
  doc.setFontSize(16);
  doc.text("Precious Metals Inventory", 14, 15);

  // Add date
  doc.setFontSize(10);
  doc.text(`Exported: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 22);

  // Prepare table data
  const tableData = sortedInventory.map(item => [
    item.metal,
    item.name,
    item.qty,
    item.type,
    parseFloat(item.weight).toFixed(2),
    formatDollar(item.price),
    item.isCollectable ? 'N/A' : formatDollar(item.spotPriceAtPurchase),
    item.isCollectable ? 'N/A' : formatDollar(item.premiumPerOz),
    item.isCollectable ? 'N/A' : formatDollar(item.totalPremium),
    item.purchaseLocation,
    item.storageLocation || 'Unknown',
    item.date,
    item.isCollectable ? 'Yes' : 'No'
  ]);

  // Add table
  doc.autoTable({
    head: [['Metal', 'Name', 'Qty', 'Type', 'Weight(oz)', 'Purchase Price', 
            'Spot Price ($/oz)', 'Premium ($/oz)', 'Total Premium', 
            'Purchase Location', 'Storage Location', 'Date', 'Collectable']],
    body: tableData,
    startY: 30,
    theme: 'striped',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [25, 118, 210] }
  });

  // Add totals
  const finalY = doc.lastAutoTable.finalY || 30;

  // Add totals section
  doc.setFontSize(12);
  doc.text("Totals", 14, finalY + 10);

  // Silver Totals
  doc.setFontSize(10);
  doc.text("Silver:", 14, finalY + 16);
  doc.text(`Total Items: ${elements.totals.silver.items.textContent}`, 25, finalY + 22);
  doc.text(`Total Weight: ${elements.totals.silver.weight.textContent} oz`, 25, finalY + 28);
  doc.text(`Purchase Price: ${elements.totals.silver.purchased.textContent}`, 25, finalY + 34);
  doc.text(`Current Value: ${elements.totals.silver.value.textContent}`, 25, finalY + 40);

  // Gold Totals
  doc.text("Gold:", 100, finalY + 16);
  doc.text(`Total Items: ${elements.totals.gold.items.textContent}`, 111, finalY + 22);
  doc.text(`Total Weight: ${elements.totals.gold.weight.textContent} oz`, 111, finalY + 28);
  doc.text(`Purchase Price: ${elements.totals.gold.purchased.textContent}`, 111, finalY + 34);
  doc.text(`Current Value: ${elements.totals.gold.value.textContent}`, 111, finalY + 40);

  // Platinum Totals
  doc.text("Platinum:", 14, finalY + 46);
  doc.text(`Total Items: ${elements.totals.platinum.items.textContent}`, 25, finalY + 52);
  doc.text(`Total Weight: ${elements.totals.platinum.weight.textContent} oz`, 25, finalY + 58);
  doc.text(`Purchase Price: ${elements.totals.platinum.purchased.textContent}`, 25, finalY + 64);
  doc.text(`Current Value: ${elements.totals.platinum.value.textContent}`, 25, finalY + 70);

  // Palladium Totals
  doc.text("Palladium:", 100, finalY + 46);
  doc.text(`Total Items: ${elements.totals.palladium.items.textContent}`, 111, finalY + 52);
  doc.text(`Total Weight: ${elements.totals.palladium.weight.textContent} oz`, 111, finalY + 58);
  doc.text(`Purchase Price: ${elements.totals.palladium.purchased.textContent}`, 111, finalY + 64);
  doc.text(`Current Value: ${elements.totals.palladium.value.textContent}`, 111, finalY + 70);

  // All Totals (only if elements exist)
  if (elements.totals.all.items.textContent !== undefined) {
    doc.setFontSize(11);
    doc.text("All Metals:", 14, finalY + 76);
    doc.text(`Total Items: ${elements.totals.all.items.textContent}`, 25, finalY + 82);
    doc.text(`Total Weight: ${elements.totals.all.weight.textContent} oz`, 25, finalY + 88);
    doc.text(`Purchase Price: ${elements.totals.all.purchased.textContent}`, 25, finalY + 94);
    doc.text(`Current Value: ${elements.totals.all.value.textContent}`, 25, finalY + 100);
  }

  // Save PDF
  doc.save(`metal_inventory_${new Date().toISOString().slice(0,10).replace(/-/g,'')}.pdf`);
};

/**
 * Exports current inventory to HTML format with embedded styles
 */
const exportHtml = () => {
  const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,'');

  // Sort inventory by date (newest first) for export
  const sortedInventory = sortInventoryByDateNewestFirst();

  // Create HTML content with inline styles for portability
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Precious Metals Inventory</title>
  
</head>
<style>
    body {
      font-family: 'Segoe UI', sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }
    h1 {
      text-align: center;
      color: #0d6efd;
      margin-bottom: 10px;
    }
    .export-date {
      text-align: center;
      color: #6c757d;
      margin-bottom: 25px;
      font-size: 0.9rem;
    }
    .totals-section {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 25px;
      border: 1px solid #dee2e6;
    }
    .totals-title {
      font-weight: 600;
      color: #0d6efd;
      margin-bottom: 10px;
      text-align: center;
      font-size: 1.1rem;
    }
    .totals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
    }
    .total-card {
      background: white;
      border-radius: 6px;
      padding: 12px;
      border: 1px solid #e9ecef;
    }
    .total-item {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      border-bottom: 1px dashed #dee2e6;
    }
    .total-item:last-child {
      border-bottom: none;
    }
    .total-label {
      font-weight: 500;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
    }
    th {
      background-color: #e9ecef;
      color: #212529;
      font-weight: 600;
      padding: 10px;
      text-align: left;
    }
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #dee2e6;
    }
    tr:nth-child(even) {
      background-color: #f8f9fa;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #6c757d;
      font-size: 0.85rem;
      border-top: 1px solid #dee2e6;
      padding-top: 15px;
    }
  </style>
    
<body>
  <h1>Precious Metals Inventory</h1>
  <div class="export-date">Exported: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>

  <div class="totals-section">
    <div class="totals-title">Inventory Totals</div>
    <div class="totals-grid">
      <div class="total-card">
        <div style="font-weight: 600; margin-bottom: 12px; color: var(--silver, #a8a8a8);">Silver Totals</div>
        <div class="total-item">
          <span class="total-label">Total Items:</span>
          <span class="total-value">${elements.totals.silver.items.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Weight:</span>
          <span class="total-value">${elements.totals.silver.weight.textContent} oz</span>
        </div>
        <div class="total-item">
          <span class="total-label">Purchase Price:</span>
          <span class="total-value">${elements.totals.silver.purchased.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Current Value:</span>
          <span class="total-value">${elements.totals.silver.value.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Price (oz):</span>
          <span class="total-value">${elements.totals.silver.avgPrice.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Collectable Price (oz):</span>
          <span class="total-value">${elements.totals.silver.avgCollectablePrice.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Non-collectable Price (oz):</span>
          <span class="total-value">${elements.totals.silver.avgNonCollectablePrice.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Premium (oz):</span>
          <span class="total-value">${elements.totals.silver.avgPremium.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Premium Paid:</span>
          <span class="total-value">${elements.totals.silver.premium.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Loss/Profit:</span>
          <span class="total-value">${elements.totals.silver.lossProfit.textContent}</span>
        </div>
      </div>

      <div class="total-card">
        <div style="font-weight: 600; margin-bottom: 12px; color: var(--gold, #ffd700);">Gold Totals</div>
        <div class="total-item">
          <span class="total-label">Total Items:</span>
          <span class="total-value">${elements.totals.gold.items.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Weight:</span>
          <span class="total-value">${elements.totals.gold.weight.textContent} oz</span>
        </div>
        <div class="total-item">
          <span class="total-label">Purchase Price:</span>
          <span class="total-value">${elements.totals.gold.purchased.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Current Value:</span>
          <span class="total-value">${elements.totals.gold.value.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Price (oz):</span>
          <span class="total-value">${elements.totals.gold.avgPrice.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Collectable Price (oz):</span>
          <span class="total-value">${elements.totals.gold.avgCollectablePrice.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Non-collectable Price (oz):</span>
          <span class="total-value">${elements.totals.gold.avgNonCollectablePrice.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Premium (oz):</span>
          <span class="total-value">${elements.totals.gold.avgPremium.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Premium Paid:</span>
          <span class="total-value">${elements.totals.gold.premium.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Loss/Profit:</span>
          <span class="total-value">${elements.totals.gold.lossProfit.textContent}</span>
        </div>
      </div>

      <div class="total-card">
        <div style="font-weight: 600; margin-bottom: 12px; color: var(--platinum, #e5e4e2);">Platinum Totals</div>
        <div class="total-item">
          <span class="total-label">Total Items:</span>
          <span class="total-value">${elements.totals.platinum.items.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Weight:</span>
          <span class="total-value">${elements.totals.platinum.weight.textContent} oz</span>
        </div>
        <div class="total-item">
          <span class="total-label">Purchase Price:</span>
          <span class="total-value">${elements.totals.platinum.purchased.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Current Value:</span>
          <span class="total-value">${elements.totals.platinum.value.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Price (oz):</span>
          <span class="total-value">${elements.totals.platinum.avgPrice.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Collectable Price (oz):</span>
          <span class="total-value">${elements.totals.platinum.avgCollectablePrice.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Non-collectable Price (oz):</span>
          <span class="total-value">${elements.totals.platinum.avgNonCollectablePrice.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Premium (oz):</span>
          <span class="total-value">${elements.totals.platinum.avgPremium.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Premium Paid:</span>
          <span class="total-value">${elements.totals.platinum.premium.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Loss/Profit:</span>
          <span class="total-value">${elements.totals.platinum.lossProfit.textContent}</span>
        </div>
      </div>

      <div class="total-card">
        <div style="font-weight: 600; margin-bottom: 12px; color: var(--palladium, #c0c0ee);">Palladium Totals</div>
        <div class="total-item">
          <span class="total-label">Total Items:</span>
          <span class="total-value">${elements.totals.palladium.items.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Weight:</span>
          <span class="total-value">${elements.totals.palladium.weight.textContent} oz</span>
        </div>
        <div class="total-item">
          <span class="total-label">Purchase Price:</span>
          <span class="total-value">${elements.totals.palladium.purchased.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Current Value:</span>
          <span class="total-value">${elements.totals.palladium.value.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Price (oz):</span>
          <span class="total-value">${elements.totals.palladium.avgPrice.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Collectable Price (oz):</span>
          <span class="total-value">${elements.totals.palladium.avgCollectablePrice.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Non-collectable Price (oz):</span>
          <span class="total-value">${elements.totals.palladium.avgNonCollectablePrice.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Average Premium (oz):</span>
          <span class="total-value">${elements.totals.palladium.avgPremium.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Premium Paid:</span>
          <span class="total-value">${elements.totals.palladium.premium.textContent}</span>
        </div>
        <div class="total-item">
          <span class="total-label">Total Loss/Profit:</span>
          <span class="total-value">${elements.totals.palladium.lossProfit.textContent}</span>
        </div>
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Metal</th>
        <th>Name</th>
        <th>Qty</th>
        <th>Type</th>
        <th>Weight (oz)</th>
        <th>Purchase Price</th>
        <th>Spot Price ($/oz)</th>
        <th>Premium ($/oz)</th>
        <th>Total Premium</th>
        <th>Purchase Location</th>
        <th>Storage Location</th>
        <th>Date</th>
        <th>Collectable</th>
      </tr>
    </thead>
    <tbody>
      ${sortedInventory.map(item => `
      <tr>
        <td>${item.metal}</td>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.type}</td>
        <td>${parseFloat(item.weight).toFixed(2)}</td>
        <td>${formatDollar(item.price)}</td>
        <td>${item.isCollectable ? 'N/A' : formatDollar(item.spotPriceAtPurchase)}</td>
        <td>${item.isCollectable ? 'N/A' : formatDollar(item.premiumPerOz)}</td>
        <td>${item.isCollectable ? 'N/A' : formatDollar(item.totalPremium)}</td>
        <td>${item.purchaseLocation}</td>
        <td>${item.storageLocation || 'Unknown'}</td>
        <td>${item.date}</td>
        <td>${item.isCollectable ? 'Yes' : 'No'}</td>
      </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    Precious Metals Tool Inventory Report
  </div>
</body>
</html>
  `;

  // Create and download HTML file
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `metal_inventory_${timestamp}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

// =============================================================================

================================================================================

## 21. File: PreciousMetalInventoryTool/app/js/state.js
--------------------------------------------------------------------------------
// APPLICATION STATE
// =============================================================================

/** @type {Object} Sorting state tracking */
let sortColumn = null;        // Currently sorted column index (null = unsorted)
let sortDirection = 'asc';    // 'asc' or 'desc' - current sort direction

/** @type {number|null} Index of item being edited (null = no edit in progress) */
let editingIndex = null;

/** @type {Object} Pagination state */
let currentPage = 1;          // Current page number (1-based)
let itemsPerPage = 25;        // Number of items to display per page

/** @type {string} Current search query */
let searchQuery = '';

/** @type {Object} Chart instances for proper cleanup */
let chartInstances = {
  typeChart: null,
  locationChart: null
};

/** @type {Object} Cached DOM elements for performance */
const elements = {
  // Spot price elements
  spotPriceDisplay: {},
  userSpotPriceInput: {},
  saveSpotBtn: {},
  resetSpotBtn: {},

  // Form elements
  inventoryForm: null,
  inventoryTable: null,
  itemMetal: null,
  itemName: null,
  itemQty: null,
  itemType: null,
  itemWeight: null,
  itemPrice: null,
  purchaseLocation: null,
  storageLocation: null,
  itemDate: null,

  // Spot price buttons
  saveSpotBtnSilver: null,
  saveSpotBtnGold: null,
  resetSpotBtnSilver: null,
  resetSpotBtnGold: null,



  // Import elements
  importCsvFile: null,
  importJsonFile: null,
  importExcelFile: null,

  // Export elements
  exportCsvBtn: null,
  exportJsonBtn: null,
  exportExcelBtn: null,
  exportPdfBtn: null,
  exportHtmlBtn: null,

  // Emergency reset button
  boatingAccidentBtn: null,

  // Edit modal elements
  editModal: null,
  editForm: null,
  cancelEditBtn: null,
  editMetal: null,
  editName: null,
  editQty: null,
  editType: null,
  editWeight: null,
  editPrice: null,
  editPurchaseLocation: null,
  editStorageLocation: null,
  editDate: null,
  editSpotPrice: null,

  // Details modal elements
  detailsModal: null,
  detailsModalTitle: null,
  typeBreakdown: null,
  locationBreakdown: null,

  // Chart canvas elements
  typeChart: null,
  locationChart: null,

  // Pagination elements
  itemsPerPage: null,
  prevPage: null,
  nextPage: null,
  firstPage: null,
  lastPage: null,
  pageNumbers: null,
  paginationInfo: null,

  // Search elements
  searchInput: null,
  clearSearchBtn: null,
  searchResultsInfo: null,

  // Theme toggle
  themeToggle: null,

  // Totals display elements (organized by metal type)
  totals: {
    silver: {
      items: null,       // Total item count
      weight: null,      // Total weight in ounces
      value: null,       // Current market value
      purchased: null,   // Total purchase price
      avgPrice: null,    // Average price per ounce
      avgPremium: null,  // Average premium per ounce
      avgCollectablePrice: null,    // Average collectable price per ounce
      avgNonCollectablePrice: null // Average non-collectable price per ounce
    },
    gold: {
      // Same structure as silver
      items: null,
      weight: null,
      value: null,
      purchased: null,
      avgPrice: null,
      avgPremium: null,
      avgCollectablePrice: null,
      avgNonCollectablePrice: null
    },
    platinum: {
      items: null,
      weight: null,
      value: null,
      purchased: null,
      avgPrice: null,
      avgPremium: null,
      avgCollectablePrice: null,
      avgNonCollectablePrice: null
    },
    palladium: {
      items: null,
      weight: null,
      value: null,
      purchased: null,
      avgPrice: null,
      avgPremium: null,
      avgCollectablePrice: null,
      avgNonCollectablePrice: null
    },
    all: {
      // Combined totals for all metals
      items: null,
      weight: null,
      value: null,
      purchased: null,
      avgPrice: null,
      avgPremium: null,
      avgCollectablePrice: null,
      avgNonCollectablePrice: null
    }
  }
};

/** @type {Array} Main inventory data structure */
let inventory = [];

/** @type {Object} Current spot prices for all metals */
let spotPrices = {
  silver: 0,
  gold: 0,
  platinum: 0,
  palladium: 0
};

/** @type {Array} Historical spot price records */
let spotHistory = [];

// =============================================================================


================================================================================

## 22. File: PreciousMetalInventoryTool/app/js/utils.js
--------------------------------------------------------------------------------
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


================================================================================

## 23. File: PreciousMetalInventoryTool/app/js/search.js
--------------------------------------------------------------------------------
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


================================================================================

