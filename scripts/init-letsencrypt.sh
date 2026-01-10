#!/bin/bash

# SSL Certificate Initialization Script
# This script handles the initial SSL certificate setup using Let's Encrypt

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${RED}❌ Error: .env file not found${NC}"
    exit 1
fi

# Validate required variables
if [ -z "$DOMAIN" ]; then
    echo -e "${RED}❌ Error: DOMAIN not set in .env${NC}"
    exit 1
fi

if [ -z "$ADMIN_EMAIL" ]; then
    echo -e "${RED}❌ Error: ADMIN_EMAIL not set in .env${NC}"
    exit 1
fi

domains=($DOMAIN)
rsa_key_size=4096
data_path="./docker/certbot"
staging=${STAGING:-0}

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   SSL Certificate Initialization for GamesCookie      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📋 Configuration:${NC}"
echo "   Domain: $DOMAIN"
echo "   Email: $ADMIN_EMAIL"
echo "   Staging: $([ $staging != "0" ] && echo "Yes" || echo "No")"
echo ""

# Check if certificates already exist
if [ -d "$data_path/conf/live/$DOMAIN" ]; then
    echo -e "${YELLOW}⚠️  Existing certificates found for $DOMAIN${NC}"
    read -p "Replace existing certificates? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 0
    fi
fi

# Download recommended TLS parameters if needed
if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
    echo -e "${YELLOW}📥 Downloading recommended TLS parameters...${NC}"
    mkdir -p "$data_path/conf"
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
    echo -e "${GREEN}✅ TLS parameters downloaded${NC}"
fi

echo -e "${YELLOW}🔧 Creating dummy certificate for $DOMAIN...${NC}"
path="/etc/letsencrypt/live/$DOMAIN"
mkdir -p "$data_path/conf/live/$DOMAIN"
docker compose run --rm --entrypoint "\
    openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1 \
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot
echo -e "${GREEN}✅ Dummy certificate created${NC}"

echo -e "${YELLOW}🚀 Starting nginx...${NC}"
docker compose up --force-recreate -d nginx
echo -e "${GREEN}✅ Nginx started${NC}"

echo -e "${YELLOW}🗑️  Deleting dummy certificate for $DOMAIN...${NC}"
docker compose run --rm --entrypoint "\
    rm -rf /etc/letsencrypt/live/$DOMAIN && \
    rm -rf /etc/letsencrypt/archive/$DOMAIN && \
    rm -rf /etc/letsencrypt/renewal/$DOMAIN.conf" certbot
echo -e "${GREEN}✅ Dummy certificate deleted${NC}"

echo -e "${YELLOW}🔑 Requesting Let's Encrypt certificate for $DOMAIN...${NC}"

# Enable staging mode if needed
staging_arg=""
if [ $staging != "0" ]; then
    staging_arg="--staging"
    echo -e "${YELLOW}⚠️  Using Let's Encrypt STAGING server${NC}"
fi

# Select appropriate email arg
case "$ADMIN_EMAIL" in
    "") email_arg="--register-unsafely-without-email" ;;
    *) email_arg="--email $ADMIN_EMAIL" ;;
esac

docker compose run --rm --entrypoint "\
    certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    -d $DOMAIN \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --no-eff-email \
    --force-renewal" certbot

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Certificate obtained successfully!${NC}"
    
    echo -e "${YELLOW}🔄 Reloading nginx...${NC}"
    docker compose exec nginx nginx -s reload
    echo -e "${GREEN}✅ Nginx reloaded${NC}"
    
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          ✅ SSL Setup Completed Successfully!          ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Failed to obtain certificate${NC}"
    echo ""
    echo -e "${YELLOW}💡 Troubleshooting:${NC}"
    echo "   1. Verify DNS points to this server: dig +short $DOMAIN"
    echo "   2. Check if port 80 is accessible from internet"
    echo "   3. View certbot logs: docker compose logs certbot"
    echo "   4. Try staging mode: STAGING=1 ./scripts/init-letsencrypt.sh"
    echo ""
    exit 1
fi
