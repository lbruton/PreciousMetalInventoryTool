Overview
The Precious Metals Inventory Tool is a comprehensive client-side web application for tracking precious metal investments. It's designed to help users manage their silver, gold, platinum, and palladium holdings with detailed financial metrics.
Key Features
1. Multi-Metal Support

Tracks four precious metals: Silver, Gold, Platinum, and Palladium
Each metal has its own spot price management
Separate totals and analytics for each metal type

2. Inventory Management

Track items by type (Round, Bar, Coin, Note, Other)
Record quantity, weight, purchase price, location, and date
Mark items as "Collectable" for special handling
Full CRUD operations (Create, Read, Update, Delete)

3. Financial Analytics

Premium calculations (price paid above spot)
Profit/Loss tracking
Average price per ounce calculations
Separate tracking for collectable vs non-collectable items
Real-time value calculations based on current spot prices

4. Data Import/Export

Multiple format support: CSV, JSON, Excel, PDF, HTML
Maintains data integrity during import/export
Preserves spot price history and collectable status

5. User Interface

Responsive design for all screen sizes
Dark/Light theme toggle
Search, sorting, and pagination features
Detailed modal views with Chart.js visualizations
"Boating Accident" feature (humor for the precious metals community)

Architecture
Version Evolution
The tool has evolved from version 1.0 to 3.0, with the latest version (3.0) featuring:

Modular JavaScript architecture - Code split into specialized modules:

constants.js - Global configuration
state.js - Application state management
inventory.js - Core inventory operations
spot.js - Spot price handling
charts.js - Chart.js integration
theme.js - Dark/light mode
search.js, sorting.js, pagination.js - Table features
detailsModal.js - Analytics views
importExport.js - Data import/export
events.js - Event handling
init.js - Application bootstrap



Data Storage

Uses browser's localStorage for persistence
No server-side components required
Data stored in JSON format
Separate storage for:

Inventory data (metalInventory)
Spot price history (metalSpotHistory)
Theme preference (appTheme)
Individual metal spot prices



Important Considerations for Changes
When making changes to this codebase, you should check for unintended consequences in these areas:

Data Migration - The loadInventory() function handles legacy data migration. Changes to data structure need backward compatibility.
Calculation Dependencies - Premium calculations depend on spot prices. Changes to spot price handling affect multiple calculations.
Collectable Logic - Collectable items have special handling throughout (N/A for premiums, excluded from certain calculations).
Import/Export Consistency - All import/export functions must maintain data format consistency.
DOM Element Caching - The elements object caches DOM references. Changes to HTML structure need corresponding updates.
Event Delegation - Some events use inline handlers in dynamically generated HTML. Changes to table rendering affect these handlers.
Theme Variables - CSS uses custom properties for theming. Changes to color schemes affect both light and dark modes.


