<?php
if (!defined('ABSPATH')) {
    exit;
}

// API Configuration
define('PMS_APIS', array(
    1 => array(
        'name' => 'Metals-API.com',
        'url' => 'https://api.metals-api.com/v1/latest',
        'key' => 'YOUR-METALS-API-KEY-HERE',
        'enabled' => true
    ),
    2 => array(
        'name' => 'MetalpriceAPI.com', 
        'url' => 'https://api.metalpriceapi.com/v1/latest',
        'key' => 'YOUR-METALPRICE-API-KEY-HERE',
        'enabled' => true
    ),
    3 => array(
        'name' => 'Metals.dev',
        'url' => 'https://api.metals.dev/v1/latest',
        'key' => 'YOUR-METALS-DEV-KEY-HERE',
        'enabled' => true
    )
));

// Metals to track
define('PMS_METALS', array('XAU', 'XAG', 'XPT', 'XPD'));

// Base currency
define('PMS_BASE_CURRENCY', 'USD');

// Cache duration (1 hour in seconds)
define('PMS_CACHE_DURATION', 3600);

// Database table name
function pms_get_table_name() {
    global $wpdb;
    return $wpdb->prefix . 'precious_metals_prices';
}
