# Dynamic Version Management System

## Overview 

The Precious Metals Inventory Tool now uses a dynamic version management system that automatically updates version numbers throughout the application from a single source of truth.

## How It Works

### Single Source of Truth
- Version is defined once in `app/js/constants.js` as `APP_VERSION = '3.0.1'`
- This is the ONLY place you need to update the version number

### Automatic Propagation
- **Root Landing Page** (`index.html`): JavaScript automatically updates the page title and heading
- **Main Application** (`app/index.html`): JavaScript automatically updates the page title and heading  
- **Browser Tab Title**: Dynamically updated with current version
- **Application Header**: Shows current version in the main app interface

### Utility Functions
Two helper functions are available in `utils.js`:
- `getVersionString(prefix)`: Returns formatted version (e.g., "v3.0.1")
- `getAppTitle(baseTitle)`: Returns full app title with version

## Updating the Version

To release a new version:

1. **Update ONLY the constants file:**
   ```javascript
   // In app/js/constants.js
   const APP_VERSION = '3.1.0';  // Change this line only
   ```

2. **All these will automatically update:**
   - Root page title: "Lonnie's Precious Metals Tool v3.1.0"
   - Root page heading: "Lonnie's Precious Metals Tool v3.1.0"
   - App page title: "Precious Metals Inventory Tool v3.1.0"
   - App header: "Precious Metals Inventory Tool v3.1.0"

3. **Update changelog:** Add entry to `changelog.md` for documentation

## Technical Implementation

### Root Page (index.html)
```javascript
// Loads constants.js and utils.js
// Updates title and heading via DOM manipulation
document.title = `Lonnie's Precious Metals Tool ${getVersionString()}`;
```

### Main App (app/index.html)
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
const version = APP_VERSION; // "3.0.1"

// Get formatted version string
const versionString = getVersionString(); // "v3.0.1"
const customVersion = getVersionString('version '); // "version 3.0.1"

// Get full app title
const title = getAppTitle(); // "Precious Metals Inventory Tool v3.0.1"
const customTitle = getAppTitle('My Custom Tool'); // "My Custom Tool v3.0.1"
```

This system ensures version consistency and makes maintenance much easier!
