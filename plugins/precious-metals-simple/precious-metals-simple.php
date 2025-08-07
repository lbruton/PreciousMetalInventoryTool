<?php
if (!defined('ABSPATH')) {
    exit;
}

class PMS_REST_Endpoint {

    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
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
                )
            )
        ));

        register_rest_route('precious-metals/v1', '/status', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_status'),
            'permission_callback' => '__return_true'
        ));
    }

    public function get_prices($request) {
        $format = $request->get_param('format');

        // Check cache first
        $cache_key = 'pms_latest_prices_' . $format;
        $cached = get_transient($cache_key);

        if ($cached !== false) {
            return rest_ensure_response($cached);
        }

        $handler = new PMS_API_Handler();
        $prices = $handler->get_latest_prices();

        if (empty($prices)) {
            return new WP_Error('no_data', 'No price data available', array('status' => 404));
        }

        $formatted = ($format === 'app') ? $this->format_for_app($prices) : $prices;

        // Cache for 10 minutes
        set_transient($cache_key, $formatted, 600);

        return rest_ensure_response($formatted);
    }

    public function get_status($request) {
        global $wpdb;
        $table_name = pms_get_table_name();

        $last_update = $wpdb->get_var("SELECT MAX(fetched_at) FROM {$table_name}");
        $record_count = $wpdb->get_var("SELECT COUNT(*) FROM {$table_name} WHERE fetched_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)");

        return rest_ensure_response(array(
            'plugin_version' => PMS_VERSION,
            'last_update' => $last_update,
            'records_24h' => (int) $record_count,
            'status' => $last_update ? 'active' : 'no_data',
            'schedule' => 'twice_daily'
        ));
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
