# Precious Metals Inventory Tool - Changelog

## 🚀 Roadmap (Future Versions)

*All major planned features have been implemented! The tool now includes comprehensive inventory management with storage location tracking, multi-format import/export, advanced analytics, and a modern modular architecture.*

---

## 📋 Version History

### Version 3.1.1 – Enhanced API Sync Caching (2025-08-07)
- **Intelligent sync caching**: Modified sync behavior to respect 24-hour cache duration
  - Regular sync buttons now check cache age and use stored values if API was synced within 24 hours
  - Users are informed when cached prices are being used with cache age information
  - Eliminates unnecessary API calls and preserves API rate limits
- **New API modal functionality**: Added cache management tools in API configuration
  - New "Sync Now" button to force fresh API calls from the modal
  - New "Clear Cache" button to reset cache and force next sync to pull fresh data
  - Enhanced user control over when fresh API data is retrieved
- **Improved user experience**: Better messaging and guidance
  - Clear instructions on how to get fresh API data (via API modal)
  - Updated tooltips and button titles to reflect new caching behavior
  - Preserved all existing manual price override functionality
- **Enhanced price history tracking**: Added 'cached' source type to distinguish cache refreshes from fresh API calls
- **Maintained backwards compatibility**: All existing functionality preserved, with enhanced caching as the only behavioral change

### Version 3.1.0 – API Integration & Live Spot Prices (2025-08-07)
- **Major feature**: Full API integration for live spot price feeds
  - Support for three major providers: Metals.dev, Metals-API.com, MetalPriceAPI.com
  - Secure local storage of API keys with base64 encryption
  - 24-hour intelligent caching system to minimize API calls
  - Connection testing and validation before saving configuration
- **Redesigned spot price interface**: Complete UX overhaul
  - New three-button system: Sync (API), Add (manual), Reset (default/cache)
  - Collapsible manual input sections with smooth animations
  - Real-time button state management based on API availability
  - Enhanced visual feedback and loading states
- **Default price system**: Intelligent fallback pricing
  - Built-in defaults: Silver $25, Gold $2500, Platinum $1000, Palladium $1000
  - Automatic price display when no user-set or API prices available
  - Smart reset functionality using API cache when available, defaults otherwise
- **Comprehensive backup system**: Complete data export solution
  - New "Backup All Data" button for full data export
  - Generates inventory CSV, spot price history CSV, and API configuration markdown
  - Secure handling: API keys excluded from backups for security
  - Timestamped filenames with detailed configuration summaries
- **Enhanced data management**:
  - Improved spot price history with source tracking (API/manual/default/stored)
  - API cache management with expiration and validation
  - Better integration between manual and API price sources
  - Preserved all existing import/export functionality
- **UI/UX improvements**:
  - New API configuration modal with provider information and documentation links
  - Improved boating accident functionality (now clears API data too)
  - Better error handling and user feedback throughout API flows
  - Enhanced accessibility with proper ARIA labels and keyboard navigation
- **Developer improvements**:
  - New modular api.js with comprehensive API management functions
  - Updated state management for API-related data and DOM elements
  - Enhanced initialization sequence to load API configuration and cache
  - Better separation of concerns between spot price sources

### Version 3.0.5 – Notes Field Enhancement (2025-08-06)
- **New feature**: Added optional notes field for inventory items
- **Form enhancements**: Notes field positioned to the right of storage location in both add and edit forms
- **Improved organization**: Optional text field for additional comments, observations, or item-specific details
- **Search integration**: Notes content now searchable along with all other inventory fields
- **Complete import/export support**: Notes field included in all formats (CSV, JSON, Excel, PDF, HTML)
- **Strategic table design**: Notes accessible through edit modal but excluded from main table display to maintain clean layout
- **Backwards compatibility**: Existing inventory items automatically receive empty notes field
- **Data preservation**: All import/export operations preserve notes data for full data portability
- **User experience**: Enhanced search placeholder text to indicate notes as searchable content
- **Database migration**: Seamless data structure upgrade with no user intervention required

### Version 3.0.4 – Security & Performance Enhancements (2025-08-06)
- **Enhanced Security**: Added comprehensive input sanitization to prevent XSS attacks
  - Implemented `sanitizeHtml()` function for safe HTML content insertion
  - Applied sanitization to all user-generated content in table rendering
  - Enhanced form validation with `validateInventoryItem()` function
- **Improved Date Parsing**: Completely rewritten date parsing logic
  - Intelligent disambiguation between US (MM/DD/YYYY) and European (DD/MM/YYYY) formats
  - Better handling of ambiguous dates with logical fallbacks
  - Added validation and error logging for unparseable dates
- **Performance Monitoring**: Added performance tracking for critical functions
  - Implemented `monitorPerformance()` utility for bottleneck identification
  - Added monitoring to `renderTable()` function with console warnings for slow operations
- **Enhanced Error Handling**: Comprehensive error management system
  - Added `handleError()` and `getUserFriendlyMessage()` functions
  - Improved error messages for better user experience
  - Enhanced CSV import with detailed validation and error logging
- **Fixed Missing DOM Elements**: Corrected state.js element caching
  - Added missing `premium` and `lossProfit` DOM element references
  - Ensured all totals elements are properly cached for performance
- **Code Quality Improvements**:
  - Added comprehensive JSDoc documentation for all new functions
  - Enhanced input validation with detailed error messages
  - Improved modular architecture with better separation of concerns
- **Documentation Updates**: Corrected version references and structural information
  - Updated LLM.md, STRUCTURE.md to reflect actual codebase
  - Removed references to non-existent files
  - Enhanced code documentation and architectural guidelines

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