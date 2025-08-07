<?php
/**
 * Plugin Name: Precious Metals Simple API
 * Plugin URI: https://github.com/username/PreciousMetalInventoryTool
 * Description: Lightweight precious metals price plugin with file-based caching
 * Version: 1.1.0
 * Author: Your Name
 * Text Domain: precious-metals-simple
 * Requires PHP: 7.0
 * Requires WP: 5.0
 */

if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('PMS_VERSION', '1.1.0');
define('PMS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('PMS_PLUGIN_URL', plugin_dir_url(__FILE__));

// Load configuration
require_once PMS_PLUGIN_DIR . 'config.php';

// Load classes
require_once PMS_PLUGIN_DIR . 'class-api-handler.php';
require_once PMS_PLUGIN_DIR . 'class-rest-endpoint.php';

/**
 * Main plugin class with file-based caching
 */
class PMS_Main {
    
    private $api_handler;
    private $rest_endpoint;
    
    public function __construct() {
        $this->api_handler = new PMS_API_Handler();
        $this->rest_endpoint = new PMS_REST_Endpoint();
        
        // Schedule cron events
        add_action('init', array($this, 'init_cron'));
        
        // Admin hooks
        add_action('admin_menu', array($this, 'admin_menu'));
        add_action('admin_notices', array($this, 'admin_notices'));
        
        // Activation/deactivation hooks
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }
    
    /**
     * Initialize cron schedules
     */
    public function init_cron() {
        if (!wp_next_scheduled('pms_fetch_api_1')) {
            wp_schedule_event(time(), 'twicedaily', 'pms_fetch_api_1');
        }
        if (!wp_next_scheduled('pms_fetch_api_2')) {
            wp_schedule_event(time() + 21600, 'twicedaily', 'pms_fetch_api_2'); // 6 hours offset
        }
        if (!wp_next_scheduled('pms_fetch_api_3')) {
            wp_schedule_event(time() + 43200, 'twicedaily', 'pms_fetch_api_3'); // 12 hours offset
        }
        
        // Hook the cron actions
        add_action('pms_fetch_api_1', array($this->api_handler, 'fetch_from_specific_api'), 10, 1);
        add_action('pms_fetch_api_2', array($this->api_handler, 'fetch_from_specific_api'), 10, 1);
        add_action('pms_fetch_api_3', array($this->api_handler, 'fetch_from_specific_api'), 10, 1);
    }
    
    /**
     * Add admin menu
     */
    public function admin_menu() {
        add_options_page(
            'Precious Metals Simple',
            'Precious Metals',
            'manage_options',
            'precious-metals-simple',
            array($this, 'admin_page')
        );
    }
    
    /**
     * Display admin notices for cache issues
     */
    public function admin_notices() {
        if (get_current_screen()->id !== 'settings_page_precious-metals-simple') {
            return;
        }
        
        $cache_status = $this->api_handler->get_cache_status();
        
        if (!$cache_status['writable']) {
            echo '<div class="notice notice-warning"><p>';
            echo '<strong>Precious Metals Simple:</strong> Cache directory is not writable. ';
            echo 'File-based caching may not work properly. Check file permissions.';
            echo '</p></div>';
        }
    }
    
    /**
     * Admin page
     */
    public function admin_page() {
        $cache_status = $this->api_handler->get_cache_status();
        $latest_prices = $this->api_handler->get_latest_prices();
        ?>
        <div class="wrap">
            <h1>Precious Metals Simple API</h1>
            
            <!-- Cache Status Section -->
            <div class="card">
                <h2>File Cache Status</h2>
                <table class="form-table">
                    <tr>
                        <th>Cache File</th>
                        <td>
                            <?php if ($cache_status['file_exists']): ?>
                                <span style="color: green;">✓ Active</span>
                                <p class="description">
                                    Last updated: <?php echo date('Y-m-d H:i:s', $cache_status['last_modified']); ?>
                                    (<?php echo size_format($cache_status['size']); ?>)
                                </p>
                            <?php else: ?>
                                <span style="color: orange;">⚠ No cache file yet</span>
                                <p class="description">Cache will be created on next API fetch</p>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <tr>
                        <th>Directory Permissions</th>
                        <td>
                            <?php if ($cache_status['writable']): ?>
                                <span style="color: green;">✓ Writable</span>
                            <?php else: ?>
                                <span style="color: red;">✗ Not writable</span>
                                <p class="description">Check directory permissions for file caching to work</p>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <tr>
                        <th>Cache Duration</th>
                        <td>
                            <?php echo human_time_diff(0, PMS_CACHE_DURATION); ?>
                            <p class="description">Cached prices are served if fresher than this duration</p>
                        </td>
                    </tr>
                </table>
            </div>
            
            <div class="card">
                <h2>API Configuration</h2>
                <p>Edit <code>config.php</code> to configure API keys and settings.</p>
                
                <h3>Enabled APIs:</h3>
                <ul>
                <?php foreach (PMS_APIS as $api_num => $api): ?>
                    <li>
                        <strong><?php echo esc_html($api['name']); ?></strong>
                        <?php if ($api['enabled']): ?>
                            <span style="color: green;">✓ Enabled</span>
                        <?php else: ?>
                            <span style="color: red;">✗ Disabled</span>
                        <?php endif; ?>
                        
                        <?php if (empty($api['key']) || strpos($api['key'], 'YOUR-') === 0): ?>
                            <span style="color: orange;">⚠ API key needs configuration</span>
                        <?php endif; ?>
                    </li>
                <?php endforeach; ?>
                </ul>
            </div>
            
            <div class="card">
                <h2>Current Prices</h2>
                <?php if (!empty($latest_prices)): ?>
                    <table class="widefat">
                        <thead>
                            <tr>
                                <th>Metal</th>
                                <th>Symbol</th>
                                <th>Price (USD)</th>
                                <th>Source</th>
                                <th>Last Updated</th>
                                <th>Cache Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($latest_prices as $symbol => $data): ?>
                            <tr>
                                <td><?php echo esc_html($this->get_metal_name($symbol)); ?></td>
                                <td><?php echo esc_html($symbol); ?></td>
                                <td>$<?php echo number_format($data['price'], 2); ?></td>
                                <td><?php echo esc_html($data['source']); ?></td>
                                <td><?php echo date('Y-m-d H:i:s', $data['timestamp']); ?></td>
                                <td>
                                    <?php 
                                    $age = time() - $data['timestamp'];
                                    if ($age < PMS_CACHE_DURATION) {
                                        echo '<span style="color: green;">✓ Fresh</span>';
                                    } else {
                                        echo '<span style="color: orange;">⚠ Stale (' . human_time_diff($data['timestamp']) . ' ago)</span>';
                                    }
                                    ?>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php else: ?>
                    <p>No price data available. Check API configuration and run a manual fetch.</p>
                <?php endif; ?>
                
                <p>
                    <a href="<?php echo esc_url(add_query_arg('pms_manual_fetch', '1')); ?>" class="button">Manual Fetch</a>
                    <a href="<?php echo esc_url(rest_url('precious-metals/v1/prices')); ?>" class="button" target="_blank">View REST API</a>
                </p>
                
                <?php
                // Handle manual fetch
                if (isset($_GET['pms_manual_fetch'])) {
                    echo '<div class="notice notice-info"><p>Manual fetch initiated...</p></div>';
                    foreach (PMS_APIS as $api_num => $api) {
                        if ($api['enabled']) {
                            $result = $this->api_handler->fetch_from_specific_api($api_num);
                            echo '<p>API ' . $api_num . ' (' . esc_html($api['name']) . '): ';
                            echo $result ? '<span style="color: green;">Success</span>' : '<span style="color: red;">Failed</span>';
                            echo '</p>';
                        }
                    }
                    echo '<p><em>Refresh page to see updated prices.</em></p>';
                }
                ?>
            </div>
            
            <div class="card">
                <h2>Usage</h2>
                <h3>REST API Endpoint:</h3>
                <code><?php echo esc_url(rest_url('precious-metals/v1/prices')); ?></code>
                
                <h3>Status Endpoint:</h3>
                <code><?php echo esc_url(rest_url('precious-metals/v1/status')); ?></code>
                
                <h3>Force Refresh:</h3>
                <code><?php echo esc_url(rest_url('precious-metals/v1/prices?format=app&force=true')); ?></code>
                
                <h3>Sample Response:</h3>
                <pre><code>{
  "XAG": {
    "price": 24.15,
    "timestamp": 1692264800,
    "source": "Metals-API.com"
  },
  "XAU": {
    "price": 1956.42,
    "timestamp": 1692264800,
    "source": "Metals-API.com"
  }
}</code></pre>
            </div>
            
            <div class="card">
                <h2>File-Based Caching</h2>
                <p>This plugin uses reliable file-based caching that:</p>
                <ul>
                    <li>✓ Survives hosting provider cache purges</li>
                    <li>✓ Works on all shared hosting providers</li>
                    <li>✓ No database dependencies for cached data</li>
                    <li>✓ Automatic fallback during API outages</li>
                    <li>✓ Protected cache directory with .htaccess</li>
                </ul>
                
                <p><strong>Cache Location:</strong> <code>/wp-content/uploads/precious-metals-cache/</code></p>
            </div>
        </div>
        <?php
    }
    
    /**
     * Get metal name from symbol
     */
    private function get_metal_name($symbol) {
        $names = array(
            'XAU' => 'Gold',
            'XAG' => 'Silver',
            'XPT' => 'Platinum',
            'XPD' => 'Palladium'
        );
        return isset($names[$symbol]) ? $names[$symbol] : $symbol;
    }
    
    /**
     * Plugin activation
     */
    public function activate() {
        // Create database table
        $this->create_database_table();
        
        // Initialize cache directory
        $cache_handler = new PMS_API_Handler();
        $cache_handler->init_cache_directory();
        
        // Schedule first API fetch
        wp_schedule_single_event(time() + 60, 'pms_fetch_api_1', array(1));
    }
    
    /**
     * Plugin deactivation
     */
    public function deactivate() {
        wp_clear_scheduled_hook('pms_fetch_api_1');
        wp_clear_scheduled_hook('pms_fetch_api_2');
        wp_clear_scheduled_hook('pms_fetch_api_3');
    }
    
    /**
     * Create database table
     */
    private function create_database_table() {
        global $wpdb;
        
        $table_name = pms_get_table_name();
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE $table_name (
            id int(11) NOT NULL AUTO_INCREMENT,
            metal_symbol varchar(10) NOT NULL,
            price decimal(10,2) NOT NULL,
            source varchar(100) NOT NULL,
            fetched_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY metal_symbol (metal_symbol),
            KEY fetched_at (fetched_at)
        ) $charset_collate;";
        
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }
}

// Initialize plugin
new PMS_Main();
