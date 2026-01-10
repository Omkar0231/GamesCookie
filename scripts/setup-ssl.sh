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

echo -e "${YELLOW}🔄 Ensuring services are up...${NC}"

# Make sure all services are running
docker compose up -d

echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 10

echo -e "${YELLOW}🔑 Requesting SSL certificate from Let's Encrypt...${NC}"

# Request certificate
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $ADMIN_EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

# Check if certificate was obtained successfully
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SSL certificate obtained successfully!${NC}"
    
    # Restart nginx to load the SSL certificates
    echo -e "${YELLOW}🔄 Restarting Nginx with SSL configuration...${NC}"
    docker compose restart nginx
    
    echo -e "${GREEN}✅ SSL setup complete!${NC}"
    echo -e "${GREEN}🔒 Your site is now secured with HTTPS${NC}"
    echo ""
    echo -e "${YELLOW}📝 Note: Certificates will auto-renew every 12 hours${NC}"
    echo ""
    echo -e "${YELLOW}🧪 Testing HTTPS...${NC}"
    sleep 5
    if curl -sI https://$DOMAIN | grep -q "200 OK\|301 Moved\|302 Found"; then
        echo -e "${GREEN}✅ HTTPS is working!${NC}"
    else
        echo -e "${YELLOW}⚠️  HTTPS might take a moment to become available${NC}"
    fi
else
    echo -e "${RED}❌ Failed to obtain SSL certificate${NC}"
    echo ""
    echo -e "${YELLOW}Common issues:${NC}"
    echo "  - DNS not pointing to this server"
    echo "  - Port 80 not accessible from internet"
    echo "  - Domain already has too many certificates (Let's Encrypt limit)"
    echo ""
    echo -e "${YELLOW}Check logs with: docker compose logs certbot${NC}"
    exit 1
fi
