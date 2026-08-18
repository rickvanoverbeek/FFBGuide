#!/bin/bash
# ============================================================
# FFB Hub - Deploy Script
# Run dit vanuit /var/www/html/ffbguide/public_html/
# Usage: bash deploy/deploy.sh
# ============================================================

set -e

APP_DIR="/var/www/html/ffbguide/public_html"
STANDALONE_DIR="$APP_DIR/.next/standalone"

echo "=== Deploying FFB Hub ==="

cd "$APP_DIR"

# --- 1. Pull latest code ---
echo "[1/6] Pulling latest code..."
git pull

# --- 2. Install dependencies ---
echo "[2/6] Installing dependencies..."
npm ci --omit=dev

# --- 3. Build ---
echo "[3/6] Building production bundle..."
npm run build

# --- 4. Copy static assets to standalone ---
echo "[4/6] Copying static assets..."
cp -r .next/static "$STANDALONE_DIR/.next/static"
cp -r public "$STANDALONE_DIR/public"

# --- 5. Restart PM2 ---
echo "[5/6] Restarting app with PM2..."

# Stop existing instance if running
pm2 stop ffb-hub 2>/dev/null || true
pm2 delete ffb-hub 2>/dev/null || true

# Start with ecosystem config
pm2 start "$APP_DIR/deploy/ecosystem.config.js"

# Save PM2 config so it survives reboot
pm2 save

# Setup PM2 startup (first time only, harmless to repeat)
pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo ""
echo "[6/6] Verifying..."
sleep 2

if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|304"; then
    echo "✓ FFB Hub is live on port 3000!"
else
    echo "⚠ App may still be starting up. Check: pm2 logs ffb-hub"
fi

echo ""
echo "=== Deploy complete! ==="
echo "  View logs:    pm2 logs ffb-hub"
echo "  Monitor:      pm2 monit"
echo "  Status:       pm2 status"
echo ""
