# Precious Metals Inventory Tool v3.1.10

The Precious Metals Inventory Tool is a comprehensive client-side web application for tracking precious metal investments. It's designed to help users manage their silver, gold, platinum, and palladium holdings with detailed financial metrics and enhanced tracking capabilities.

## 🆕 What's New in v3.1.10
- **Project Maintenance**: Removed orphaned backup and debug files for improved maintainability and cleaner project structure.
- **File Cleanup**: Eliminated unnecessary development artifacts to streamline the codebase.

## Recent Updates in 3.1.x Series
- **v3.1.9 - UI Consistency**: Clear Cache button styling improvements across themes
- **v3.1.8 - Backup System**: Full ZIP backup functionality with restoration guides
- **v3.1.6 - Theme Toggle**: Fixed theme management with system preference detection

## What's New in v3.1.8
- **Full Backup System**: "Backup All Data" button creates a timestamped ZIP archive of the entire application state.
- **Comprehensive Archive**: Includes inventory JSON, settings, spot price history, and exports (CSV, Excel, HTML) with restoration instructions.
- **Client-Side Processing**: Uses JSZip to generate archives locally so your data never leaves the device.

## What's New in v3.1.6
- **Fixed Theme Toggle**: Removed conflicting inline onclick handler, added system preference detection
- **Enhanced Theme Management**: Auto-adapts to OS dark/light mode changes
- **Improved Initialization**: Theme loads properly on startup with fallback handling
- **Better UX**: Cleaner toggle logic without JavaScript conflicts

## What's New in v3.1.2
- **Improved Event Listener Setup**: Enhanced event listener attachment for robustness across browsers and protocols.
- **Manual Input Workflow**:
  1. Click "Add" button to show manual price input form.
  2. Enter desired spot price and click "Save" or press Enter.
  3. Form hides and updates the price.
  4. "Cancel" aborts and hides the input form without changes.
- **Reset Functionality**:
  - Clicking "Reset" restores the price to default or API cached value.
  - Price history updates accordingly with source tracking.
- **API Integration**:
  - Sync buttons are enabled/disabled based on API configuration.
  - All metal prices sync simultaneously from configured provider.
  - Button states show loading status during syncing.
- **Backwards Compatibility and Stability**: Maintained all existing workflows and data integrity during fixes.

## 🆕 What's New in Previous Version v3.0.5
- **Notes Field**: Added optional notes field for detailed item documentation.
- **Enhanced Search**: Search now includes notes content along with all other fields.
- **Complete Export Support**: Notes field included in all export formats (CSV, JSON, Excel, PDF, HTML).
- **Improved Sample Data**: Updated sample.csv with realistic notes examples.
- **Backwards Compatibility**: Existing data automatically upgraded with empty notes field.

## Key Features
- **Multi-Metal Support**: Track Silver, Gold, Platinum, and Palladium investments.
- **Comprehensive Tracking**: Metal type, quantity, weight, purchase/storage locations, and notes.
- **Financial Calculations**: Automatic calculation of premiums, profits/losses, and averages.
- **Collectable Item Support**: Special handling for collectible items with numismatic value.
- **Advanced Search**: Search and filter inventory by any field including notes.
- **Dark/Light Theme**: Toggle between dark and light themes for optimal viewing.
- **Import/Export**: Support for CSV, JSON, Excel, PDF, and HTML formats.
- **Data Visualization**: Interactive pie charts for inventory breakdown analysis.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Local Storage**: All data stored locally in browser - no server required.
- **Privacy**: No data transmission - everything stays on your device.

## Installation
1. Clone or download this repository.
2. Open `index.html` in a web browser.
3. Click "Accept and Continue" to access the application.

## Quick Start
1. **Set Spot Prices**: Enter current metal spot prices or use the defaults. Use the "Sync" buttons to update prices automatically.
2. **Add Items**: Use the form to add items to your inventory.
3. **Track Storage**: Specify where each item is stored.
4. **Add Notes**: Include additional details about each item.
5. **Search & Filter**: Use the search bar to find specific items.
6. **Export Data**: Download your inventory in multiple formats.
7. **View Analytics**: Click "View Details" on summary cards for breakdowns.

## Version Management
This application uses a dynamic version management system. The version is automatically updated throughout the application from `js/constants.js`. The HTML files now use this dynamic system instead of hardcoded version numbers. See [docs/VERSIONING.md](docs/VERSIONING.md) for details on how to update versions.

