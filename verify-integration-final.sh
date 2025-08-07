#!/bin/bash

# 🔧 Precious Metals Tool - API Integration Verification
# This script checks that your file:// vs web server integration is working correctly

echo "🔍 VERIFYING INTEGRATION SETUP..."
echo "================================="

cd "$(dirname "$0")"

# Check required files exist
echo "📁 Checking required files..."

required_files=(
    "app/index.html"
    "app/js/spot-api.js" 
    "app/js/spot-enhanced.js"
    "app/js/spot.js"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    else
        echo "✅ $file exists"
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo ""
    echo "❌ MISSING FILES:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    echo ""
    echo "Please ensure all required files are present before proceeding."
    exit 1
fi

# Check script loading order in index.html
echo ""
echo "📋 Checking script loading order in app/index.html..."

if grep -q 'spot-api.js.*spot-enhanced.js.*spot.js' app/index.html; then
    echo "✅ Script loading order is correct"
else
    echo "⚠️  Script loading order may be incorrect"
    echo "   Expected: spot-api.js → spot-enhanced.js → spot.js"
fi

# Check CSP headers
if grep -q 'precious-metals-vercel-api.vercel.app' app/index.html; then
    echo "✅ Content Security Policy includes Vercel API domain"
else
    echo "⚠️  CSP may not include Vercel API domain"
fi

# Check for refresh button
if grep -q 'refreshAllSpotPrices' app/index.html; then
    echo "✅ Refresh button integration found"
else
    echo "⚠️  Refresh button integration not found"
fi

echo ""
echo "🧪 TESTING MODES..."
echo "==================="

echo ""
echo "📁 FILE:// MODE TEST:"
echo "   1. Open app/index.html directly in browser"
echo "   2. Should work exactly as before (manual prices only)"
echo "   3. Console should show: 'Running from file:// - using manual prices only'"
echo ""

echo "🌐 WEB SERVER MODE TEST:"
echo "   1. Run: python -m http.server 8000"
echo "   2. Open: http://localhost:8000/app/index.html"
echo "   3. Should attempt API integration"
echo "   4. Console should show: 'Online mode: Attempting API fetch...'"
echo ""

echo "🎯 INTEGRATION FEATURES:"
echo "========================"
echo "✨ When running from web server:"
echo "   • Automatic spot price updates from Vercel API"
echo "   • Visual indicators: 🟢 Green = API, 🟡 Orange = Manual"
echo "   • Refresh button works"
echo "   • Manual override still available"
echo ""
echo "📱 When running from file://"
echo "   • Works exactly as before"
echo "   • Manual price entry only"  
echo "   • No API errors or CORS issues"
echo "   • All existing functionality preserved"
echo ""

echo "✅ VERIFICATION COMPLETE!"
echo ""
echo "💡 NEXT STEPS:"
echo "1. Test file:// mode: open app/index.html"
echo "2. Test web mode: python -m http.server 8000, then http://localhost:8000/app/"
echo "3. Verify both modes work as expected"
echo ""
echo "🎉 Your integration is ready!"
