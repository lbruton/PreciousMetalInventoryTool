# Precious Metals Inventory Tool v3.2.0

The Precious Metals Inventory Tool is a comprehensive client-side web application for tracking precious metal investments. It's designed to help users manage their silver, gold, platinum, and palladium holdings with detailed financial metrics and enhanced tracking capabilities.

## 🆕 What's New in v3.2.0

- **🛡️ File-Based Caching**: Bulletproof WordPress plugin caching that survives hosting provider purges
- **⚡ Improved Reliability**: Works on ANY hosting provider, including shared hosting
- **🔧 Enhanced WordPress Plugin**: Updated plugin with admin dashboard and cache monitoring
- **📊 Cache Status Monitoring**: Real-time cache health indicators in admin interface
- **🚀 Better Performance**: Faster loading with reliable file-based cache system
- **🛠️ Hosting Independence**: No more cache issues with hosting provider limitations

## Key Features

- **Multi-Metal Support**: Track Silver, Gold, Platinum, and Palladium investments
- **Live Metal Prices**: Integration with metals.dev API for real-time spot prices
- **Bulletproof Caching**: File-based caching system that works on all hosting providers
- **WordPress Plugin**: Easy installation with reliable caching for hosting compatibility
- **Comprehensive Tracking**: Metal type, quantity, weight, purchase/storage locations, and notes
- **Financial Calculations**: Automatic calculation of premiums, profits/losses, and averages
- **Collectable Item Support**: Special handling for collectible items with numismatic value
- **Advanced Search**: Search and filter inventory by any field including notes
- **Dark/Light Theme**: Toggle between dark and light themes for optimal viewing
- **Import/Export**: Support for CSV, JSON, Excel, PDF, and HTML formats
- **Data Visualization**: Interactive pie charts for inventory breakdown analysis
- **Responsive Design**: Optimized for desktop and mobile devices
- **Local Storage**: All data stored locally in browser - no server required
- **Privacy**: No data transmission - everything stays on your device

## WordPress Plugin Installation

### Option 1: Simple Plugin (Recommended for hosting issues)

1. **Download Plugin Files**:
   - Copy `plugins/precious-metals-simple/` to your WordPress installation
   - Upload to `/wp-content/plugins/precious-metals-simple/`

2. **Activate Plugin**:
   - Go to WordPress Admin > Plugins
   - Find "Precious Metals Simple API"
   - Click "Activate"

3. **Configure (Optional)**:
   - Go to Settings > Precious Metals
   - Default API key is included (DPD98Z5TMCNMSYS0I2DA118S0I2DA)
   - Plugin will automatically start fetching prices twice daily

### Why File-Based Caching?

**Traditional WordPress caching fails on shared hosting because:**
- ❌ Hosting providers clear object cache
- ❌ Memory limitations cause cache failures  
- ❌ Database connection issues
- ❌ Transient data gets purged unpredictably

**Our file-based solution:**
- ✅ **Stores cache in protected `/wp-content/uploads/precious-metals-cache/` directory**
- ✅ **Survives hosting provider cache purges**
- ✅ **Works with shared hosting limitations**
- ✅ **Automatic fallback to stale cache during API outages**
- ✅ **No database dependencies for cached data**

### Plugin Features

- **File-Based Caching**: Reliable caching that works everywhere
- **Multiple API Support**: Automatic failover between 3 different APIs
- **Admin Dashboard**: Real-time cache status and price monitoring
- **REST API Endpoints**: Clean API for external consumption
- **Twice Daily Updates**: Automatic price fetching every 12 hours
- **Cache Health Monitoring**: Visual indicators for cache status

### API Endpoints

Once installed, your plugin provides these endpoints:

```bash
# Get current prices
GET /wp-json/precious-metals/v1/prices

# Force refresh prices
GET /wp-json/precious-metals/v1/prices?force=true

# Check cache status  
GET /wp-json/precious-metals/v1/cache-status

# Plugin status
GET /wp-json/precious-metals/v1/status
```

## Installation (Standalone App)

1. Clone or download this repository
2. Open `index.html` in a web browser
3. Click "Accept and Continue" to access the application

## Quick Start

1. **Set Spot Prices**: Enter current metal spot prices or use the defaults
2. **Add Items**: Use the form to add items to your inventory
3. **Track Storage**: Specify where each item is stored
4. **Add Notes**: Include additional details about each item
5. **Search & Filter**: Use the search bar to find specific items
6. **Export Data**: Download your inventory in multiple formats
7. **View Analytics**: Click "View Details" on summary cards for breakdowns

