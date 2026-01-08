#!/bin/bash

# Production Deployment Script for GamesCookie Backend
# This script deploys the application with SSL certificates

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 GamesCookie Production Deployment${NC}"
echo "======================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo "Please run ./scripts/setup.sh first"
    exit 1
fi

# Load environment variables
source .env

# Validate required variables
REQUIRED_VARS=("DB_HOST" "DB_USERNAME" "DB_PASSWORD" "DB_DATABASE" "JWT_SECRET" "DOMAIN" "ADMIN_EMAIL")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo -e "${RED}❌ Error: The following required variables are not set in .env:${NC}"
    printf '   - %s\n' "${MISSING_VARS[@]}"
    exit 1
fi

echo -e "${GREEN}✅ Configuration validated${NC}"
echo ""

# Check if SSL certificates exist
if [ ! -d "docker/certbot/conf/live/$DOMAIN" ]; then
    echo -e "${YELLOW}🔐 SSL certificates not found. Setting up SSL...${NC}"
    ./scripts/setup-ssl.sh
else
    echo -e "${GREEN}✅ SSL certificates already exist${NC}"
fi

echo ""
echo -e "${YELLOW}🛑 Stopping any running containers...${NC}"
docker compose down

echo -e "${YELLOW}🏗️  Building fresh Docker images...${NC}"
docker compose build --no-cache

echo -e "${YELLOW}🚀 Starting services...${NC}"
docker compose up -d

echo ""
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"

# Wait for database to be ready
echo -n "   Waiting for database..."
until docker compose exec -T db mysqladmin ping -h localhost -u root -p${DB_PASSWORD} --silent 2>/dev/null; do
    echo -n "."
    sleep 2
done
echo -e " ${GREEN}✅${NC}"

# Wait for application to be ready
echo -n "   Waiting for application..."
MAX_RETRIES=30
RETRY_COUNT=0
until curl -f http://localhost:8081/ &>/dev/null; do
    echo -n "."
    sleep 2
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo -e " ${RED}❌${NC}"
        echo -e "${RED}Application failed to start. Check logs with: docker compose logs app${NC}"
        exit 1
    fi
done
echo -e " ${GREEN}✅${NC}"

echo ""
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo ""
echo -e "${BLUE}📊 Service Status:${NC}"
docker compose ps
echo ""
echo -e "${BLUE}🔗 Your application is running at:${NC}"
echo "   HTTP:  http://$DOMAIN"
echo "   HTTPS: https://$DOMAIN"
echo ""
echo -e "${BLUE}📝 Useful commands:${NC}"
echo "   View logs:        ${YELLOW}docker compose logs -f${NC}"
echo "   View app logs:    ${YELLOW}docker compose logs -f app${NC}"
echo "   Restart services: ${YELLOW}docker compose restart${NC}"
echo "   Stop services:    ${YELLOW}docker compose down${NC}"
echo "   Access database:  ${YELLOW}docker compose exec db mysql -u root -p${NC}"
echo ""
