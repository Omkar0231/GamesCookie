#!/bin/bash

# SSL Certificate Setup Script for GamesCookie Backend
# This script obtains SSL certificates using Let's Encrypt

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔐 GamesCookie SSL Certificate Setup${NC}"
echo "========================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo "Please copy .env.example to .env and configure it first."
    exit 1
fi

# Load environment variables
source .env

# Validate required variables
if [ -z "$DOMAIN" ]; then
    echo -e "${RED}❌ Error: DOMAIN is not set in .env file${NC}"
    exit 1
fi

if [ -z "$ADMIN_EMAIL" ]; then
    echo -e "${RED}❌ Error: ADMIN_EMAIL is not set in .env file${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "   Domain: $DOMAIN"
echo "   Email: $ADMIN_EMAIL"
echo ""

# Create certbot directories
mkdir -p docker/certbot/conf
mkdir -p docker/certbot/www

echo -e "${YELLOW}🌐 Starting Nginx in HTTP-only mode...${NC}"

# Temporarily modify nginx config for initial certificate request
cp docker/nginx/conf.d/app.conf docker/nginx/conf.d/app.conf.backup

# Create temporary nginx config without SSL
cat > docker/nginx/conf.d/app.conf << 'EOF'
upstream backend {
    server app:8081;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name _;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Start nginx temporarily
docker compose up -d nginx

echo -e "${YELLOW}🔑 Requesting SSL certificate from Let's Encrypt...${NC}"

# Request certificate
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $ADMIN_EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# Check if certificate was obtained successfully
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SSL certificate obtained successfully!${NC}"
    
    # Restore original nginx config with SSL
    mv docker/nginx/conf.d/app.conf.backup docker/nginx/conf.d/app.conf
    
    # Replace DOMAIN placeholder in nginx config
    sed -i.bak "s/DOMAIN/$DOMAIN/g" docker/nginx/conf.d/app.conf
    rm docker/nginx/conf.d/app.conf.bak
    
    # Restart nginx with SSL config
    echo -e "${YELLOW}🔄 Restarting Nginx with SSL configuration...${NC}"
    docker compose restart nginx
    
    echo -e "${GREEN}✅ SSL setup complete!${NC}"
    echo -e "${GREEN}🔒 Your site is now secured with HTTPS${NC}"
    echo ""
    echo -e "${YELLOW}📝 Note: Certificates will auto-renew every 12 hours${NC}"
else
    echo -e "${RED}❌ Failed to obtain SSL certificate${NC}"
    mv docker/nginx/conf.d/app.conf.backup docker/nginx/conf.d/app.conf
    exit 1
fi
