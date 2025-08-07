/**
 * Precious Metals API Client
 * 
 * Provides JavaScript functionality for auto-refreshing metal prices.
 */

(function($) {
    'use strict';
    
    // Plugin namespace
    var PreciousMetalsAPI = {
        // Settings
        settings: {
            refreshInterval: 60000, // 1 minute in milliseconds
            apiEndpoint: '/wp-json/precious-metals/v1/prices',
            containerSelector: '.precious-metals-container',
            priceElements: {
                'XAG': '.precious-metal-silver-price',
                'XAU': '.precious-metal-gold-price',
                'XPT': '.precious-metal-platinum-price',
                'XPD': '.precious-metal-palladium-price'
            },
            lastUpdatedSelector: '.precious-metals-updated'
        },
        
        // Timer reference
        refreshTimer: null,
        
        /**
         * Initialize the module
         */
        init: function(options) {
            // Merge default settings with options
            this.settings = $.extend(this.settings, options);
            
            // Initialize price refresh
            this.setupRefresh();
            
            // Add event listeners for manual refresh
            $(document).on('click', '.precious-metals-refresh', function(e) {
                e.preventDefault();
                PreciousMetalsAPI.refreshPrices();
            });
        },
        
        /**
         * Set up automatic refresh
         */
        setupRefresh: function() {
            // Clear any existing timer
            if (this.refreshTimer) {
                clearInterval(this.refreshTimer);
            }
            
            // Set up new timer
            this.refreshTimer = setInterval(function() {
                PreciousMetalsAPI.refreshPrices();
            }, this.settings.refreshInterval);
            
            // Initial refresh
            this.refreshPrices();
        },
        
        /**
         * Refresh prices via AJAX
         */
        refreshPrices: function() {
            $.ajax({
                url: this.settings.apiEndpoint,
                method: 'GET',
                dataType: 'json',
                success: function(response) {
                    PreciousMetalsAPI.updatePrices(response);
                },
                error: function(xhr, status, error) {
                    console.error('Error fetching metal prices:', error);
                }
            });
        },
        
        /**
         * Update prices in DOM
         */
        updatePrices: function(data) {
            if (!data) return;
            
            // Update each metal price
            $.each(data, function(symbol, info) {
                if (PreciousMetalsAPI.settings.priceElements[symbol]) {
                    var selector = PreciousMetalsAPI.settings.priceElements[symbol];
                    var formattedPrice = '$' + parseFloat(info.price).toFixed(2);
                    $(selector).text(formattedPrice);
                    
                    // Add data attributes for additional info
                    $(selector).attr('data-timestamp', info.timestamp);
                    $(selector).attr('data-symbol', symbol);
                }
            });
            
            // Update last updated text
            var now = new Date();
            var timeString = now.toLocaleTimeString();
            $(this.settings.lastUpdatedSelector).text('Last updated: ' + timeString);
            
            // Trigger custom event
            $(document).trigger('precious_metals_updated', [data]);
        }
    };
    
    // Expose to window
    window.PreciousMetalsAPI = PreciousMetalsAPI;
    
    // DOM Ready
    $(function() {
        // Initialize if container exists
        if ($(PreciousMetalsAPI.settings.containerSelector).length) {
            PreciousMetalsAPI.init();
        }
    });
    
})(jQuery);
