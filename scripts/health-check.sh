#!/bin/bash

# Health Check Script
# Verifies all services are running correctly

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🏥 GamesCookie Health Check${NC}"
echo "============================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    exit 1
fi

source .env

# Check Docker
if ! docker ps &> /dev/null; then
    echo -e "${RED}❌ Docker is not running${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker is running${NC}"

# Check containers
echo ""
echo "📦 Container Status:"
docker-compose ps

echo ""
echo "🔍 Service Health Checks:"

# Check app
if curl -f http://localhost:8081/ &> /dev/null; then
    echo -e "   App:       ${GREEN}✅ Healthy${NC}"
else
    echo -e "   App:       ${RED}❌ Unhealthy${NC}"
fi

# Check database
if docker-compose exec -T db mysqladmin ping -h localhost -u root -p${DB_PASSWORD} --silent 2>/dev/null; then
    echo -e "   Database:  ${GREEN}✅ Healthy${NC}"
else
    echo -e "   Database:  ${RED}❌ Unhealthy${NC}"
fi

# Check nginx
if docker-compose exec -T nginx nginx -t &> /dev/null; then
    echo -e "   Nginx:     ${GREEN}✅ Healthy${NC}"
else
    echo -e "   Nginx:     ${RED}❌ Unhealthy${NC}"
fi

# Check SSL certificates (if in production)
if [ -d "docker/certbot/conf/live/$DOMAIN" ]; then
    echo -e "   SSL:       ${GREEN}✅ Configured${NC}"
    
    # Check expiry
    expiry=$(docker-compose run --rm certbot certificates 2>/dev/null | grep "Expiry Date" | head -1 || echo "")
    if [ ! -z "$expiry" ]; then
        echo -e "              $expiry"
    fi
else
    echo -e "   SSL:       ${YELLOW}⚠️  Not configured${NC}"
fi

echo ""
echo -e "${GREEN}✅ Health check complete${NC}"