## Version Management

This application uses a dynamic version management system. The version is automatically updated throughout the application from `app/js/constants.js`. The HTML files now use this dynamic system instead of hardcoded version numbers. See [docs/VERSIONING.md](docs/VERSIONING.md) for details on how to update versions.

## Data Structure

Each inventory item includes:
- **Basic Info**: Metal type, name, quantity, weight, type
- **Financial**: Purchase price, spot price, premiums, profit/loss
- **Location**: Purchase location and storage location
- **Additional**: Notes field for comments and details
- **Status**: Collectable designation for numismatic items
- **Metadata**: Purchase date and historical data

## File Organization

```
PreciousMetalInventoryTool/
├── app/                    # Main application
│   ├── index.html         # Application interface
│   ├── css/styles.css     # Complete styling
│   └── js/               # Modular JavaScript
├── plugins/              # WordPress plugins
│   ├── precious-metals-simple/  # Recommended plugin
│   │   ├── precious-metals-simple.php
│   │   ├── class-api-handler.php
│   │   ├── class-rest-endpoint.php
│   │   ├── config.php
│   │   └── README.md
│   └── precious-metals-api.php  # Single-file plugin
├── docs/                 # Documentation
├── sample.csv           # Sample data with notes
└── index.html          # Landing page
```

## WordPress Plugin Troubleshooting

### Common Issues & Solutions

**"Unable to fetch metal prices"**
- ✅ Plugin uses file-based caching - check Settings > Precious Metals for cache status
- ✅ Even if API fails, cached data will still display
- ✅ Default API key is included, no configuration required

**"Cache directory not writable"**
- Check file permissions: `chmod 755 wp-content/uploads/`
- Contact hosting provider if issues persist
- File caching works on all hosting providers with basic file permissions

**Plugin not working on shared hosting**
- ✅ File-based caching specifically designed for shared hosting
- ✅ No special configuration required
- ✅ Works with hosting provider limitations

**Stale prices showing**
- This is normal behavior during API outages
- Plugin serves cached data as fallback
- Fresh data returns when API is available

### Cache Locations

**Plugin Cache**: `/wp-content/uploads/precious-metals-cache/prices.json`
**Protection**: Directory protected with `.htaccess` and `index.php`
**Monitoring**: Admin dashboard shows real-time cache status

## Documentation

- **[docs/README.md](docs/README.md)** - Detailed project information
- **[docs/LLM.md](docs/LLM.md)** - Development guide for AI assistants
- **[docs/CHANGELOG.md](docs/CHANGELOG.md)** - Version history and features
- **[docs/STATUS.md](docs/STATUS.md)** - Current project status
- **[docs/STRUCTURE.md](docs/STRUCTURE.md)** - Project organization
- **[docs/VERSIONING.md](docs/VERSIONING.md)** - Version management
- **[plugins/precious-metals-simple/README.md](plugins/precious-metals-simple/README.md)** - WordPress plugin documentation

## Code Quality

This project maintains high code quality standards with:
- Comprehensive JSDoc-style comments throughout all JavaScript modules
- Detailed HTML section comments explaining functionality
- Well-organized CSS with extensive documentation
- Modular architecture with clear separation of concerns
- Input sanitization and XSS protection
- Performance monitoring for critical functions
- Accessibility compliance with ARIA labels
- Reliable file-based caching system

## Data Privacy & Security

- **Local Storage Only**: All data stored in browser localStorage
- **No Server Communication**: Zero external data transmission (except optional API calls)
- **Input Sanitization**: XSS protection on all user inputs
- **Privacy First**: Your data never leaves your device
- **Export for Backup**: Multiple export formats for data portability
- **Secure Cache**: WordPress plugin cache files are protected from direct access

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 localStorage
- CSS Custom Properties
- ES6 JavaScript features
- Chart.js for visualizations

## Contributing

This project is designed to be maintainable and extensible. When making changes:

1. Update the version in `app/js/constants.js`
2. Document changes in `docs/CHANGELOG.md`
3. Update relevant documentation files
4. Test backwards compatibility
5. Ensure all exports include new fields
6. Test WordPress plugin compatibility

## License

This project is open source and available for personal use.

---

**Current Version**: 3.2.0  
**Last Updated**: August 7, 2025  
**Status**: Production Ready ✅  
**WordPress Plugin**: File-Based Caching ✅