#!/bin/bash

# ========================================
# ARANCIA BACKEND - Verification Check
# Uso: bash docker-verify.sh
# ========================================

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}ARANCIA BACKEND - Verification Check${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check Docker
echo -e "${YELLOW}Checking Docker installation...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker is installed${NC}"
    docker --version
else
    echo -e "${RED}✗ Docker is NOT installed${NC}"
fi
echo ""

# Check Docker Compose
echo -e "${YELLOW}Checking Docker Compose...${NC}"
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓ Docker Compose is installed${NC}"
    docker-compose --version
else
    echo -e "${RED}✗ Docker Compose is NOT installed${NC}"
fi
echo ""

# Check containers
echo -e "${YELLOW}Checking containers...${NC}"
if docker-compose ps > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Containers are available${NC}"
    echo ""
    docker-compose ps
else
    echo -e "${RED}✗ Cannot access docker-compose${NC}"
    echo "  Make sure you're in the project directory with docker-compose.yml"
fi
echo ""

# Check MongoDB
echo -e "${YELLOW}Checking MongoDB...${NC}"
if docker exec arancia-mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ MongoDB is running and responding${NC}"
else
    echo -e "${RED}✗ MongoDB is not responding${NC}"
fi
echo ""

# Check Backend API
echo -e "${YELLOW}Checking Backend API...${NC}"
if curl -s http://localhost:3003/api > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend API is responding${NC}"
else
    echo -e "${RED}✗ Backend API is not responding${NC}"
fi
echo ""

# Check disk space
echo -e "${YELLOW}Checking disk space...${NC}"
DISK=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK" -lt 80 ]; then
    echo -e "${GREEN}✓ Disk space OK (${DISK}% used)${NC}"
else
    echo -e "${YELLOW}⚠ Low disk space (${DISK}% used)${NC}"
fi
echo ""

# Check memory
echo -e "${YELLOW}Checking memory...${NC}"
MEM=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100)}')
echo -e "Memory usage: ${MEM}%"
if [ "$MEM" -lt 80 ]; then
    echo -e "${GREEN}✓ Memory OK${NC}"
else
    echo -e "${YELLOW}⚠ High memory usage${NC}"
fi
echo ""

# Display useful commands
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Useful Commands${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "View logs:           ${YELLOW}docker-compose logs -f backend${NC}"
echo -e "Restart:             ${YELLOW}docker-compose restart${NC}"
echo -e "Stop:                ${YELLOW}docker-compose down${NC}"
echo -e "Check status:        ${YELLOW}docker stats${NC}"
echo -e "Run seeds:           ${YELLOW}docker-compose exec backend pnpm run seed:all${NC}"
echo ""
echo -e "API Endpoints:"
echo -e "  Health:            ${YELLOW}curl http://localhost:3003/api${NC}"
echo -e "  Swagger:           ${YELLOW}http://localhost:3003/api-docs${NC}"
echo ""
