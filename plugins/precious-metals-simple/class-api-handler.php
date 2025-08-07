<?php
if (!defined('ABSPATH')) {
    exit;
}

class PMS_API_Handler {

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
            $stored = $this->store_prices($result['data'], $api['name']);
            error_log("PMS: Prices stored: " . ($stored ? 'SUCCESS' : 'FAILED'));
            return $stored;
        } else {
            error_log("PMS: API request failed: " . $result['message']);
            return false;
        }
    }

    private function make_api_request($api) {
        $url = $api['url'] . '?access_key=' . $api['key'] . '&base=' . PMS_BASE_CURRENCY;
        $metals = implode(',', PMS_METALS);
        $url .= '&symbols=' . $metals;

        error_log("PMS: Request URL: " . $url);

        $response = wp_remote_get($url, array(
            'timeout' => 30,
            'headers' => array(
                'User-Agent' => 'WordPress-PreciousMetals/1.0'
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

    public function get_latest_prices() {
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

        return $latest_prices;
    }
}
