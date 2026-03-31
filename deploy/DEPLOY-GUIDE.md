# FFB Hub - Linode Deployment Guide

## Vereisten op je Linode
- Ubuntu 22.04+ of Debian 12+
- Minimaal 1GB RAM (2GB aanbevolen)
- Root/sudo toegang

## Stap 1: Server voorbereiden

SSH naar je Linode:
```bash
ssh root@YOUR_LINODE_IP
```

## Stap 2: Project uploaden

Optie A - Via Git (aanbevolen):
```bash
cd /var/www
git clone YOUR_REPO_URL ffbhub
cd ffbhub
```

Optie B - Via SCP (vanaf je lokale machine):
```bash
scp -r . root@YOUR_LINODE_IP:/var/www/ffbhub/
```

## Stap 3: Server setup uitvoeren

```bash
cd /var/www/ffbhub
sudo bash deploy/setup-server.sh
```

Dit installeert: Node.js 20, PM2, Apache + proxy modules, en configureert de firewall.

## Stap 4: Apache configureren

Pas het IP-adres aan:
```bash
sudo nano /etc/apache2/sites-available/ffbhub.conf
# Verander YOUR_LINODE_IP naar je echte IP
sudo systemctl reload apache2
```

## Stap 5: Environment variables instellen

```bash
nano /var/www/ffbhub/.env.local
```

Vul in:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=je_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=je_sanity_token

NEXT_PUBLIC_SUPABASE_URL=https://je-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=je_supabase_anon_key

SANITY_REVALIDATE_SECRET=een_random_secret
```

## Stap 6: Deployen

```bash
cd /var/www/ffbhub
bash deploy/deploy.sh
```

Dit bouwt de app en start deze via PM2.

## Stap 7: Testen

Open in je browser: `http://YOUR_LINODE_IP`

## Handige commando's

```bash
# App status
pm2 status

# Logs bekijken
pm2 logs ffb-hub

# App herstarten
pm2 restart ffb-hub

# Apache status
sudo systemctl status apache2

# Apache logs
sudo tail -f /var/log/apache2/ffbhub-error.log
```

## Updaten na code wijzigingen

```bash
cd /var/www/ffbhub
git pull                    # als je git gebruikt
bash deploy/deploy.sh       # herbouwen en herstarten
```

## Later: SSL toevoegen met Let's Encrypt

Zodra je een domeinnaam hebt:
```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d jouwdomein.com -d www.jouwdomein.com
```

Certbot past de Apache config automatisch aan voor HTTPS.

## Later: Domein toevoegen

1. Wijs je domein naar het Linode IP (A-record in DNS)
2. Pas `/etc/apache2/sites-available/ffbhub.conf` aan:
   ```
   ServerName jouwdomein.com
   ServerAlias www.jouwdomein.com
   ```
3. `sudo systemctl reload apache2`
4. Installeer SSL (zie hierboven)
