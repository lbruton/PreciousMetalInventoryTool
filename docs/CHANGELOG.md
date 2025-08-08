# Precious Metals Inventory Tool — Changelog

## 🚀 Roadmap (Future Versions)

*All major planned features have been implemented! The tool now includes comprehensive inventory management with storage location tracking, multi-format import/export, advanced analytics, and a modern modular architecture.*

---

## 📋 Version History

### Version 3.1.12 – About Modal and Disclaimer (2025-08-08)
- **User Notice**: Added mandatory about/disclaimer modal informing users that data is stored locally and advising regular backups
- **About Access**: New About button in header provides version info and change history
- **Sources Button**: Fixed bottom-left link to project repository
- **Persistence**: Acceptance stored in localStorage to prevent repeated prompts
- **Styling**: Refreshed modal header with prominent version display

### Version 3.1.11 – UI Enhancements and Documentation Consolidation (2025-08-08)
- **UI Improvements**: Enhanced table usability and visual organization
  - Color-coded table items for improved visual distinction and organization
  - Enhanced click-to-sort functionality across all table columns
  - Added dedicated Notes button for quick access to item notes
- **Documentation Improvement**: Consolidated AI assistant guidance into comprehensive workflow system
  - Removed redundant `docs/LLM.md` file (archived to `docs/archive/LLM.md`)
  - Replaced with enhanced `docs/MULTI_AGENT_WORKFLOW.md` providing complete project context
  - Improved multi-agent coordination protocols and quality standards
  - Updated workflow guidance with actionable step-by-step processes
  - Enhanced technical architecture documentation for AI assistants
- **Documentation Structure**: Streamlined guidance eliminates redundancy while providing superior development support
- **Future-Ready**: Comprehensive workflow documentation supports coordinated multi-agent development efforts

### Version 3.1.10 – File Cleanup and Project Maintenance (2025-08-08)
- **Project Cleanup**: Removed orphaned backup and debug files for improved maintainability
  - Removed `js/init_backup.js` - backup copy no longer needed
  - Removed `js/events_backup.js` - backup copy no longer needed
  - Removed `debug/file-protocol-test.html` - development test file
  - Removed `debug/debug_buttons.html` - development test file
- **Maintenance**: Streamlined project structure by removing unused development artifacts
- **Documentation**: Updated version references to use version families (e.g., 3.1.x) where appropriate

### Version 3.1.9 – API Modal Button Styling Fix (2025-08-07)
- **UI Consistency**: Added `--info` CSS variable and updated Clear Cache button to ensure visible, uniform styling across themes.

### Version 3.1.8 – Comprehensive Backup ZIP Functionality (2025-08-07)
- **New feature**: Implemented complete backup system with ZIP file download
- **Comprehensive backup**: Creates ZIP archive containing all application data
  - Complete inventory data in JSON format with version metadata
  - All export formats included: CSV, Excel, HTML with proper formatting
  - Application settings and configuration backup
  - Spot price history preservation
  - Detailed README file with restoration instructions
- **User experience**: "Backup All Data" button now fully functional
  - Loading indicator during backup creation
  - Success confirmation after completion
  - Error handling with user-friendly messages
- **Archive contents**: 
  - `inventory_data.json` - Primary data file for restoration
  - `settings.json` - Application preferences and current spot prices
  - `spot_price_history.json` - Historical price tracking data
  - `inventory_export.csv` - Spreadsheet-compatible export
  - `inventory_export.xlsx` - Excel format with proper formatting
  - `inventory_report.html` - Self-contained web page report
  - `README.txt` - Comprehensive restoration instructions
  - `sample_data.json` - Sample items for testing (if inventory exists)
- **Dependencies**: Added JSZip library for reliable ZIP file creation
- **File naming**: Timestamped files for easy organization (e.g., `precious_metals_backup_20250807.zip`)
- **Data integrity**: Multiple format redundancy ensures data recovery options
- **Privacy**: All processing done client-side, no data transmission

