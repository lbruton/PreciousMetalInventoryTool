<?php
if (!defined('ABSPATH')) {
    exit;
}

class PMS_API_Handler {

    private $cache_file_path;

    public function __construct() {
        $this->init_cache_directory();
    }

    /**
     * Initialize cache directory and set cache file path
     */
    public function init_cache_directory() {
        $upload_dir = wp_upload_dir();
        $cache_dir = $upload_dir['basedir'] . '/precious-metals-cache/';
        
        if (!file_exists($cache_dir)) {
            wp_mkdir_p($cache_dir);
            // Create .htaccess to protect cache files
            file_put_contents($cache_dir . '.htaccess', "Deny from all\n");
            // Create index.php for additional protection
            file_put_contents($cache_dir . 'index.php', "<?php\n// Silence is golden\n");
        }
        
        $this->cache_file_path = $cache_dir . 'prices.json';
    }

    /**
     * Get cache status for admin display
     * 
     * @return array Cache status information
     */
    public function get_cache_status() {
        $status = array(
            'file_exists' => file_exists($this->cache_file_path),
            'writable' => is_writable(dirname($this->cache_file_path)),
            'last_modified' => file_exists($this->cache_file_path) ? filemtime($this->cache_file_path) : 0,
            'size' => file_exists($this->cache_file_path) ? filesize($this->cache_file_path) : 0
        );
        
        return $status;
    }

    /**
     * Get cached prices from file
     * 
     * @param bool $force_fresh Only return fresh cache data
     * @return array|false Cached price data or false if not available/fresh
     */
    private function get_cached_prices($force_fresh = true) {
        if (!file_exists($this->cache_file_path)) {
            return false;
        }

        $cached_data = json_decode(file_get_contents($this->cache_file_path), true);
        
        if (!$cached_data || !isset($cached_data['timestamp'])) {
            return false;
        }

        if ($force_fresh) {
            $cache_age = time() - $cached_data['timestamp'];
            if ($cache_age > PMS_CACHE_DURATION) {
                return false; // Cache is stale
            }
        }

        return $cached_data['prices'];
    }

    /**
     * Save prices to cache file
     * 
     * @param array $prices Price data to cache
     * @return bool Success status
     */
    private function save_to_cache($prices) {
        $cache_data = array(
            'timestamp' => time(),
            'prices' => $prices
        );

        try {
            $result = file_put_contents($this->cache_file_path, json_encode($cache_data));
            return $result !== false;
        } catch (Exception $e) {
            error_log('PMS: Failed to write cache file: ' . $e->getMessage());
            return false;
        }
    }

    public function fetch_from_specific_api($api_number) {
        $apis = PMS_APIS;

        error_log("PMS: fetch_from_specific_api called for API {$api_number}");

        if (!isset($apis[$api_number])) {
            error_log("PMS: API {$api_number} not found in configuration");
            return false;
        }

        $api = $apis[$api_number];
        error_log("PMS: Processing {$api['name']}");

        if (!$api['enabled']) {
            error_log("PMS: {$api['name']} is disabled");
            return false;
        }

        // Check API key
        if (empty($api['key']) || strpos($api['key'], 'YOUR-') === 0) {
            error_log("PMS: {$api['name']} - API key not configured");
            return false;
        }

        error_log("PMS: Making API request to {$api['name']}");
        $result = $this->make_api_request($api);

        if ($result['success']) {
            error_log("PMS: API request successful, storing prices");
            
            // Store in database
            $stored = $this->store_prices($result['data'], $api['name']);
            
            // Store in file cache
            $cache_saved = $this->save_to_cache($this->format_prices_for_cache($result['data'], $api['name']));
            
            error_log("PMS: Database stored: " . ($stored ? 'SUCCESS' : 'FAILED'));
            error_log("PMS: Cache saved: " . ($cache_saved ? 'SUCCESS' : 'FAILED'));
            
            return $stored;
        } else {
            error_log("PMS: API request failed: " . $result['message']);
            return false;
        }
    }

    /**
     * Format prices for cache storage
     * 
     * @param array $rates Raw API rates data
     * @param string $source API source name
     * @return array Formatted price data
     */
    private function format_prices_for_cache($rates, $source) {
        $prices = array();
        foreach ($rates as $symbol => $price) {
            if (in_array($symbol, PMS_METALS)) {
                $prices[$symbol] = array(
                    'price' => floatval($price),
                    'source' => $source,
                    'timestamp' => time()
                );
            }
        }
        return $prices;
    }

