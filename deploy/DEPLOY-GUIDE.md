# FFB Hub - Linode Deployment Guide

## Stap 1: Clone de repo op je Linode

```bash
ssh root@YOUR_LINODE_IP
cd /var/www/html/ffbguide/public_html
git clone https://github.com/JOUW_USERNAME/JOUW_REPO.git .
```

> Let op de `.` aan het eind — dat cloned direct in public_html zonder extra map.
> Als public_html niet leeg is, doe dan eerst: `rm -rf /var/www/html/ffbguide/public_html/*`

## Stap 2: Server setup (eenmalig)

```bash
cd /var/www/html/ffbguide/public_html
sudo bash deploy/setup-server.sh
```

Dit installeert Node.js 20, PM2, en configureert Apache proxy modules.

## Stap 3: Apache configureren

```bash
sudo nano /etc/apache2/sites-available/ffbhub.conf
```

Verander `YOUR_LINODE_IP` naar je echte Linode IP-adres. Dan:

```bash
sudo systemctl reload apache2
```

## Stap 4: Environment variables

```bash
nano /var/www/html/ffbguide/public_html/.env.local
```

```
NEXT_PUBLIC_SANITY_PROJECT_ID=je_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=je_sanity_token

NEXT_PUBLIC_SUPABASE_URL=https://je-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=je_supabase_anon_key

SANITY_REVALIDATE_SECRET=een_random_secret
```

## Stap 5: Deployen

```bash
cd /var/www/html/ffbguide/public_html
bash deploy/deploy.sh
```

Open daarna: `http://YOUR_LINODE_IP`

## Updates deployen

Na code wijzigingen op GitHub:

```bash
cd /var/www/html/ffbguide/public_html
bash deploy/deploy.sh
```

Het script doet automatisch `git pull`, `npm ci`, `npm run build`, en herstart PM2.

## Handige commando's

```bash
pm2 status                  # app status
pm2 logs ffb-hub            # logs bekijken
pm2 restart ffb-hub         # app herstarten
pm2 monit                   # real-time monitoring

sudo systemctl status apache2
sudo tail -f /var/log/apache2/ffbhub-error.log
```

## Later: SSL + Domein

```bash
# 1. DNS A-record wijzen naar Linode IP
# 2. Apache config aanpassen:
sudo nano /etc/apache2/sites-available/ffbhub.conf
#    ServerName jouwdomein.com
#    ServerAlias www.jouwdomein.com
sudo systemctl reload apache2

# 3. SSL installeren:
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d jouwdomein.com -d www.jouwdomein.com
```
