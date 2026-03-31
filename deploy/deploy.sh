#!/bin/bash
# ============================================================
# FFB Hub - Deploy Script
# Run dit vanuit /var/www/ffbhub/ na elke update
# Usage: bash deploy/deploy.sh
# ============================================================

set -e

APP_DIR="/var/www/ffbhub"
STANDALONE_DIR="$APP_DIR/.next/standalone"

echo "=== Deploying FFB Hub ==="

cd "$APP_DIR"

# --- 1. Install dependencies ---
echo "[1/5] Installing dependencies..."
npm ci --omit=dev

# --- 2. Build ---
echo "[2/5] Building production bundle..."
npm run build

# --- 3. Copy static assets to standalone ---
echo "[3/5] Copying static assets..."
cp -r .next/static "$STANDALONE_DIR/.next/static"
cp -r public "$STANDALONE_DIR/public"

# --- 4. Restart PM2 ---
echo "[4/5] Restarting app with PM2..."
cd "$STANDALONE_DIR"

# Stop existing instance if running
pm2 stop ffb-hub 2>/dev/null || true
pm2 delete ffb-hub 2>/dev/null || true

# Start with ecosystem config
pm2 start "$APP_DIR/deploy/ecosystem.config.js"

# Save PM2 config so it survives reboot
pm2 save

# --- 5. Setup PM2 startup (first time only) ---
pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo ""
echo "[5/5] Verifying..."
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