    private function make_api_request($api) {
        $url = $api['url'] . '?access_key=' . $api['key'] . '&base=' . PMS_BASE_CURRENCY;
        $metals = implode(',', PMS_METALS);
        $url .= '&symbols=' . $metals;

        error_log("PMS: Request URL: " . $url);

        $response = wp_remote_get($url, array(
            'timeout' => 30,
            'headers' => array(
                'User-Agent' => 'WordPress-PreciousMetals/1.1'
            )
        ));

        if (is_wp_error($response)) {
            $error_message = $response->get_error_message();
            error_log("PMS: WP_Error: " . $error_message);
            return array('success' => false, 'message' => $error_message);
        }

        $response_code = wp_remote_retrieve_response_code($response);
        error_log("PMS: Response code: " . $response_code);

        if ($response_code !== 200) {
            return array('success' => false, 'message' => 'HTTP error: ' . $response_code);
        }

        $body = wp_remote_retrieve_body($response);
        error_log("PMS: Response body length: " . strlen($body));
        error_log("PMS: Response body preview: " . substr($body, 0, 200) . "...");

        $data = json_decode($body, true);

        if (!$data) {
            error_log("PMS: JSON decode failed");
            return array('success' => false, 'message' => 'Invalid JSON response');
        }

        if (!isset($data['rates']) || empty($data['rates'])) {
            error_log("PMS: No rates in response: " . print_r($data, true));
            return array('success' => false, 'message' => 'No rates data in response');
        }

        error_log("PMS: Found " . count($data['rates']) . " rates");

        return array(
            'success' => true,
            'data' => $data['rates'],
            'timestamp' => $data['timestamp'] ?? time()
        );
    }

    private function store_prices($rates, $source) {
        global $wpdb;
        $table_name = pms_get_table_name();

        error_log("PMS: Storing prices from {$source} to table {$table_name}");

        $stored_count = 0;
        foreach ($rates as $symbol => $price) {
            if (in_array($symbol, PMS_METALS)) {
                $result = $wpdb->insert(
                    $table_name,
                    array(
                        'metal_symbol' => $symbol,
                        'price' => $price,
                        'source' => $source,
                        'fetched_at' => current_time('mysql')
                    ),
                    array('%s', '%f', '%s', '%s')
                );

                if ($result) {
                    $stored_count++;
                    error_log("PMS: Stored {$symbol}: {$price}");
                } else {
                    error_log("PMS: Failed to store {$symbol}: " . $wpdb->last_error);
                }
            }
        }

        error_log("PMS: Stored {$stored_count} prices from {$source}");

        // Clean up old records
        $deleted = $wpdb->query("DELETE FROM {$table_name} WHERE fetched_at < DATE_SUB(NOW(), INTERVAL 7 DAY)");
        if ($deleted) {
            error_log("PMS: Cleaned up {$deleted} old records");
        }

        return $stored_count > 0;
    }

    public function get_latest_prices($force_refresh = false) {
        // Try cache first unless force refresh is requested
        if (!$force_refresh) {
            $cached_prices = $this->get_cached_prices(true);
            if ($cached_prices !== false) {
                error_log("PMS: Returning cached prices");
                return $cached_prices;
            }
        }

        // Fall back to database
        global $wpdb;
        $table_name = pms_get_table_name();

        $results = $wpdb->get_results("
            SELECT 
                metal_symbol,
                price,
                source,
                fetched_at
            FROM {$table_name} p1
            WHERE fetched_at = (
                SELECT MAX(fetched_at) 
                FROM {$table_name} p2 
                WHERE p2.metal_symbol = p1.metal_symbol
            )
        ", ARRAY_A);

        $latest_prices = array();
        foreach ($results as $row) {
            $latest_prices[$row['metal_symbol']] = array(
                'price' => (float) $row['price'],
                'source' => $row['source'],
                'timestamp' => strtotime($row['fetched_at'])
            );
        }

        // If we have database data but no cache, save to cache
        if (!empty($latest_prices)) {
            $this->save_to_cache($latest_prices);
        } else {
            // No database data, try stale cache as last resort
            $stale_cache = $this->get_cached_prices(false);
            if ($stale_cache !== false) {
                error_log("PMS: Returning stale cached prices as fallback");
                return $stale_cache;
            }
        }

        return $latest_prices;
    }
}
