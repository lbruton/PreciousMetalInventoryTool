# Integrating the WordPress Plugin with Precious Metal Inventory Tool

This guide explains how to integrate the Precious Metals API WordPress plugin with the main Precious Metal Inventory Tool.

## Overview

The Precious Metal Inventory Tool currently uses manually entered spot prices. This integration will allow the tool to fetch live spot prices from your WordPress site, which gets its data from the metals.dev API.

## 1. Installation Requirements

- WordPress installed on your EasyWP Namecheap hosting
- Precious Metals API plugin installed and activated on WordPress
- Precious Metal Inventory Tool files

## 2. WordPress Plugin Configuration

1. Install and activate the Precious Metals API plugin on your WordPress site
2. Navigate to **Settings > Precious Metals API**
3. Configure your metals.dev API key
4. Set an appropriate cache duration (recommended: 60 minutes)
5. Note your WordPress site URL (e.g., `https://yourdomain.com`)

## 3. Update the Configuration

Open the `spotAPI.js` file and update the `apiUrl` in the SPOT_API_CONFIG object to point to your WordPress site:

```javascript
const SPOT_API_CONFIG = {
    // WordPress site URL with REST API endpoint
    apiUrl: 'https://yourdomain.com/wp-json/precious-metals/v1/prices',
    
    // How often to check for updated prices (milliseconds)
    refreshInterval: 3600000, // 1 hour
    
    // Conversion between API symbols and our internal metal keys
    symbolMap: {
        'XAG': 'silver',
        'XAU': 'gold',
        'XPT': 'platinum',
        'XPD': 'palladium'
    }
};
```

Replace `https://yourdomain.com` with your actual WordPress site URL.

## 4. Testing the Integration

1. Open your application in a web browser
2. Check if the spot prices are being displayed
3. Click the "Refresh Prices" button to manually update prices
4. Prices should update automatically based on the configured refresh interval

## 5. Troubleshooting

- **No prices displayed**: Check WordPress plugin settings and API key
- **CORS errors**: Add appropriate headers in WordPress or use a CORS proxy
- **API limit exceeded**: Increase cache duration in WordPress plugin settings

## 6. Configuration Options

You can adjust the following settings in the `spotAPI.js` file:

- `refreshInterval`: How often prices are automatically refreshed (in milliseconds)
- Add custom error handling or display options

## 7. Additional Resources

- See the [API_INTEGRATION.md](API_INTEGRATION.md) document for more details
- Visit [metals.dev](https://metals.dev) for API documentation
