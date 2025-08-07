<?php
/**
 * Plugin Name: Precious Metals API - Config File Version
 * Plugin URI: https://github.com/username/PreciousMetalInventoryTool
 * Description: Multi-API precious metals pricing with config file setup. No admin pages needed!
 * Version: 2.1.0
 * Author: Your Name
 * License: GPL v2 or later
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit('Direct script access denied.');
}

class PreciousMetalsConfigAPI {
    
    private $config_file;
    private $config = array();
    private $plugin_slug = 'precious-metals-config';
    
    public function __construct() {
        $this->config_file = plugin_dir_path(__FILE__) . 'settings.conf';
        $this->load_config();
        
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_styles'));
        add_action('rest_api_init', array($this, 'register_api_routes'));
        add_shortcode('precious_metals', array($this, 'shortcode'));
        
        // Admin notice to guide users
        add_action('admin_notices', array($this, 'admin_notice'));
    }
    
    public function init() {
        // Plugin initialized
    }
    
    private function load_config() {
        // Default configuration
        $defaults = array(
            'cache_duration' => 600,
            'apis' => array(
                'metals_api' => array(
                    'name' => 'Metals-API.com',
                    'url' => 'https://api.metals-api.com/v1/latest',
                    'key' => '',
                    'enabled' => true,
                    'priority' => 1
                ),
                'metalprice_api' => array(
                    'name' => 'MetalpriceAPI.com', 
                    'url' => 'https://api.metalpriceapi.com/v1/latest',
                    'key' => '',
                    'enabled' => true,
                    'priority' => 2
                ),
                'metals_dev' => array(
                    'name' => 'Metals.dev',
                    'url' => 'https://api.metals.dev/v1/spot',
                    'key' => '',
                    'enabled' => false,
                    'priority' => 3
                )
            )
        );
        
        if (file_exists($this->config_file)) {
            $config_content = file_get_contents($this->config_file);
            $this->config = $this->parse_config($config_content);
        } else {
            $this->config = $defaults;
            $this->create_default_config($defaults);
        }
    }
    
    private function parse_config($content) {
        $config = array();
        $current_section = 'general';
        $current_api = null;
        
        $lines = explode("\n", $content);
        
        foreach ($lines as $line) {
            $line = trim($line);
            
            // Skip empty lines and comments
            if (empty($line) || strpos($line, '#') === 0 || strpos($line, '//') === 0) {
                continue;
            }
            
            // Section headers
            if (preg_match('/^\[(.+)\]$/', $line, $matches)) {
                $current_section = trim($matches[1]);
                if (strpos($current_section, 'api_') === 0) {
                    $current_api = str_replace('api_', '', $current_section);
                    if (!isset($config['apis'])) {
                        $config['apis'] = array();
                    }
                    if (!isset($config['apis'][$current_api])) {
                        $config['apis'][$current_api] = array();
                    }
                }
                continue;
            }
            
            // Key = value pairs
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                
                // Remove quotes if present
                if ((substr($value, 0, 1) === '"' && substr($value, -1) === '"') ||
                    (substr($value, 0, 1) === "'" && substr($value, -1) === "'")) {
                    $value = substr($value, 1, -1);
                }
                
                // Convert boolean strings
                if (strtolower($value) === 'true') $value = true;
                if (strtolower($value) === 'false') $value = false;
                if (is_numeric($value)) $value = (int)$value;
                
                if ($current_api) {
                    $config['apis'][$current_api][$key] = $value;
                } else {
                    $config[$key] = $value;
                }
            }
        }
        
        return $config;
    }
    
    private function create_default_config($defaults) {
        $config_content = $this->generate_config_content($defaults);
        file_put_contents($this->config_file, $config_content);
    }
    
    private function generate_config_content($config) {
        $content = "# Precious Metals API Configuration File\n";
        $content .= "# Edit this file to configure your API keys and settings\n";
        $content .= "# Upload this file to your WordPress plugin directory\n\n";
        
        $content .= "# ===== GENERAL SETTINGS =====\n";
        $content .= "[general]\n";
        $content .= "cache_duration = " . $config['cache_duration'] . "  # Cache duration in seconds (600 = 10 minutes)\n\n";
        
        $content .= "# ===== API CONFIGURATIONS =====\n";
        $content .= "# Get your FREE API keys from these providers:\n";
        $content .= "# 1. Metals-API.com (1,000 free requests/month): https://metals-api.com/\n";
        $content .= "# 2. MetalpriceAPI.com (100 free requests/month): https://metalpriceapi.com/\n";
        $content .= "# 3. Metals.dev (100 free requests/month): https://metals.dev/\n\n";
        
        foreach ($config['apis'] as $api_key => $api_config) {
            $content .= "[api_$api_key]\n";
            $content .= "name = \"" . $api_config['name'] . "\"\n";
            $content .= "url = \"" . $api_config['url'] . "\"\n";
            $content .= "key = \"\"  # PASTE YOUR API KEY HERE\n";
            $content .= "enabled = " . ($api_config['enabled'] ? 'true' : 'false') . "\n";
            $content .= "priority = " . $api_config['priority'] . "  # Lower number = higher priority\n\n";
        }
        
        $content .= "# ===== EXAMPLE WITH API KEY =====\n";
        $content .= "# [api_metals_api]\n";
        $content .= "# name = \"Metals-API.com\"\n";
        $content .= "# url = \"https://api.metals-api.com/v1/latest\"\n";
        $content .= "# key = \"abc123your-actual-api-key-here456def\"  # Your real API key\n";
        $content .= "# enabled = true\n";
        $content .= "# priority = 1\n\n";
        
        $content .= "# ===== INSTRUCTIONS =====\n";
        $content .= "# 1. Get API keys from the providers above\n";
        $content .= "# 2. Replace the empty key = \"\" with your actual keys\n";
        $content .= "# 3. Set enabled = true for APIs you want to use\n";
        $content .= "# 4. Save this file and upload to your WordPress plugin directory\n";
        $content .= "# 5. Use shortcode [precious_metals] in your posts/pages\n";
        
        return $content;
    }
    
    public function get_prices($force_refresh = false) {
        // Check cache first
        if (!$force_refresh) {
            $cached = get_transient($this->plugin_slug . '_prices');
            if ($cached !== false) {
                return $cached;
            }
        }
        
        $apis = $this->get_sorted_apis();
        $prices = array();
        
        foreach ($apis as $api_key => $api_config) {
            if (!$api_config['enabled'] || empty($api_config['key'])) {
                continue;
            }
            
            try {
                $result = $this->fetch_from_api($api_key, $api_config);
                
                if (!empty($result)) {
                    $prices = $result;
                    $prices['_source'] = $api_config['name'];
                    
                    // Cache successful result
                    set_transient($this->plugin_slug . '_prices', $prices, $this->config['cache_duration']);
                    
                    break; // Stop trying other APIs
                }
            } catch (Exception $e) {
                // Log error but continue to next API
                error_log("Precious Metals API Error ({$api_config['name']}): " . $e->getMessage());
            }
        }
        
        return $prices;
    }
    
    private function get_sorted_apis() {
        if (!isset($this->config['apis'])) {
            return array();
        }
        
        $apis = $this->config['apis'];
        
        // Sort by priority
        uasort($apis, function($a, $b) {
            $priority_a = isset($a['priority']) ? $a['priority'] : 999;
            $priority_b = isset($b['priority']) ? $b['priority'] : 999;
            return $priority_a - $priority_b;
        });
        
        return $apis;
    }
    
    private function fetch_from_api($api_key, $api_config) {
        $symbols = array('XAU', 'XAG', 'XPT', 'XPD');
        
        if ($api_key === 'metals_dev') {
            $url = add_query_arg(array(
                'api_key' => $api_config['key'],
                'symbols' => implode(',', $symbols),
                'currency' => 'USD'
            ), $api_config['url']);
        } else {
            $url = add_query_arg(array(
                'access_key' => $api_config['key'],
                'base' => 'USD',
                'symbols' => implode(',', $symbols)
            ), $api_config['url']);
        }
        
        $response = wp_remote_get($url, array('timeout' => 30));
        
        if (is_wp_error($response)) {
            throw new Exception('HTTP Error: ' . $response->get_error_message());
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (!$data) {
            throw new Exception('Invalid JSON response');
        }
        
        $prices = array();
        
        if ($api_key === 'metals_dev') {
            if (!isset($data['data']) || !is_array($data['data'])) {
                throw new Exception('Invalid response format');
            }
            
            foreach ($data['data'] as $item) {
                if (isset($item['symbol']) && isset($item['price'])) {
                    $prices[$item['symbol']] = array(
                        'price' => floatval($item['price']),
                        'timestamp' => time()
                    );
                }
            }
        } else {
            if (!isset($data['success']) || !$data['success']) {
                $error = isset($data['error']['info']) ? $data['error']['info'] : 'Unknown API error';
                throw new Exception('API Error: ' . $error);
            }
            
            if (!isset($data['rates']) || !is_array($data['rates'])) {
                throw new Exception('No rates data in response');
            }
            
            foreach ($data['rates'] as $symbol => $rate) {
                if (in_array($symbol, $symbols)) {
                    $prices[$symbol] = array(
                        'price' => 1 / floatval($rate),
                        'timestamp' => time()
                    );
                }
            }
        }
        
        return $prices;
    }
    
    public function register_api_routes() {
        register_rest_route('precious-metals/v1', '/prices', array(
            'methods' => 'GET',
            'callback' => array($this, 'api_get_prices'),
            'permission_callback' => '__return_true'
        ));
        
        register_rest_route('precious-metals/v1', '/config-status', array(
            'methods' => 'GET',
            'callback' => array($this, 'api_config_status'),
            'permission_callback' => '__return_true'
        ));
    }
    
    public function api_get_prices($request) {
        $force = $request->get_param('force') === 'true';
        $prices = $this->get_prices($force);
        
        if (empty($prices)) {
            return new WP_Error('no_prices', 'Unable to fetch prices. Check your config file.', array('status' => 404));
        }
        
        return rest_ensure_response($prices);
    }
    
    public function api_config_status($request) {
        $status = array(
            'config_file_exists' => file_exists($this->config_file),
            'config_readable' => is_readable($this->config_file),
            'apis_configured' => 0,
            'apis_enabled' => 0,
            'cache_duration' => $this->config['cache_duration'],
            'last_prices_update' => get_transient($this->plugin_slug . '_prices_timestamp')
        );
        
        if (isset($this->config['apis'])) {
            foreach ($this->config['apis'] as $api_config) {
                if (!empty($api_config['key'])) {
                    $status['apis_configured']++;
                }
                if (isset($api_config['enabled']) && $api_config['enabled']) {
                    $status['apis_enabled']++;
                }
            }
        }
        
        return rest_ensure_response($status);
    }
    
    public function shortcode($atts) {
        $atts = shortcode_atts(array(
            'metals' => 'gold,silver,platinum,palladium',
            'layout' => 'table',
            'show_source' => 'false',
            'class' => 'precious-metals-display'
        ), $atts);
        
        $prices = $this->get_prices();
        
        if (empty($prices)) {
            return $this->render_config_help();
        }
        
        return $this->render_prices($prices, $atts);
    }
    
    private function render_config_help() {
        $config_exists = file_exists($this->config_file);
        $config_path = str_replace(ABSPATH, '', $this->config_file);
        
        $output = '<div class="precious-metals-config-help">';
        $output .= '<h4>⚙️ Configuration Needed</h4>';
        
        if (!$config_exists) {
            $output .= '<p><strong>Config file not found!</strong></p>';
            $output .= '<p>Expected location: <code>' . esc_html($config_path) . '</code></p>';
        } else {
            $output .= '<p><strong>Config file found but no valid API keys configured.</strong></p>';
        }
        
        $output .= '<div class="config-instructions">';
        $output .= '<p><strong>Quick Setup:</strong></p>';
        $output .= '<ol>';
        $output .= '<li>Get free API key from <a href="https://metals-api.com/" target="_blank">Metals-API.com</a> (1,000 free requests/month)</li>';
        $output .= '<li>Edit <code>settings.conf</code> in your plugin folder</li>';
        $output .= '<li>Find the line: <code>key = ""</code></li>';
        $output .= '<li>Add your API key: <code>key = "your-api-key-here"</code></li>';
        $output .= '<li>Save the file and refresh this page</li>';
        $output .= '</ol>';
        $output .= '</div>';
        $output .= '</div>';
        
        return $output;
    }
    
    private function render_prices($prices, $atts) {
        $metals_to_show = explode(',', $atts['metals']);
        $metal_names = array(
            'gold' => array('symbol' => 'XAU', 'name' => 'Gold'),
            'silver' => array('symbol' => 'XAG', 'name' => 'Silver'),
            'platinum' => array('symbol' => 'XPT', 'name' => 'Platinum'),
            'palladium' => array('symbol' => 'XPD', 'name' => 'Palladium')
        );
        
        $output = '<div class="' . esc_attr($atts['class']) . '">';
        
        if ($atts['layout'] === 'table') {
            $output .= '<table class="precious-metals-table">';
            $output .= '<thead><tr><th>Metal</th><th>Price (USD)</th></tr></thead>';
            $output .= '<tbody>';
            
            foreach ($metals_to_show as $metal) {
                $metal = trim(strtolower($metal));
                if (isset($metal_names[$metal])) {
                    $symbol = $metal_names[$metal]['symbol'];
                    $name = $metal_names[$metal]['name'];
                    
                    if (isset($prices[$symbol])) {
                        $output .= '<tr>';
                        $output .= '<td class="metal-name metal-' . esc_attr($metal) . '">' . esc_html($name) . '</td>';
                        $output .= '<td class="metal-price metal-' . esc_attr($metal) . '-price">$' . number_format($prices[$symbol]['price'], 2) . '</td>';
                        $output .= '</tr>';
                    }
                }
            }
            
            $output .= '</tbody></table>';
        } else {
            $output .= '<div class="precious-metals-inline">';
            
            foreach ($metals_to_show as $metal) {
                $metal = trim(strtolower($metal));
                if (isset($metal_names[$metal])) {
                    $symbol = $metal_names[$metal]['symbol'];
                    $name = $metal_names[$metal]['name'];
                    
                    if (isset($prices[$symbol])) {
                        $output .= '<span class="metal-item metal-' . esc_attr($metal) . '">';
                        $output .= '<strong>' . esc_html($name) . ':</strong> $' . number_format($prices[$symbol]['price'], 2);
                        $output .= '</span> ';
                    }
                }
            }
            
            $output .= '</div>';
        }
        
        // Add source and timestamp
        $last_updated = isset($prices['XAU']['timestamp']) ? $prices['XAU']['timestamp'] : time();
        $output .= '<div class="precious-metals-info">';
        $output .= '<small>Updated: ' . date('M j, Y g:i A', $last_updated);
        
        if ($atts['show_source'] === 'true' && isset($prices['_source'])) {
            $output .= ' | Source: ' . esc_html($prices['_source']);
        }
        
        $output .= '</small></div>';
        $output .= '</div>';
        
        return $output;
    }
    
    public function enqueue_styles() {
        wp_enqueue_style(
            $this->plugin_slug . '-style',
            plugin_dir_url(__FILE__) . 'css/precious-metals.css',
            array(),
            '2.1.0'
        );
    }
    
    public function admin_notice() {
        $screen = get_current_screen();
        
        // Only show on plugins page
        if (!$screen || $screen->id !== 'plugins') {
            return;
        }
        
        $config_exists = file_exists($this->config_file);
        $has_keys = false;
        
        if (isset($this->config['apis'])) {
            foreach ($this->config['apis'] as $api_config) {
                if (!empty($api_config['key']) && isset($api_config['enabled']) && $api_config['enabled']) {
                    $has_keys = true;
                    break;
                }
            }
        }
        
        if (!$config_exists) {
            ?>
            <div class="notice notice-info">
                <p><strong>🔧 Precious Metals API:</strong> Config file created! Edit <code>settings.conf</code> in your plugin folder to add your API keys.</p>
                <p><a href="https://metals-api.com/" target="_blank" class="button">Get Free API Key (1,000 requests/month)</a></p>
            </div>
            <?php
        } elseif (!$has_keys) {
            ?>
            <div class="notice notice-warning">
                <p><strong>⚙️ Precious Metals API:</strong> Please configure your API keys in <code>settings.conf</code> to start fetching prices.</p>
                <p><a href="<?php echo esc_url(rest_url('precious-metals/v1/config-status')); ?>" target="_blank" class="button">Check Configuration Status</a></p>
            </div>
            <?php
        } else {
            ?>
            <div class="notice notice-success is-dismissible">
                <p><strong>✅ Precious Metals API:</strong> Configuration loaded successfully! Use <code>[precious_metals]</code> shortcode to display prices.</p>
            </div>
            <?php
        }
    }
}

// Initialize the plugin
new PreciousMetalsConfigAPI();
