# Precious Metals Inventory Tool v3.1.0

The Precious Metals Inventory Tool is a comprehensive client-side web application for tracking precious metal investments. It's designed to help users manage their silver, gold, platinum, and palladium holdings with detailed financial metrics and enhanced tracking capabilities.

## 🆕 What's New in v3.1.0

- **Live Metal Prices**: Integration with metals.dev API for real-time spot prices
- **WordPress Plugin**: Easy installation on EasyWP/Namecheap for API access
- **Auto-Refresh**: Automatic and manual refresh options for spot prices
- **API Management**: Intelligent caching to stay within API request limits
- **Refresh Button**: One-click manual updates of spot prices

## Key Features

- **Multi-Metal Support**: Track Silver, Gold, Platinum, and Palladium investments
- **Live Metal Prices**: Integration with metals.dev API for real-time spot prices
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

## Installation

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
**Last Updated**: August 6, 2025  
**Status**: Feature Complete ✅