### Version 3.1.3 – Critical Bug Fixes and Stability Improvements (2025-08-07)
- **Fixed Missing Function References**: Resolved JavaScript errors where functions were called but not defined
  - Added fallback implementations for `resetSpotPrice()`, `showManualInput()`, `hideManualInput()`
  - Enhanced `syncSpotPricesFromApi()` with existence checks and user-friendly error messages
  - Improved `downloadCompleteBackup()` with fallback to basic export functions
- **Theme Toggle Fixes**: Resolved file:// protocol compatibility issues
  - Added fallback theme switching when `setTheme()` function unavailable
  - Enhanced event attachment methods for improved reliability
  - Added direct DOM manipulation for theme state persistence
- **Improved Error Handling**: Comprehensive defensive programming
  - Added function existence checks before all API-related calls
  - Enhanced logging for debugging missing DOM elements
  - Added graceful degradation when optional features unavailable
- **Spot Price Reset Enhancements**: Multi-layer fallback system
  - Primary: `resetSpotPrice()` from api.js
  - Secondary: `resetSpot()` from spot.js
  - Tertiary: Manual reset using default prices from constants
- **File Protocol Compatibility**: Enhanced reliability when opening via file://
  - Improved localStorage handling for edge cases
  - Better fallback mechanisms for restricted environments
  - Multiple event attachment methods for critical buttons
- **User Experience**: Added informative error messages instead of silent failures
  - Clear feedback for unavailable features
  - Enhanced backup functionality with export fallbacks
  - Improved API requirement notifications

### Version 3.1.2 – Spot-Price Button Manual Input Fix (2025-08-07)
- **Button Functionality:** “Add” and “Reset” spot-price buttons are now fully functional
  - “Add” spawns an inline popup form with working Save/Cancel buttons  
  - “Reset” restores either the `APP_VERSION`-sourced default or the last-synced API price
- **Coverage:** All four metals supported; falls back to last-synced API if no manual override exists  
- **Persistence:** Manual overrides persist through reloads via the same listener flow in `events.js`

### Version 3.1.5 – Timestamp Display Enhancement (2025-08-07)
- **New feature**: Added timestamp display for all spot price updates
- **Last update tracking**: Shows when each metal price was last updated with relative time (e.g., "2 hrs ago")
- **Source indicators**: Displays data source (API, Manual, Cached, Default, Stored)
- **Real-time updates**: Timestamps refresh when prices are updated via any method
- **User experience**: Provides clear visibility into data freshness and origin
- **UI enhancement**: Timestamps appear below spot price values in muted text
- **Smart formatting**: Displays relative time for recent updates, absolute dates for older ones

### Version 3.1.6 – Theme Toggle Fix (2025-08-07)
- **Fixed theme toggle**: Removed conflicting inline onclick handler from HTML button
- **Enhanced theme management**: Added system preference detection and auto-switching
- **Improved initialization**: Theme now loads properly on startup with fallback handling
- **System integration**: Automatically adapts to OS dark/light mode changes
- **Better UX**: Cleaner theme toggle logic without JavaScript conflicts
- **Backwards compatibility**: Maintains existing theme preferences in localStorage

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
- **Enhanced Security**: Comprehensive input sanitization to prevent XSS  
  - Implemented `sanitizeHtml()` for safe HTML insertion  
  - Applied sanitization to all user-generated content in table rendering  
  - Enhanced form validation with `validateInventoryItem()`  
- **Improved Date Parsing**: Rewritten logic for US (MM/DD/YYYY) vs. European (DD/MM/YYYY) formats  
  - Intelligent disambiguation and logical fallbacks  
  - Validation and error logging for unparseable dates  
- **Performance Monitoring**: Added `monitorPerformance()` utility  
  - Tracked bottlenecks in `renderTable()` with console warnings  
- **Enhanced Error Handling**: Added `handleError()` and `getUserFriendlyMessage()`  
  - Better error messages and detailed CSV import logging  
