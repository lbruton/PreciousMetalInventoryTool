# Metals.dev API Integration

This document describes how the Precious Metal Inventory Tool integrates with the metals.dev API to provide live spot prices for silver, gold, platinum, and palladium.

## Overview

The application now features live metal price updates through:

1. A WordPress plugin that acts as a proxy for the metals.dev API
2. JavaScript integration that fetches prices from the WordPress API
3. Automatic and manual refresh capabilities

## API Key Management

The metals.dev API key (`SD92QFY7UJFZYSPGWRSA540PGWRSA`) is stored securely in the WordPress plugin configuration, not in the client-side application. This prevents exposure of the API key in the browser.

## WordPress Plugin

The WordPress plugin (`/wp-plugin/precious-metals-api.php`) provides:

- REST API endpoint for metal prices
- Caching to reduce API requests
- Admin interface for configuration
- Shortcode for displaying prices on WordPress pages

### Plugin Installation

1. Install the plugin on a WordPress site (preferably EasyWP on Namecheap)
2. Configure the API key and cache duration in Settings > Precious Metals API
3. The plugin automatically creates REST endpoints at `/wp-json/precious-metals/v1/prices`

## Client Integration

The client-side integration (`/app/js/spotAPI.js`) provides:

- Automatic fetching of spot prices on application load
- Periodic refresh based on configurable intervals
- Manual refresh via the "Refresh Prices" button
- Proper error handling and fallback to cached prices

## API Usage Considerations

The metals.dev API has a limit of 2000 requests per month. To stay within this limit:

- The WordPress plugin caches prices (default: 60 minutes)
- The client application limits automatic refreshes
- Manual refresh is available for immediate updates

### Recommended Settings

For optimal usage of the 2000 monthly request limit:

| Setting | Value | Requests/Month | Purpose |
|---------|-------|---------------|---------|
| WordPress Cache | 60 minutes | ~720 | Website visitors |
| Client Refresh | 4 hours | ~180 | App users |
| Manual Refreshes | As needed | ~100 | User-initiated |
| Development/Testing | Reserved | ~1000 | Development |

## Implementation Details

### Metal Symbol Mapping

The metals.dev API uses standard ISO symbols for metals, which are mapped to our application's metal keys:

| API Symbol | Application Key | Metal Name |
|------------|----------------|------------|
| XAG | silver | Silver |
| XAU | gold | Gold |
| XPT | platinum | Platinum |
| XPD | palladium | Palladium |

### Data Flow

1. WordPress plugin fetches data from metals.dev API
2. Plugin caches data in WordPress transients
3. Client application requests data from WordPress REST API
4. Application stores prices in localStorage
5. Prices are displayed and used for calculations

## Fallback Mechanism

If the API is unavailable, the application:

1. Uses cached prices from localStorage
2. Shows an error message when refreshing
3. Allows manual entry of spot prices

## Future Enhancements

Planned improvements for the API integration:

1. Historical price charts
2. Price alerts/notifications
3. Additional metals support
4. Multiple currency options

## Troubleshooting

Common issues and solutions:

- **No prices displayed**: Check WordPress plugin settings and API key
- **Outdated prices**: Use the manual refresh button or check cache settings
- **API limit exceeded**: Increase cache duration in WordPress plugin
- **CORS errors**: Add appropriate headers in WordPress plugin

## Resources

- [metals.dev API Documentation](https://metals.dev/documentation)
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
