# Precious Metals API Plugin - File-Based Caching

A reliable WordPress plugin that fetches precious metals prices from multiple APIs with **bulletproof file-based caching** that works on any hosting provider.

## 🚀 Key Features

- **File-Based Caching**: Survives hosting provider cache purges and works on all shared hosting
- **Multiple API Support**: Automatic failover between metals.dev, metals-api.com, and metalpriceapi.com
- **REST API Endpoint**: Clean API for external consumption
- **WordPress Integration**: Simple shortcode and admin interface
- **Hosting-Independent**: No database dependencies, works everywhere

## 🎯 Why File-Based Caching?

Traditional WordPress caching (transients) often fails on shared hosting due to:
- Hosting providers clearing object cache
- Memory limitations
- Database connection issues
- Cache purging policies

Our file-based solution:
- ✅ Stores cache in protected `/wp-content/uploads/precious-metals-cache/` directory
- ✅ Survives hosting provider cache purges
- ✅ Works with any hosting provider
- ✅ Automatic fallback to stale cache during API outages
- ✅ No external dependencies

## 📦 Installation

1. **Upload Plugin Files**
   ```bash
   wp-content/plugins/precious-metals-api/
   ├── precious-metals-api.php
   ├── README.md
   └── css/style.css (optional)
   ```

2. **Activate Plugin**
   - Go to WordPress Admin > Plugins
   - Find "Precious Metals API" 
   - Click "Activate"

3. **Configure API Key** (Optional - includes default key)
   - Go to Settings > Precious Metals API
   - Enter your metals.dev API key
   - Set cache duration (default: 600 seconds)

## ⚙️ Configuration

### API Keys Setup

Edit the plugin file or use admin settings:

```php
// Default API key (included)
private $api_key = 'DPD98Z5TMCNMSYS0I2DA118S0I2DA';
```

For production, get your own key from:
- [Metals.dev](https://metals.dev) (Primary)
- [Metals-API.com](https://metals-api.com) (Fallback)
- [MetalpriceAPI.com](https://metalpriceapi.com) (Fallback)

### Cache Settings

```php
// Recommended cache durations:
// Development: 600 (10 minutes)
// Production: 3600 (1 hour) 
// High-traffic: 7200 (2 hours)
```

## 🔧 Usage

### Shortcode Examples

**Basic Display:**
```php
[metal_prices]
```

**Specific Metals:**
```php
[metal_prices metals="silver,gold"]
```

**List Layout:**
```php
[metal_prices layout="list" css_class="my-metal-prices"]
```

**All Options:**
```php
[metal_prices metals="silver,gold,platinum,palladium" layout="table" css_class="precious-metals-table" auto_refresh="true"]
```

### REST API Endpoints

**Get Current Prices:**
```bash
GET /wp-json/precious-metals/v1/prices
```

**Force Refresh:**
```bash
GET /wp-json/precious-metals/v1/prices?force=true
```

**Cache Status:**
```bash
GET /wp-json/precious-metals/v1/cache-status
```

### API Response Format

```json
{
  "XAG": {
    "price": 24.15,
    "timestamp": 1692264800
  },
  "XAU": {
    "price": 1956.42,
    "timestamp": 1692264800
  }
}
```

## 🛡️ Cache Management

### File Cache Location
```
/wp-content/uploads/precious-metals-cache/
├── prices.json          (Price data)
├── .htaccess           (Access protection)
└── index.php           (Additional security)
```

### Cache Status Indicators

In WordPress Admin:
- **✓ Fresh**: Cache is current and valid
- **⚠ Stale**: Cache exists but expired (still usable)
- **✗ Missing**: No cache file (will be created on first request)

### Manual Cache Management

**Clear Cache via Admin:**
1. Go to Settings > Precious Metals API
2. Click "Clear Cache" button

**Clear Cache via API:**
```bash
GET /wp-json/precious-metals/v1/prices?force=true
```

**Clear Cache via File System:**
```bash
rm -f /wp-content/uploads/precious-metals-cache/prices.json
```

## 🚨 Troubleshooting

### Common Issues & Solutions

**"Unable to fetch metal prices"**
- Check API key configuration
- Verify internet connectivity
- Look for cached data (may still display stale prices)

**Cache Directory Not Writable**
- Check file permissions: `chmod 755 wp-content/uploads/`
- Contact hosting provider if issues persist

**Stale Data Showing**
- This is normal during API outages
- Plugin automatically serves cached data as fallback
- Fresh data will return when API is available

**Plugin Not Working on Shared Hosting**
- File-based caching works on ALL hosting providers
- No special configuration required
- Check WordPress Admin for cache status

### Debug Information

Enable WordPress debug logging:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

Check logs at: `/wp-content/debug.log`

## 🔒 Security Features

- **Protected Cache Directory**: .htaccess prevents direct access
- **Input Sanitization**: All user inputs are properly sanitized
- **Permission Checks**: Admin functions require proper capabilities
- **Nonce Verification**: CSRF protection on API calls

## ⚡ Performance

- **Minimal Database Usage**: No database queries for cached data
- **Efficient File I/O**: JSON format for fast read/write
- **Smart Fallbacks**: Returns stale cache instead of failing
- **Configurable Duration**: Adjust cache time for your needs

## 🔄 Hosting Provider Compatibility

**Tested On:**
- ✅ Shared Hosting (Bluehost, HostGator, GoDaddy)
- ✅ Managed WordPress (WP Engine, Kinsta)
- ✅ VPS/Dedicated Servers
- ✅ Cloud Hosting (AWS, DigitalOcean)

**Works With:**
- All PHP versions 7.0+
- WordPress 5.0+
- Any hosting provider with file write permissions

## 📊 Monitoring

### Admin Dashboard

View real-time status at Settings > Precious Metals API:
- Cache file status
- Last update timestamp
- Directory permissions
- Current prices with freshness indicators

### API Monitoring

```bash
# Check cache status
curl https://yoursite.com/wp-json/precious-metals/v1/cache-status

# Get current prices
curl https://yoursite.com/wp-json/precious-metals/v1/prices
```

## 🔧 Advanced Configuration

### Custom Cache Duration

```php
// In your theme's functions.php or child theme:
add_filter('pre_option_precious_metals_api_cache_duration', function($value) {
    return 3600; // 1 hour
});
```

### Custom API Key

```php
add_filter('pre_option_precious_metals_api_key', function($value) {
    return 'YOUR-CUSTOM-API-KEY';
});
```

## 📈 Version History

### Version 1.1.0 (Current)
- ✨ **NEW**: File-based caching system
- 🛡️ Bulletproof hosting compatibility
- 📊 Enhanced admin dashboard with cache status
- 🚀 Improved performance and reliability
- 🔒 Additional security measures

### Version 1.0.0
- Initial release with transient caching
- Basic API integration
- Simple shortcode support

## 🤝 Support

### Common Solutions

1. **Plugin not displaying prices**: Check cache status in admin
2. **Stale data**: Normal behavior, shows cached data during API issues
3. **Permissions error**: Ensure `wp-content/uploads/` is writable
4. **API errors**: Plugin will continue showing cached data

### Getting Help

1. Check the admin dashboard for status information
2. Review WordPress debug logs
3. Test with `?force=true` parameter
4. Contact your hosting provider for file permission issues

---

**File-based caching ensures your precious metals prices are always available, regardless of hosting provider limitations or API outages.**
