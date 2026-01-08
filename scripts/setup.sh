#!/bin/bash

# Initial Setup Script for GamesCookie Backend
# This script sets up the environment and prepares for deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🎮 GamesCookie Backend Setup${NC}"
echo "=============================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env file with your configuration before deploying!${NC}"
    echo ""
    echo -e "${BLUE}Required configurations:${NC}"
    echo "  - Database credentials (DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE)"
    echo "  - JWT secret (JWT_SECRET)"
    echo "  - SMTP settings (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_EMAIL)"
    echo "  - Domain and email for SSL (DOMAIN, ADMIN_EMAIL)"
    echo ""
    
    read -p "Do you want to edit .env file now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ${EDITOR:-nano} .env
    fi
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Create necessary directories
echo -e "${YELLOW}📁 Creating required directories...${NC}"
mkdir -p uploads
mkdir -p docker/mysql/init
mkdir -p docker/certbot/conf
mkdir -p docker/certbot/www
mkdir -p docker/nginx/conf.d

# Create .gitkeep for uploads directory
touch uploads/.gitkeep

echo -e "${GREEN}✅ Directories created${NC}"
echo ""

# Create uploads/.gitkeep if it doesn't exist
cat > uploads/.gitkeep << 'EOF'
# This file keeps the uploads directory in git
EOF

# Build Docker images
echo -e "${YELLOW}🏗️  Building Docker images...${NC}"
docker-compose build

echo -e "${GREEN}✅ Docker images built successfully${NC}"
echo ""

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "  1. Review and update .env file with your configuration"
echo "  2. For production with SSL, run: ${YELLOW}./scripts/deploy-production.sh${NC}"
echo "  3. For development, run: ${YELLOW}docker-compose up -d${NC}"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "  - Make sure your domain DNS is pointing to this server before setting up SSL"
echo "  - Keep your .env file secure and never commit it to version control"
echo ""
