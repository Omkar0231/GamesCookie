#!/bin/bash

# Development Start Script
# Quick script to start the application in development mode

set -e

echo "🚀 Starting GamesCookie Backend (Development Mode)"
echo "=================================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please review and update if needed."
    echo ""
fi

# Start services
echo "📦 Starting services with Docker Compose..."
docker compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 5

echo ""
echo "✅ Services started!"
echo ""
echo "📊 Service Status:"
docker compose ps
echo ""
echo "🔗 Application running at: http://localhost:8081"
echo ""
echo "📝 View logs: docker compose logs -f"
echo "🛑 Stop services: docker compose down"
echo ""
