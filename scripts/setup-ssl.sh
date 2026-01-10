#!/bin/bash

# SSL Certificate Setup Script for GamesCookie Backend
# This script is a wrapper that calls the proper initialization script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        GamesCookie SSL Certificate Setup              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo "Please copy .env.example to .env and configure it first."
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

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

# Check DNS
echo -e "${YELLOW}🔍 Checking DNS configuration...${NC}"
RESOLVED_IP=$(dig +short $DOMAIN | tail -n1)
if [ -z "$RESOLVED_IP" ]; then
    echo -e "${YELLOW}⚠️  Warning: Could not resolve DNS for $DOMAIN${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ DNS resolves to: $RESOLVED_IP${NC}"
fi

# Check Docker
echo -e "${YELLOW}🐳 Checking Docker...${NC}"
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker is running${NC}"

# Create necessary directories
mkdir -p docker/certbot/conf
mkdir -p docker/certbot/www

# Make init script executable
chmod +x scripts/init-letsencrypt.sh

echo ""
echo -e "${YELLOW}🚀 Starting SSL certificate initialization...${NC}"
echo ""

# Call the init script
./scripts/init-letsencrypt.sh

# Check if successful
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${YELLOW}🧪 Testing HTTPS...${NC}"
    sleep 5
    if curl -sI https://$DOMAIN | head -n 1 | grep -q "HTTP"; then
        echo -e "${GREEN}✅ HTTPS is working!${NC}"
        echo ""
        echo -e "${GREEN}🎉 Your site is now secured with HTTPS${NC}"
        echo -e "${YELLOW}📝 Certificates will auto-renew every 12 hours${NC}"
    else
        echo -e "${YELLOW}⚠️  HTTPS response received but verify manually${NC}"
        echo "   Visit: https://$DOMAIN"
    fi
else
    echo ""
    echo -e "${RED}❌ SSL setup failed${NC}"
    exit 1
fi
