# Precious Metals API WordPress Plugin

This WordPress plugin provides live precious metal prices from the metals.dev API for integration with the Precious Metal Inventory Tool.

## Features

- **Live Spot Prices**: Fetches current spot prices for Silver, Gold, Platinum, and Palladium
- **Shortcode Support**: Easy integration with any WordPress page or post
- **REST API Endpoint**: Access metal prices programmatically
- **Configurable Cache**: Control how frequently prices update
- **Auto-Refresh**: Client-side refresh capability to keep prices current
- **Responsive Design**: Works well on all devices

## Installation

1. Upload the `precious-metals-api` directory to your `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Configure your metals.dev API key in the plugin settings

## Configuration

Navigate to **Settings > Precious Metals API** in your WordPress admin area to configure:

- **API Key**: Your metals.dev API key (default: SD92QFY7UJFZYSPGWRSA540PGWRSA)
- **Cache Duration**: How long to cache prices (in seconds, default: 600 seconds/10 minutes)

## Usage

### Shortcode

Add metal prices to any page or post using the shortcode:

```
[metal_prices]
```

#### Shortcode Options

- `metals`: Comma-separated list of metals to display (default: `silver,gold,platinum,palladium`)
- `layout`: Display format, either `table` or `list` (default: `table`)
- `css_class`: Custom CSS class for styling (default: `precious-metals-table`)
- `auto_refresh`: Enable/disable client-side auto-refresh (default: `true`)

Example with options:

```
[metal_prices metals="gold,silver" layout="list" css_class="my-custom-class" auto_refresh="false"]
```

### REST API

The plugin exposes a REST API endpoint for accessing metal prices programmatically:

```
GET /wp-json/precious-metals/v1/prices
```

Optional parameters:
- `force=true`: Force refresh prices from the API instead of using cached data

## API Consumption Considerations

The metals.dev API has a limit of 2000 requests per month. The plugin is configured to balance refresh frequency with API limits:

- Default cache duration: 10 minutes (144 requests per day)
- Monthly usage: ~4,320 requests (exceeds the 2,000 limit)

**Recommended settings for production:**
- Set cache duration to 1 hour (24 requests per day, ~720 per month)
- This leaves ~1,280 requests for development and testing

## Development and Testing

A test HTML file (`test.html`) is included to demonstrate how to fetch and display metal prices from the WordPress REST API. This file can be used for development and testing without making actual API calls.

## Integration with Precious Metal Inventory Tool

To integrate with the main Precious Metal Inventory Tool:

1. Ensure the WordPress plugin is active and configured
2. Update the metals API endpoint in your Inventory Tool's configuration
3. Set the API refresh rate to match your WordPress plugin's cache duration

## Customization

The plugin includes CSS styles that can be customized to match your theme. The main classes are:

- `.precious-metals-table`: Table display style
- `.precious-metal-item`: List item display style
- `.precious-metal-name`: Metal name style
- `.precious-metal-price`: Price display style
- `.precious-metals-updated`: Last updated timestamp style

Metal-specific classes are also available:
- `.precious-metal-silver-price`
- `.precious-metal-gold-price`
- `.precious-metal-platinum-price`
- `.precious-metal-palladium-price`

## License

This plugin is open source and available for personal use, matching the license of the main Precious Metal Inventory Tool.

## Version

Version 1.0.0
