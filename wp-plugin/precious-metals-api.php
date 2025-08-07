<?php
/**
 * Plugin Name: Precious Metals API
 * Plugin URI: https://github.com/username/PreciousMetalInventoryTool
 * Description: Provides live precious metal prices from metals.dev API
 * Version: 1.0.0
 * Author: Your Name
 * Text Domain: precious-metals-api
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class Precious_Metals_API {
    // API key for metals.dev
    private $api_key = 'SD92QFY7UJFZYSPGWRSA540PGWRSA';
    
    // Transient cache keys
    private $transient_key = 'precious_metals_api_data';
    
    // Cache duration in seconds (10 minutes)
    private $cache_duration = 600;
    
    // Metals to track
    private $metals = array('XAG', 'XAU', 'XPT', 'XPD');
    
    /**
     * Constructor
     */
    public function __construct() {
        // Register shortcode for displaying metal prices
        add_shortcode('metal_prices', array($this, 'metal_prices_shortcode'));
        
        // Register REST API endpoint
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        
        // Add admin menu
        add_action('admin_menu', array($this, 'add_admin_menu'));
        
        // Register settings
        add_action('admin_init', array($this, 'register_settings'));
        
        // Enqueue scripts and styles
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_enqueue_scripts', array($this, 'admin_enqueue_scripts'));
    }
    
    /**
     * Enqueue scripts and styles for frontend
     */
    public function enqueue_scripts() {
        wp_enqueue_style(
            'precious-metals-api-styles',
            plugin_dir_url(__FILE__) . 'css/style.css',
            array(),
            '1.0.0'
        );
        
        wp_enqueue_script(
            'precious-metals-api-script',
            plugin_dir_url(__FILE__) . 'js/precious-metals-api.js',
            array('jquery'),
            '1.0.0',
            true
        );
        
        // Pass data to JavaScript
        wp_localize_script(
            'precious-metals-api-script',
            'PreciousMetalsAPI_Data',
            array(
                'api_url' => rest_url('precious-metals/v1/prices'),
                'refresh_interval' => get_option('precious_metals_api_cache_duration', $this->cache_duration) * 1000, // Convert to milliseconds
                'nonce' => wp_create_nonce('wp_rest')
            )
        );
    }
    
    /**
     * Enqueue scripts and styles for admin
     */
    public function admin_enqueue_scripts($hook) {
        // Only load on plugin settings page
        if ($hook != 'settings_page_precious-metals-api') {
            return;
        }
        
        wp_enqueue_style(
            'precious-metals-api-admin-styles',
            plugin_dir_url(__FILE__) . 'css/style.css',
            array(),
            '1.0.0'
        );
    }
    
    /**
     * Register REST API routes
     */
    public function register_rest_routes() {
        register_rest_route('precious-metals/v1', '/prices', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_metal_prices_api'),
            'permission_callback' => '__return_true'
        ));
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_options_page(
            'Precious Metals API Settings',
            'Precious Metals API',
            'manage_options',
            'precious-metals-api',
            array($this, 'admin_page')
        );
    }
    
    /**
     * Register settings
     */
    public function register_settings() {
        register_setting('precious_metals_api_settings', 'precious_metals_api_key');
        register_setting('precious_metals_api_settings', 'precious_metals_api_cache_duration', array(
            'default' => 600,
            'sanitize_callback' => 'absint',
        ));
    }
    
    /**
     * Admin settings page
     */
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('precious_metals_api_settings');
                do_settings_sections('precious_metals_api_settings');
                ?>
                <table class="form-table">
                    <tr>
                        <th scope="row">API Key</th>
                        <td>
                            <input type="text" name="precious_metals_api_key" 
                                value="<?php echo esc_attr(get_option('precious_metals_api_key', $this->api_key)); ?>" class="regular-text">
                            <p class="description">Your metals.dev API key</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Cache Duration</th>
                        <td>
                            <input type="number" name="precious_metals_api_cache_duration" 
                                value="<?php echo esc_attr(get_option('precious_metals_api_cache_duration', $this->cache_duration)); ?>" min="60" step="60" class="small-text">
                            <p class="description">How long to cache prices (in seconds). Default: 600 (10 minutes)</p>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
            
            <h2>Current Prices</h2>
            <div id="precious-metals-current-prices">
                <?php 
                $prices = $this->fetch_metal_prices();
                if (!empty($prices)) {
                    echo '<table class="widefat">';
                    echo '<thead><tr><th>Metal</th><th>Symbol</th><th>Price (USD)</th><th>Last Updated</th></tr></thead>';
                    echo '<tbody>';
                    
                    foreach ($prices as $symbol => $data) {
                        if (isset($data['price']) && isset($data['timestamp'])) {
                            $metal_name = $this->get_metal_name($symbol);
                            echo '<tr>';
                            echo '<td>' . esc_html($metal_name) . '</td>';
                            echo '<td>' . esc_html($symbol) . '</td>';
                            echo '<td>$' . number_format($data['price'], 2) . '</td>';
                            echo '<td>' . esc_html(date('Y-m-d H:i:s', $data['timestamp'])) . '</td>';
                            echo '</tr>';
                        }
                    }
                    
                    echo '</tbody></table>';
                } else {
                    echo '<p>Unable to fetch metal prices. Please check your API key.</p>';
                }
                ?>
            </div>
            
            <h2>Shortcode Usage</h2>
            <p>Use the shortcode <code>[metal_prices]</code> to display metal prices on any page or post.</p>
            <p>You can also use the REST API endpoint: <code><?php echo esc_url(rest_url('precious-metals/v1/prices')); ?></code></p>
        </div>
        <?php
    }
    
    /**
     * Convert metal symbol to readable name
     */
    private function get_metal_name($symbol) {
        $names = array(
            'XAG' => 'Silver',
            'XAU' => 'Gold',
            'XPT' => 'Platinum',
            'XPD' => 'Palladium'
        );
        
        return isset($names[$symbol]) ? $names[$symbol] : $symbol;
    }
    
    /**
     * Convert readable name to metal symbol
     */
    private function get_metal_symbol($name) {
        $symbols = array(
            'silver' => 'XAG',
            'gold' => 'XAU',
            'platinum' => 'XPT',
            'palladium' => 'XPD'
        );
        
        $name = strtolower($name);
        return isset($symbols[$name]) ? $symbols[$name] : $name;
    }
    
    /**
     * Fetch metal prices from metals.dev API or cache
     * 
     * @param bool $force_refresh Whether to force a refresh regardless of cache
     * @return array Metal prices data
     */
    public function fetch_metal_prices($force_refresh = false) {
        // Try to get cached data first
        $cached_data = get_transient($this->transient_key);
        
        if (false !== $cached_data && !$force_refresh) {
            return $cached_data;
        }
        
        // Get settings
        $api_key = get_option('precious_metals_api_key', $this->api_key);
        $cache_duration = get_option('precious_metals_api_cache_duration', $this->cache_duration);
        
        // Prepare API request
        $api_url = 'https://api.metals.dev/v1/spot';
        $symbols = implode(',', $this->metals);
        $request_url = add_query_arg(array(
            'api_key' => $api_key,
            'symbols' => $symbols,
            'currency' => 'USD'
        ), $api_url);
        
        // Make API request
        $response = wp_remote_get($request_url);
        
        // Check for errors
        if (is_wp_error($response)) {
            return array();
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        // Process and structure the data
        $prices = array();
        
        if (isset($data['data']) && !empty($data['data'])) {
            foreach ($data['data'] as $item) {
                if (isset($item['symbol']) && isset($item['price'])) {
                    $prices[$item['symbol']] = array(
                        'price' => floatval($item['price']),
                        'timestamp' => time()
                    );
                }
            }
            
            // Cache the data
            set_transient($this->transient_key, $prices, $cache_duration);
            
            // Store the timestamp separately
            set_transient($this->transient_key . '_timestamp', time(), $cache_duration);
        }
        
        return $prices;
    }
    
    /**
     * REST API endpoint callback
     */
    public function get_metal_prices_api($request) {
        // Check if we should force refresh
        $force_refresh = $request->get_param('force') === 'true';
        $prices = $this->fetch_metal_prices($force_refresh);
        
        if (empty($prices)) {
            return new WP_Error('no_prices', 'Unable to fetch metal prices', array('status' => 404));
        }
        
        return new WP_REST_Response($prices, 200);
    }
    
    /**
     * Shortcode for displaying metal prices
     */
    public function metal_prices_shortcode($atts) {
        $atts = shortcode_atts(array(
            'metals' => 'silver,gold,platinum,palladium',
            'layout' => 'table',
            'css_class' => 'precious-metals-table',
            'auto_refresh' => 'true'
        ), $atts, 'metal_prices');
        
        $metals_list = explode(',', $atts['metals']);
        $prices = $this->fetch_metal_prices();
        
        if (empty($prices)) {
            return '<p>Unable to fetch metal prices at this time.</p>';
        }
        
        $output = '';
        $container_class = 'precious-metals-container';
        
        if ($atts['auto_refresh'] === 'true') {
            $container_class .= ' precious-metals-auto-refresh';
        }
        
        $output .= '<div class="' . esc_attr($container_class) . '">';
        
        if ($atts['layout'] === 'table') {
            $output .= '<table class="' . esc_attr($atts['css_class']) . ' precious-metals-table">';
            $output .= '<thead><tr><th>Metal</th><th>Price (USD)</th></tr></thead>';
            $output .= '<tbody>';
            
            foreach ($metals_list as $metal) {
                $metal = trim($metal);
                $symbol = $this->get_metal_symbol($metal);
                
                if (isset($prices[$symbol]) && isset($prices[$symbol]['price'])) {
                    $metal_name = $this->get_metal_name($symbol);
                    $output .= '<tr>';
                    $output .= '<td class="precious-metal-' . strtolower($metal_name) . '-name">' . esc_html($metal_name) . '</td>';
                    $output .= '<td class="precious-metal-' . strtolower($metal_name) . '-price precious-metal-price">$' . number_format($prices[$symbol]['price'], 2) . '</td>';
                    $output .= '</tr>';
                }
            }
            
            $output .= '</tbody></table>';
        } else {
            $output .= '<div class="' . esc_attr($atts['css_class']) . '">';
            
            foreach ($metals_list as $metal) {
                $metal = trim($metal);
                $symbol = $this->get_metal_symbol($metal);
                
                if (isset($prices[$symbol]) && isset($prices[$symbol]['price'])) {
                    $metal_name = $this->get_metal_name($symbol);
                    $output .= '<div class="precious-metal-item">';
                    $output .= '<span class="precious-metal-' . strtolower($metal_name) . '-name precious-metal-name">' . esc_html($metal_name) . ': </span>';
                    $output .= '<span class="precious-metal-' . strtolower($metal_name) . '-price precious-metal-price">$' . number_format($prices[$symbol]['price'], 2) . '</span>';
                    $output .= '</div>';
                }
            }
            
            $output .= '</div>';
        }
        
        // Add update timestamp and refresh button
        $last_updated = get_transient($this->transient_key . '_timestamp');
        if ($last_updated) {
            $output .= '<p class="precious-metals-updated">Last updated: ' . date('Y-m-d H:i:s', $last_updated);
            
            if ($atts['auto_refresh'] === 'true') {
                $output .= ' <a href="#" class="precious-metals-refresh">(Refresh)</a>';
            }
            
            $output .= '</p>';
        }
        
        $output .= '</div>'; // Close container
        
        return $output;
    }
}

// Initialize the plugin
$precious_metals_api = new Precious_Metals_API();
