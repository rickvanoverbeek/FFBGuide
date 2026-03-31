#!/bin/bash
# ============================================================
# FFB Hub - Linode Server Setup Script
# Run dit script op je Linode server als root
# Usage: sudo bash setup-server.sh
# ============================================================

set -e

APP_DIR="/var/www/html/ffbguide/public_html"

echo "=== FFB Hub Server Setup ==="

# --- 1. System updates ---
echo "[1/5] Updating system packages..."
apt update && apt upgrade -y

# --- 2. Install Node.js 20 LTS ---
echo "[2/5] Installing Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# --- 3. Install PM2 ---
echo "[3/5] Installing PM2..."
npm install -g pm2
mkdir -p /var/log/pm2

# --- 4. Enable Apache proxy modules ---
echo "[4/5] Enabling Apache proxy modules..."
a2enmod proxy proxy_http proxy_wstunnel rewrite headers
systemctl restart apache2

# --- 5. Firewall ---
echo "[5/5] Configuring firewall..."
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
echo "y" | ufw enable 2>/dev/null || true

echo ""
echo "=== Setup complete! ==="
echo ""
echo "Next steps:"
echo "  1. Pas /etc/apache2/sites-available/ffbguide.conf aan (voeg ProxyPass regels toe)"
echo "  2. sudo apache2ctl configtest && sudo systemctl reload apache2"
echo "  3. Maak .env.local aan: nano $APP_DIR/.env.local"
echo "  4. Run: cd $APP_DIR && bash deploy/deploy.sh"
echo ""
