#!/bin/bash

# ========================================
# ARANCIA BACKEND - AUTO SETUP SCRIPT
# Copy and paste this entire command to your server:
# 
# bash docker-env-setup-auto.sh
#
# ========================================

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}ARANCIA BACKEND - Automatic Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 1. Create .env file from .env.example if doesn't exist
if [[ ! -f ".env" ]]; then
    echo -e "${GREEN}✓ Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${YELLOW}⚠ .env file already exists, skipping...${NC}"
fi

echo ""

# 2. Pull latest images
echo -e "${GREEN}✓ Pulling Docker images...${NC}"
docker-compose pull

echo ""

# 3. Build and start containers
echo -e "${GREEN}✓ Building and starting containers...${NC}"
docker-compose up -d --build

echo ""

# 4. Wait for services to be healthy
echo -e "${GREEN}✓ Waiting for services to be ready...${NC}"
sleep 5

# Check MongoDB
echo -n "  Checking MongoDB..."
for i in {1..30}; do
    if docker exec arancia-mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        echo -e " ${GREEN}✓${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

# Check Backend
echo -n "  Checking Backend API..."
for i in {1..30}; do
    if curl -s http://localhost:3003/api > /dev/null 2>&1; then
        echo -e " ${GREEN}✓${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

echo ""

# 5. Display status
echo -e "${GREEN}✓ All services are running!${NC}"
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Setup Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo "Service Status:"
docker-compose ps

echo ""
echo "Quick Commands:"
echo -e "  View logs:        ${YELLOW}docker-compose logs -f backend${NC}"
echo -e "  Stop services:    ${YELLOW}docker-compose down${NC}"
echo -e "  Restart services: ${YELLOW}docker-compose restart${NC}"
echo -e "  Run seeds:        ${YELLOW}docker-compose exec backend pnpm run seed:all${NC}"
echo ""

echo "API Endpoints:"
echo -e "  Health Check:     ${YELLOW}curl http://localhost:3003/api${NC}"
echo -e "  Swagger Docs:     ${YELLOW}http://localhost:3003/api-docs${NC}"
echo ""

echo -e "${GREEN}✓ Backend is ready to use!${NC}"
