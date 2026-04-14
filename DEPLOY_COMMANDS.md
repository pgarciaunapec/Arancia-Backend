# ========================================
# DOCKER STARTUP COMMANDS - COPY & PASTE
# ========================================

## ONE-LINE SETUP (Copy and paste this entire block)

```bash
git clone https://github.com/pgarciaunapec/Arancia-Backend.git && cd Arancia-Backend && git checkout dev && bash docker-env-setup-auto.sh
```

## OR STEP BY STEP:

```bash
# 1. Clone and navigate
git clone https://github.com/pgarciaunapec/Arancia-Backend.git
cd Arancia-Backend
git checkout dev

# 2. Auto setup everything
bash docker-env-setup-auto.sh

# 3. Verify it's running
docker-compose ps
```

## VERIFY THE SETUP

```bash
# Check if API is responding
curl http://localhost:3003/api

# View backend logs
docker-compose logs backend

# See all containers
docker-compose ps
```

## COMMON OPERATIONS

```bash
# View logs in real-time
docker-compose logs -f backend

# Restart backend
docker-compose restart backend

# Stop everything
docker-compose down

# Stop and remove data
docker-compose down -v

# Run seeds
docker-compose exec backend pnpm run seed:all

# Access MongoDB
docker exec -it arancia-mongodb mongosh -u mongo -p Pantonio2404
```

## IF YOU NEED TO CHANGE VARIABLES

```bash
# Edit the .env file
nano .env

# Rebuild and restart
docker-compose up -d --build
```

## CHECK STATUS

```bash
# All containers running?
docker-compose ps

# Everything healthy?
docker stats arancia-backend arancia-mongodb

# Backend responding?
curl http://localhost:3003/api

# View Swagger docs?
# Open browser: http://localhost:3003/api-docs
```

## CLEAN SLATE (if something goes wrong)

```bash
# Stop and remove everything
docker-compose down -v

# Remove all images
docker system prune -a --volumes

# Start fresh
bash docker-env-setup-auto.sh
```
