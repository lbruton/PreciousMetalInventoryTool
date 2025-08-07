# Precious Metals API - WordPress Plugin

## 🎯 **Simple, Reliable Multi-API Precious Metals Pricing**

WordPress plugin that displays live precious metal prices (Gold, Silver, Platinum, Palladium) with **automatic multi-API fallback** for maximum reliability.

---

## ✨ **Key Features**

- ✅ **Multi-API Fallback** - Automatic failover between multiple APIs
- ✅ **Config File Setup** - No WordPress admin dependencies  
- ✅ **1,000+ Free Requests/Month** - High-limit free APIs
- ✅ **Responsive Design** - Works on all devices
- ✅ **Easy Integration** - Simple shortcode usage
- ✅ **Auto-caching** - Conserves API requests
- ✅ **Zero Conflicts** - No admin page dependencies

---

## 🚀 **Quick Start (2 Minutes)**

### 1. Activate Plugin
- Upload plugin folder to `/wp-content/plugins/`
- Activate **"Precious Metals API - Config File Version"**

### 2. Get FREE API Key
- Sign up at [Metals-API.com](https://metals-api.com/) (1,000 free requests/month)
- Copy your API key

### 3. Configure
- Edit `/wp-content/plugins/precious-metals-api/settings.conf`
- Find: `key = ""`
- Change to: `key = "your-api-key-here"`
- Save file

### 4. Use on Your Site
```
[precious_metals]
```

**Done! Live prices will appear on your site.**

---

## 📊 **Shortcode Options**

### Basic Usage:
```
[precious_metals]
```

### Advanced Options:
```
[precious_metals metals="gold,silver" layout="inline" show_source="true"]
```

#### Available Parameters:
- **`metals`** - Which metals: `"gold,silver,platinum,palladium"`
- **`layout`** - Format: `"table"` or `"inline"`  
- **`show_source`** - Show API source: `"true"` or `"false"`
- **`class`** - Custom CSS class for styling

---

## 🔧 **Multi-API Configuration**

Configure multiple APIs for maximum reliability:

```ini
# Primary API (1,000 free requests/month)
[api_metals_api]
name = "Metals-API.com"
key = "your-metals-api-key"
enabled = true
priority = 1

# Backup API (100 free requests/month)
[api_metalprice_api]
name = "MetalpriceAPI.com" 
key = "your-backup-key"
enabled = true
priority = 2
```

### Supported APIs:
1. **[Metals-API.com](https://metals-api.com/)** - 1,000 free requests/month ⭐ **Recommended**
2. **[MetalpriceAPI.com](https://metalpriceapi.com/)** - 100 free requests/month
3. **[Metals.dev](https://metals.dev/)** - 100 free requests/month

---

## 📁 **File Structure**

```
precious-metals-api/
├── precious-metals-config.php    # Main plugin file
├── settings.conf                 # Configuration file (auto-created)
├── css/precious-metals.css       # Styling
├── CONFIG-SETUP.md              # Detailed setup guide
└── README.md                    # This file
```

---

## 🔧 **Configuration File Example**

The plugin auto-creates `settings.conf` with this structure:

```ini
# Precious Metals API Configuration

[general]
cache_duration = 600  # 10 minutes cache

[api_metals_api]
name = "Metals-API.com"
url = "https://api.metals-api.com/v1/latest"
key = "YOUR-API-KEY-HERE"  # ← Edit this line
enabled = true
priority = 1
```

---

## 🎨 **Styling & Customization**

### Default CSS Classes:
- `.precious-metals-display` - Main container
- `.precious-metals-table` - Table layout
- `.metal-gold`, `.metal-silver`, etc. - Metal-specific styling
- `.metal-price` - Price values

### Custom Styling Example:
```css
.precious-metals-display {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
}

.metal-price {
    font-size: 1.2em;
    font-weight: bold;
    color: #2c5aa0;
}
```

---

## 🔍 **API Status & Debugging**

### Check Configuration:
Visit: `yoursite.com/wp-json/precious-metals/v1/config-status`

### Get Current Prices:
Visit: `yoursite.com/wp-json/precious-metals/v1/prices`

### Force Refresh:
Visit: `yoursite.com/wp-json/precious-metals/v1/prices?force=true`

---

## 🆘 **Troubleshooting**

### No Prices Showing:
1. ✅ Check `settings.conf` file exists
2. ✅ Verify API key format: `key = "abc123def"`
3. ✅ Ensure `enabled = true` for at least one API
4. ✅ Test API key at provider's website

### Configuration Issues:
1. ✅ Plugin creates config file automatically on activation
2. ✅ Check file permissions (644 recommended)
3. ✅ Verify no extra spaces around API key
4. ✅ Check WordPress error logs

### API Errors:
1. ✅ Verify you haven't exceeded rate limits
2. ✅ Try backup API if primary fails
3. ✅ Check API service status at provider website

---

## 💡 **Pro Tips**

- **Start with Metals-API.com** - highest free tier (1,000 requests/month)
- **Configure backup APIs** for maximum uptime
- **Use 600-second cache** to conserve API requests  
- **Monitor your usage** to avoid hitting rate limits
- **Test configuration** using the status endpoints

---

## 🔒 **Security & Performance**

- ✅ **Config file security** - Not web-accessible
- ✅ **API key protection** - Stored securely in plugin folder
- ✅ **Intelligent caching** - Reduces API calls automatically
- ✅ **Error handling** - Graceful fallback between APIs
- ✅ **Rate limit compliance** - Built-in request throttling

---

## 📄 **License**

GPL v2 or later

---

## 🆕 **Version History**

### v2.1.0 - Config File Version
- ✨ Config file approach - no admin dependencies
- ✨ Multi-API fallback system
- ✨ Auto-generated configuration with examples
- ✨ Built-in status checking and debugging
- 🔧 Improved error handling and reliability

---

## 📞 **Support**

1. **Read** `CONFIG-SETUP.md` for detailed setup instructions
2. **Check** configuration status via REST API endpoints  
3. **Verify** API keys are working at provider websites
4. **Test** with single API first, then add backups

---

## ✅ **Why Choose This Plugin?**

| Feature | This Plugin | Others |
|---------|-------------|---------|
| **Admin Dependencies** | ✅ None | ❌ Required |
| **API Reliability** | ✅ Multi-API fallback | ❌ Single API |
| **Setup Complexity** | ✅ Edit 1 file | ❌ Complex admin |
| **Hosting Compatibility** | ✅ Universal | ❌ May have issues |
| **Free Requests** | ✅ 1,000+/month | ❌ Usually 100 |
| **WordPress Conflicts** | ✅ None | ❌ Possible |

---

**🎉 Get started in 2 minutes - just activate, add an API key, and you're live!**
