# Precious Metals Inventory Tool - Changelog

## 🚀 Roadmap (Future Versions)

*All major planned features have been implemented! The tool now includes comprehensive inventory management with storage location tracking, multi-format import/export, advanced analytics, and a modern modular architecture.*

---

## 📋 Version History

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
- **Dynamic version loading**: Version numbers now automatically load from APP_VERSION constant in constants.js
- **Single source of truth**: Only need to update version in one place (constants.js) and it propagates everywhere
- **Version utility functions**: Added `getVersionString()` and `getAppTitle()` helper functions in utils.js
- **Maintainability improvement**: Eliminates need to manually update version in multiple HTML files
- **Future-proof**: Any part of the application can now easily access and display the current version

### Version 3.0 - UI Streamlining
- **Removed spot price history UI**: Eliminated "Show Spot History" and "Clear Spot History" buttons from the interface
- **Simplified user experience**: Streamlined interface by removing spot price history viewing functionality
- **Code cleanup**: Removed associated event listeners, DOM references, and CSS styling for spot history buttons
- **Maintained data collection**: Spot price history data collection continues in background for future use
- **Preserved core functionality**: All inventory management, import/export, and analysis features remain intact
- **Added repository documentation**: Created comprehensive root-level structure.md for better project navigation
- **Created migration roadmap**: Added detailed plan for transitioning to git-based version control

### Version 2.8 - Modular Overhaul
- **Major codebase refactor**: Extracted scripts into modular JS files for better separation of concerns
- **CSS modularization**: Moved styles to external `styles.css`, enabling improved maintainability and theming
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