## Data Structure
Each inventory item includes:
- **Basic Info**: Metal type, name, quantity, weight, type.
- **Financial**: Purchase price, spot price, premiums, profit/loss.
- **Location**: Purchase location and storage location.
- **Additional**: Notes field for comments and details.
- **Status**: Collectable designation for numismatic items.
- **Metadata**: Purchase date and historical data.

## Project Structure

```
├── STRUCTURE.md
├── app
│   ├── css
│   │   └── styles.css                    # Complete theming and responsive styling
│   ├── index.html                       # Main application interface
│   ├── js
│   │   ├── charts.js                    # Chart.js utilities and pie chart rendering
│   │   ├── constants.js                 # Global constants including metal configs and version
│   │   ├── detailsModal.js              # Analytics modal with breakdown charts
│   │   ├── events.js                    # DOM event listener setup and management
│   │   ├── init.js                      # Application bootstrap and initialization
│   │   ├── inventory.js                 # CRUD operations, calculations, and import/export
│   │   ├── pagination.js                # Table pagination controls and logic
│   │   ├── search.js                    # Search and filtering functionality including notes
│   │   ├── sorting.js                   # Table column sorting utilities
│   │   ├── spot.js                      # Spot price handling and history management
│   │   ├── state.js                     # Global application state and DOM caching
│   │   ├── theme.js                     # Dark/light theme management
│   │   └── utils.js                     # Utility functions, validation, and helpers
│   └── structure.md                     # Module-specific structure documentation
├── docs
│   ├── CHANGELOG.md                     # Detailed history of application changes
│   ├── MULTI_AGENT_WORKFLOW.md          # AI assistant development workflow and coordination
│   ├── VERSIONING.md                   # Version management notes
│   ├── README.md                       # Detailed project information
│   ├── STATUS.md                       # Project status and features overview
│   └── STRUCTURE.md                    # This file documenting folder and file organization
├── index.html                          # Landing page / version selector
├── sample.csv                         # Sample inventory data with notes for import testing
└── README.md                          # Root project summary and documentation
```

**Key Notes:**

- The `app` folder contains the entire main application, including CSS and modular JavaScript files.
- JavaScript is split into specialized modules to promote maintainability and separation of concerns.
- Styles use CSS custom properties supporting dark/light themes and responsive layouts.
- Documentation files in the `docs` folder keep changelogs, versioning info, project status, and development guides.
- The root `index.html` serves as a landing/version selector page leading to the main app interface.

## Documentation
- **[docs/README.md](docs/README.md)** - Detailed project information.
- **[docs/MULTI_AGENT_WORKFLOW.md](docs/MULTI_AGENT_WORKFLOW.md)** - AI assistant development workflow.
- **[docs/CHANGELOG.md](docs/CHANGELOG.md)** - Version history and features.
- **[docs/STATUS.md](docs/STATUS.md)** - Current project status.
- **[docs/STRUCTURE.md](docs/STRUCTURE.md)** - Project organization.
- **[docs/VERSIONING.md](docs/VERSIONING.md)** - Version management.

## Code Quality
This project maintains high code quality standards with:
- Comprehensive JSDoc-style comments throughout all JavaScript modules.
- Detailed HTML section comments explaining functionality.
- Well-organized CSS with extensive documentation.
- Modular architecture with clear separation of concerns.
- Input sanitization and XSS protection.
- Performance monitoring for critical functions.
- Accessibility compliance with ARIA labels.

## Data Privacy & Security
- **Local Storage Only**: All data stored in browser localStorage.
- **No Server Communication**: Zero external data transmission.
- **Input Sanitization**: XSS protection on all user inputs.
- **Privacy First**: Your data never leaves your device.
- **Export for Backup**: Multiple export formats for data portability.

## Browser Compatibility
Works in all modern browsers that support:
- HTML5 localStorage.
- CSS Custom Properties.
- ES6 JavaScript features.
- Chart.js for visualizations.

## Known Issues / Bugs

Currently, no major issues are known.

## Contributing
This project is designed to be maintainable and extensible. When making changes:
1. Update the version in `js/constants.js`
2. Document changes in `docs/CHANGELOG.md`
3. Update relevant documentation files
4. Test backwards compatibility
5. Ensure all exports include new fields

## License
This project is open source and available for personal use.

---
**Current Version**: 3.1.10
**Last Updated**: August 8, 2025
**Status**: Feature complete with streamlined, maintained codebase