- **Fixed Missing DOM Elements**: Corrected caching for `premium` and `lossProfit`  
- **Code Quality Improvements**:  
  - JSDoc for new functions  
  - Modular architecture and separation of concerns  
- **Documentation Updates**: Corrected version refs in LLM.md and STRUCTURE.md; removed stale links

### Version 3.0.3 – Documentation Restructure (2025-08-06)
- Moved docs to `/docs/`  
- Updated `STRUCTURE.md` & `docs/README.md`  
- Fixed broken internal links  
- No functional changes

### Version 3.0.2 – Enhanced Table UX
- **Clickable item names** open the edit modal (removed separate Edit column)  
- **Simplified collectable toggle**: clean checkbox replaced toggle switch  
- **Centered delete buttons** in their cells  
- **Visual edit indicators**: hover/focus shows ✎ icon  
- **Accessibility**: keyboard navigation (Enter/Space), ARIA labels  
- **Streamlined table**: removed redundant column, compact layout

### Version 3.0.1 – Storage Location Tracking
- **New feature**: Added storage location field to track each item’s physical location  
- **Enhanced forms**: storage location input with “Vault A, Safe B…” placeholder  
- **Full table integration**: new column between “Purchase Location” and “Date”  
- **Search & Sort**: includes storage location, fully sortable  
- **Import/Export**: CSV, JSON, Excel, PDF, HTML include storage location  
- **Backwards compatibility**: default “Unknown” for existing items  
- **Dynamic version loading**: version auto-loads from `APP_VERSION` in `constants.js`  
- **Utility functions**: `getVersionString()`, `getAppTitle()` in `utils.js`

### Version 3.0 – UI Streamlining
- Removed “Show Spot History” & “Clear Spot History” buttons  
- Streamlined interface; spot history still collected in background  
- Added `/docs/structure.md` and migration roadmap for git control

### Version 2.8 – Modular Overhaul
- **Refactor**: modular JS files  
- **CSS modularization**: external `app/css/styles.css`  
- **Dark mode**: via `theme.js` & CSS variables  
- **Data visualization**: Chart.js pie charts  
- **UI improvements**: pagination, search, sorting  
- **Performance**: deferred script loading  

### Version 2.7 – Details & Analytics
- “View Details” on metal summary cards  
- Breakdown reports by type & purchase location  
- Improved navigation & layout  

### Version 2.6 – Maintenance Update
- Minor bug fixes & performance improvements  
- Code cleanup  

### Version 2.5 – Multi-Metal Support Completion
- Full support for Platinum & Palladium  
- UI & export refinements for all four metals  
- Calculation consistency improvements  

### Version 2.4 – Multi-Metal Support Introduction
- **New metals**: Platinum & Palladium  
- Expanded entry fields, summaries & calculations  
- Export & UI enhancements  

### Version 2.3 – Collectables Polish
- Refined summary breakdowns by collectable status  
- Improved edit interface & tooltips  

### Version 2.2 – Collectables Enhancement
- Enhanced collectable handling & price breakdowns  
- Average price/oz for collectable vs non-collectable  

### Version 2.1 – Collectables Introduction
- **New feature**: mark items as “Collectable”  
- Separate tracking & UI updates  

### Version 2.0 – Major Update
- **Expanded tracking** for Silver & Gold: type, quantity, weight, name  
- **Comprehensive totals**: weight, price, value, avg/oz, premium, profit/loss  
- **Editable table** with sorting  
- **Import/Export**: CSV, JSON, Excel, PDF, HTML  
- **Spot Price History** tracking  
- **Dark Mode**  
- “Boating Accident” reset feature  
- **Pagination**  

### Version 1.0 – Initial Release
- Basic inventory tracking for Silver & Gold  
- Core item fields (type, qty, weight, name, location, price, date)  
- Totals & profit/loss calculations  
- Edit/delete functionality  
- Simple, clean interface with summary sections