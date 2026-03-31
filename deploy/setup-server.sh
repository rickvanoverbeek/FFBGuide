#!/bin/bash
# ============================================================
# FFB Hub - Linode Server Setup Script
# Run dit script op je Linode server als root
# Usage: sudo bash setup-server.sh
# ============================================================

set -e

echo "=== FFB Hub Server Setup ==="

# --- 1. System updates ---
echo "[1/7] Updating system packages..."
apt update && apt upgrade -y

# --- 2. Install Node.js 20 LTS ---
echo "[2/7] Installing Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# --- 3. Install PM2 ---
echo "[3/7] Installing PM2..."
npm install -g pm2

# --- 4. Install Apache + modules ---
echo "[4/7] Installing Apache..."
apt install -y apache2
a2enmod proxy proxy_http proxy_wstunnel rewrite headers
systemctl restart apache2

# --- 5. Create app directory ---
echo "[5/7] Creating app directory..."
mkdir -p /var/www/ffbhub
mkdir -p /var/log/pm2
chown -R www-data:www-data /var/www/ffbhub

# --- 6. Configure Apache ---
echo "[6/7] Configuring Apache..."
cp /var/www/ffbhub/deploy/ffbhub.conf /etc/apache2/sites-available/ffbhub.conf

# Disable default site, enable ffbhub
a2dissite 000-default.conf 2>/dev/null || true
a2ensite ffbhub.conf
apache2ctl configtest
systemctl reload apache2

# --- 7. Firewall ---
echo "[7/7] Configuring firewall..."
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
echo "y" | ufw enable 2>/dev/null || true

echo ""
echo "=== Setup complete! ==="
echo ""
echo "Next steps:"
echo "  1. Upload je project naar /var/www/ffbhub/"
echo "  2. Pas /etc/apache2/sites-available/ffbhub.conf aan (ServerName)"
echo "  3. Maak .env.local aan in /var/www/ffbhub/"
echo "  4. Run: cd /var/www/ffbhub && bash deploy/deploy.sh"
echo ""
