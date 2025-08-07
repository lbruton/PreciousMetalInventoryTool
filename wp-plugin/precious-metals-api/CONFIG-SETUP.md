# 🔧 Config File Setup - No WordPress Admin Needed!

## 🎯 **Perfect Solution for WordPress Admin Issues**

This version completely bypasses WordPress admin pages and uses a simple **config file** approach. No more admin page conflicts!

## 📁 **What You Get:**

- ✅ **`precious-metals-config.php`** - Main plugin (no admin dependencies)
- ✅ **`settings.conf`** - Simple config file (auto-generated)
- ✅ **Multi-API fallback** - Automatic failover between APIs
- ✅ **Zero admin pages** - Just activate and configure file
- ✅ **Works everywhere** - No WordPress conflicts

---

## 🚀 **3-Step Setup (2 Minutes)**

### Step 1: Activate Plugin
1. **Deactivate** any existing precious metals plugins
2. **Activate** "Precious Metals API - Config File Version"
3. **Done!** No settings page needed

### Step 2: Get FREE API Key
1. Go to **[Metals-API.com](https://metals-api.com/)**
2. Click **"Get Free API Key"**
3. Sign up with your email
4. **Copy your API key** (looks like: `abc123def456ghi789`)

### Step 3: Edit Config File
1. Go to your plugin folder: `/wp-content/plugins/precious-metals-api/`
2. Open **`settings.conf`** in any text editor
3. Find this line:
   ```
   key = ""  # PASTE YOUR API KEY HERE
   ```
4. Replace with your key:
   ```
   key = "abc123def456ghi789"  # PASTE YOUR API KEY HERE
   ```
5. **Save the file**

**That's it! Your site now has precious metals pricing!**

---

## 📝 **Sample Config File:**

```ini
# Precious Metals API Configuration File
# Edit this file to configure your API keys and settings

# ===== GENERAL SETTINGS =====
[general]
cache_duration = 600  # Cache duration in seconds (600 = 10 minutes)

# ===== API CONFIGURATIONS =====
[api_metals_api]
name = "Metals-API.com"
url = "https://api.metals-api.com/v1/latest"
key = "YOUR-API-KEY-HERE"  # ← EDIT THIS LINE
enabled = true
priority = 1  # Lower number = higher priority

[api_metalprice_api]
name = "MetalpriceAPI.com"
url = "https://api.metalpriceapi.com/v1/latest"
key = ""  # Optional backup API
enabled = false
priority = 2

[api_metals_dev]
name = "Metals.dev"
url = "https://api.metals.dev/v1/spot"
key = ""  # Optional when metals.dev comes back online
enabled = false
priority = 3
```

---

## 🎨 **Using on Your Site:**

### Basic Usage:
```
[precious_metals]
```

### Advanced Options:
```
[precious_metals metals="gold,silver" layout="table" show_source="true"]
```

### Available Options:
- **`metals`** - Which metals to show: `"gold,silver,platinum,palladium"`
- **`layout`** - Display format: `"table"` or `"inline"`
- **`show_source`** - Show API source: `"true"` or `"false"`
- **`class`** - Custom CSS class for styling

---

## 🔧 **Configuration Options:**

### Multiple APIs (Recommended):
```ini
# Primary API (1,000 free requests/month)
[api_metals_api]
key = "your-metals-api-key"
enabled = true
priority = 1

# Backup API (100 free requests/month)  
[api_metalprice_api]
key = "your-metalprice-api-key"
enabled = true
priority = 2
```

### Cache Settings:
```ini
[general]
cache_duration = 600    # 10 minutes (recommended)
cache_duration = 300    # 5 minutes (more current)
cache_duration = 1800   # 30 minutes (conserve API calls)
```

---

## 🆘 **Troubleshooting:**

### Problem: No prices showing
**Solution:**
1. Check that `settings.conf` exists in plugin folder
2. Verify API key is between quotes: `key = "your-key"`
3. Make sure `enabled = true` for at least one API
4. Test your API key at the provider's website

### Problem: Config file not found
**Solution:**
1. Make sure plugin is **activated**
2. Check file permissions (should be 644)
3. Plugin will auto-create the file on activation

### Problem: API errors
**Solution:**
1. Verify API key is correct (no extra spaces)
2. Check you haven't exceeded rate limits
3. Try a different API as backup

---

## 📊 **Check Configuration Status:**

Visit this URL to check your setup:
```
https://yoursite.com/wp-json/precious-metals/v1/config-status
```

This will show:
- ✅ Config file status
- ✅ Number of APIs configured
- ✅ Cache duration
- ✅ Last update time

---

## 🎯 **File Locations:**

```
/wp-content/plugins/precious-metals-api/
├── precious-metals-config.php  ← Main plugin
├── settings.conf              ← Config file (EDIT THIS)
├── css/precious-metals.css    ← Styling
└── CONFIG-SETUP.md           ← This guide
```

---

## 💡 **Pro Tips:**

1. **Start with Metals-API.com** - 1,000 free requests/month
2. **Add backup APIs** for maximum reliability
3. **Use 600 second cache** to conserve API requests
4. **Test with one API first**, then add others
5. **Keep your API keys private** - don't share the config file

---

## 🔒 **Security Notes:**

- Config file is not web-accessible
- API keys are stored securely in plugin folder
- No database storage required
- Works with any file permissions

---

## ✅ **Advantages of Config File Approach:**

- ✅ **No WordPress admin conflicts**
- ✅ **Version control friendly** 
- ✅ **Easy to backup and restore**
- ✅ **Works with any hosting**
- ✅ **Simple text file editing**
- ✅ **No database dependencies**
- ✅ **Portable between sites**

---

## 🎉 **Success Checklist:**

- [ ] Plugin activated
- [ ] `settings.conf` file exists
- [ ] API key added to config file
- [ ] `enabled = true` for at least one API  
- [ ] Shortcode `[precious_metals]` added to page
- [ ] Prices displaying correctly

**Your site now has bulletproof precious metals pricing with zero admin hassles!**

---

*Need help? Check the `/wp-json/precious-metals/v1/config-status` endpoint to debug your setup.*
