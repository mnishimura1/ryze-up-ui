#!/bin/bash
set -e

echo "🚀 RYZE-UP v6.1 Testnet Deployment"
echo "=================================="
echo ""

# Configuration
TESTNET_HOST="${TESTNET_HOST:-testnet.ryze.pro}"
TESTNET_USER="${TESTNET_USER:-deploy}"
TESTNET_PATH="/var/www/ryze-ui"
DEPLOYMENT_ARCHIVE="ryze-ui-deployment-20251102_232452.tar.gz"
ENVIRONMENT="${ENVIRONMENT:-testnet}"

echo "📦 Build Summary:"
echo "  Archive: $DEPLOYMENT_ARCHIVE"
echo "  Size: $(ls -lh $DEPLOYMENT_ARCHIVE | awk '{print $5}')"
echo "  Environment: $ENVIRONMENT"
echo ""

# Extract deployment
echo "📂 Extracting deployment archive..."
TEMP_DIR=$(mktemp -d)
tar -xzf "$DEPLOYMENT_ARCHIVE" -C "$TEMP_DIR"
echo "✓ Extracted to $TEMP_DIR"
echo ""

# Verify dist folder
echo "🔍 Verifying build artifacts..."
if [ -d "$TEMP_DIR/dist" ]; then
  echo "✓ dist/ folder found"
  echo "  - index.html: $(wc -c < $TEMP_DIR/dist/index.html) bytes"
  echo "  - assets: $(find $TEMP_DIR/dist/assets -type f | wc -l) files"
else
  echo "✗ dist/ folder not found. Aborting."
  exit 1
fi
echo ""

# Copy to local web directory (for local deployment)
echo "📋 Deployment ready for testnet"
echo ""
echo "To deploy to testnet server, run:"
echo "  scp -r $TEMP_DIR/dist/ $TESTNET_USER@$TESTNET_HOST:$TESTNET_PATH"
echo ""
echo "To verify deployment:"
echo "  curl https://$TESTNET_HOST/health"
echo ""
echo "✅ Deployment package prepared successfully"

# Cleanup temp dir
rm -rf "$TEMP_DIR"
