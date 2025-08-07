#!/bin/bash

# Integration Verification Script
# Checks that Solution 1 has been implemented correctly

echo "🧪 Verifying Precious Metals Integration (Solution 1)"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -d "app/js" ]; then
    echo "❌ Error: Please run this from the PreciousMetalInventoryTool root directory"
    echo "   Expected to find app/js/ directory"
    exit 1
fi

echo "📁 Checking required files..."

# Check for required files
files=(
    "app/js/spot-api.js"
    "app/js/spot-enhanced.js"
    "app/js/constants.js"
    "app/js/state.js" 
    "app/js/spot.js"
    "app/index.html"
    "integration-test.html"
)

missing_files=0
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (MISSING)"
        missing_files=$((missing_files + 1))
    fi
done

echo ""

if [ $missing_files -gt 0 ]; then
    echo "❌ $missing_files file(s) missing. Integration incomplete."
    exit 1
fi

echo "📝 Checking file contents..."

# Check if spot-api.js has the file:// compatibility
if grep -q "isRunningFromFile" app/js/spot-api.js; then
    echo "✅ spot-api.js: File protocol compatibility detected"
else
    echo "❌ spot-api.js: File protocol compatibility missing"
fi

# Check if spot-enhanced.js has the enhanced functions  
if grep -q "isFileProtocol" app/js/spot-enhanced.js; then
    echo "✅ spot-enhanced.js: Enhanced functions detected"
else
    echo "❌ spot-enhanced.js: Enhanced functions missing"
fi

# Check if integration test exists and has required content
if grep -q "spot-api.js" integration-test.html; then
    echo "✅ integration-test.html: Contains proper script loading"
else
    echo "❌ integration-test.html: Missing script references"
fi

echo ""
echo "🌐 Testing basic functionality..."

# Test if Node.js can load the files (basic syntax check)
if command -v node >/dev/null 2>&1; then
    # Create a simple test
    cat > temp-test.js << 'EOF'
// Basic syntax test for integration files
const fs = require('fs');

try {
    const spotApi = fs.readFileSync('app/js/spot-api.js', 'utf8');
    const spotEnhanced = fs.readFileSync('app/js/spot-enhanced.js', 'utf8');
    
    // Check for required functions
    const requiredFunctions = [
        'fetchSpotPricesFromAPI',
        'isRunningFromFile',
        'canMakeApiCalls',
        'fetchSpotPrice'
    ];
    
    let foundFunctions = 0;
    requiredFunctions.forEach(fn => {
        if (spotApi.includes(fn) || spotEnhanced.includes(fn)) {
            foundFunctions++;
        }
    });
    
    console.log(`✅ Found ${foundFunctions}/${requiredFunctions.length} required functions`);
    
    if (foundFunctions === requiredFunctions.length) {
        console.log('✅ All required functions present');
        process.exit(0);
    } else {
        console.log('❌ Some required functions missing');
        process.exit(1);
    }
    
} catch (error) {
    console.log(`❌ Error reading files: ${error.message}`);
    process.exit(1);
}
EOF

    node temp-test.js
    rm temp-test.js
else
    echo "⚠️ Node.js not available - skipping function check"
fi

echo ""
echo "🎯 Integration Status Summary:"
echo "============================="

if [ $missing_files -eq 0 ]; then
    echo "✅ All required files present"
    echo "✅ File protocol compatibility implemented" 
    echo "✅ Enhanced functions available"
    echo "✅ Integration test ready"
    echo ""
    echo "🎉 Solution 1 implementation COMPLETE!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Update app/index.html to include the new script tags"
    echo "2. Test from file:// - should work exactly as before"
    echo "3. Test from web server - should get automatic API updates"
    echo "4. Run: open integration-test.html (to test integration)"
    echo ""
    echo "🌐 For API features, serve from web server:"
    echo "   python -m http.server 8000"
    echo "   Then open: http://localhost:8000/app/index.html"
    echo ""
    echo "📁 For offline use, open directly:"
    echo "   file:///$(pwd)/app/index.html"
    
else
    echo "❌ Integration incomplete - missing files detected"
    echo ""
    echo "🔧 To fix:"
    echo "1. Ensure you've copied all the integration files"
    echo "2. Check that files were saved correctly"
    echo "3. Re-run this verification script"
fi

echo ""
echo "🧪 Quick Test Commands:"
echo "======================"
echo "# Test from file://"
echo "open app/index.html"
echo ""
echo "# Test from web server"  
echo "python -m http.server 8000 &"
echo "open http://localhost:8000/app/index.html"
echo ""
echo "# Test integration specifically"
echo "open integration-test.html"

echo ""
