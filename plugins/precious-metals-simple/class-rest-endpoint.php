<?php
if (!defined('ABSPATH')) {
    exit;
}

class PMS_REST_Endpoint {

    private $api_handler;

    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
        $this->api_handler = new PMS_API_Handler();
    }

    public function register_routes() {
        register_rest_route('precious-metals/v1', '/prices', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_prices'),
            'permission_callback' => '__return_true',
            'args' => array(
                'format' => array(
                    'default' => 'app',
                    'sanitize_callback' => 'sanitize_text_field'
                ),
                'force' => array(
                    'default' => 'false',
                    'sanitize_callback' => 'sanitize_text_field'
                )
            )
        ));

        register_rest_route('precious-metals/v1', '/status', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_status'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route('precious-metals/v1', '/cache-status', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_cache_status'),
            'permission_callback' => '__return_true'
        ));
    }

    public function get_prices($request) {
        $format = $request->get_param('format');
        $force_refresh = $request->get_param('force') === 'true';

        // Check cache first unless force refresh
        if (!$force_refresh) {
            $cache_key = 'pms_rest_prices_' . $format;
            $cached = get_transient($cache_key);

            if ($cached !== false) {
                return rest_ensure_response($cached);
            }
        }

        $prices = $this->api_handler->get_latest_prices($force_refresh);

        if (empty($prices)) {
            return new WP_Error('no_data', 'No price data available', array('status' => 404));
        }

        $formatted = ($format === 'app') ? $this->format_for_app($prices) : $prices;

        // Cache for 5 minutes for REST API responses
        set_transient('pms_rest_prices_' . $format, $formatted, 300);

        return rest_ensure_response($formatted);
    }

    public function get_status($request) {
        global $wpdb;
        $table_name = pms_get_table_name();

        $last_update = $wpdb->get_var("SELECT MAX(fetched_at) FROM {$table_name}");
        $record_count = $wpdb->get_var("SELECT COUNT(*) FROM {$table_name} WHERE fetched_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)");

        $cache_status = $this->api_handler->get_cache_status();

        return rest_ensure_response(array(
            'plugin_version' => PMS_VERSION,
            'last_update' => $last_update,
            'records_24h' => (int) $record_count,
            'status' => $last_update ? 'active' : 'no_data',
            'schedule' => 'twice_daily',
            'cache' => array(
                'type' => 'file',
                'file_exists' => $cache_status['file_exists'],
                'writable' => $cache_status['writable'],
                'last_modified' => $cache_status['last_modified'] ? date('Y-m-d H:i:s', $cache_status['last_modified']) : null,
                'size_bytes' => $cache_status['size']
            )
        ));
    }

    public function get_cache_status($request) {
        $cache_status = $this->api_handler->get_cache_status();
        
        $status = array(
            'cache_type' => 'file',
            'cache_file_exists' => $cache_status['file_exists'],
            'cache_writable' => $cache_status['writable'],
            'cache_duration' => PMS_CACHE_DURATION,
            'last_update' => $cache_status['last_modified'] ? date('Y-m-d H:i:s', $cache_status['last_modified']) : null,
            'cache_size_bytes' => $cache_status['size'],
            'is_fresh' => false
        );

        if ($cache_status['file_exists'] && $cache_status['last_modified']) {
            $cache_age = time() - $cache_status['last_modified'];
            $status['is_fresh'] = $cache_age < PMS_CACHE_DURATION;
            $status['cache_age_seconds'] = $cache_age;
            $status['cache_age_human'] = human_time_diff($cache_status['last_modified']);
        }

        return rest_ensure_response($status);
    }

    private function format_for_app($prices) {
        $formatted = array();
        foreach ($prices as $symbol => $data) {
            $formatted[$symbol] = array(
                'price' => $data['price'],
                'timestamp' => $data['timestamp'],
                'source' => $data['source']
            );
        }
        return $formatted;
    }
}
