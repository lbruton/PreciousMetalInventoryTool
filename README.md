## 🆕 What's New in v3.1.2

## API Integration

### Supported Providers
- **Metals.dev**: Professional metals pricing API
- **Metals-API.com**: Comprehensive precious metals data
- **MetalPriceAPI.com**: Real-time metal price feeds

### Setup Process
1. Click the "API" button in the top-right corner
2. Select your preferred API provider
3. Enter your API key (get from provider's website)
4. Test the connection and save configuration
5. Use "Sync" buttons to update spot prices automatically

### Features
- **24-Hour Caching**: Spot prices cached locally to reduce API calls
- **Secure Storage**: API keys encrypted and stored locally only
- **Fallback Support**: Manual price entry always available
- **Default Prices**: Built-in fallback prices when no API is configured
- **Connection Testing**: Verify API setup before saving

### Data Management
- **Reset Functionality**: Reset prices to API cache or defaults
- **Manual Override**: Add custom prices even with API configured
- **History Tracking**: All price changes recorded with source (API/manual/default)
- **Complete Backup**: Export includes API configuration details (keys excluded for security)# Precious Metals Inventory Tool v3.1.0

The Precious Metals Inventory Tool is a comprehensive client-side web application for tracking precious metal investments. It's designed to help users manage their silver, gold, platinum, and palladium holdings with detailed financial metrics, API integration for live spot prices, and enhanced tracking capabilities.

## 🆕 What's New in v3.1.0

- **API Integration**: Connect to live spot price providers (Metals.dev, Metals-API.com, MetalPriceAPI.com)
- **Automated Price Sync**: 24-hour cached spot price updates with one-click sync
- **Enhanced Spot Price Management**: Redesigned interface with Sync, Add, and Reset buttons
- **Comprehensive Backup System**: Complete data backup including inventory, spot history, and API configuration
- **Default Spot Prices**: Fallback prices when no API is configured (Silver: $25, Gold: $2500, Platinum/Palladium: $1000)
- **Improved User Experience**: Streamlined workflow for price management and data synchronization

## Key Features

- **Multi-Metal Support**: Track Silver, Gold, Platinum, and Palladium investments
- **Live API Integration**: Connect to professional metals pricing APIs for real-time spot prices
- **Comprehensive Tracking**: Metal type, quantity, weight, purchase/storage locations, and notes
- **Financial Calculations**: Automatic calculation of premiums, profits/losses, and averages
- **Collectable Item Support**: Special handling for collectible items with numismatic value
- **Advanced Search**: Search and filter inventory by any field including notes
- **Dark/Light Theme**: Toggle between dark and light themes for optimal viewing
- **Import/Export**: Support for CSV, JSON, Excel, PDF, and HTML formats
- **Complete Backup System**: ZIP export with inventory, spot history, and API configuration
- **Data Visualization**: Interactive pie charts for inventory breakdown analysis
- **Responsive Design**: Optimized for desktop and mobile devices
- **Local Storage**: All data stored locally in browser - no server required
- **Privacy**: API keys encrypted locally, no data transmission except to chosen price providers

## Installation

1. Clone or download this repository
2. Open `index.html` in a web browser
3. Click "Accept and Continue" to access the application

## Quick Start

1. **Configure API (Optional)**: Click the "API" button to set up live spot price sync
2. **Set Spot Prices**: Use Sync button (if API configured) or Add button for manual entry
3. **Add Items**: Use the form to add items to your inventory
4. **Track Storage**: Specify where each item is stored
5. **Add Notes**: Include additional details about each item
6. **Search & Filter**: Use the search bar to find specific items
7. **Export Data**: Download your inventory in multiple formats
8. **View Analytics**: Click "View Details" on summary cards for breakdowns
9. **Backup Everything**: Use "Backup All Data" for complete data export

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
├── docs/                 # Documentation
├── sample.csv           # Sample data with notes
└── index.html          # Landing page
```

## Documentation

- **[docs/README.md](docs/README.md)** - Detailed project information
- **[docs/LLM.md](docs/LLM.md)** - Development guide for AI assistants
- **[docs/CHANGELOG.md](docs/CHANGELOG.md)** - Version history and features
- **[docs/STATUS.md](docs/STATUS.md)** - Current project status
- **[docs/STRUCTURE.md](docs/STRUCTURE.md)** - Project organization
- **[docs/VERSIONING.md](docs/VERSIONING.md)** - Version management

## Code Quality

This project maintains high code quality standards with:
- Comprehensive JSDoc-style comments throughout all JavaScript modules
- Detailed HTML section comments explaining functionality
- Well-organized CSS with extensive documentation
- Modular architecture with clear separation of concerns
- Input sanitization and XSS protection
- Performance monitoring for critical functions
- Accessibility compliance with ARIA labels

## Data Privacy & Security

- **Local Storage Only**: All data stored in browser localStorage
- **No Server Communication**: Zero external data transmission
- **Input Sanitization**: XSS protection on all user inputs
- **Privacy First**: Your data never leaves your device
- **Export for Backup**: Multiple export formats for data portability

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

## License

This project is open source and available for personal use.

---

**Current Version**: 3.1.0  
**Last Updated**: August 7, 2025  
**Status**: API Integration Complete ✅