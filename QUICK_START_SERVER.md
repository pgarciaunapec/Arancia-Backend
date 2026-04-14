# ========================================
# QUICK START - COPY & PASTE TO SERVER
# ========================================

## STEP 1: Clone the repository
git clone https://github.com/pgarciaunapec/Arancia-Backend.git
cd Arancia-Backend
git checkout dev

## STEP 2: Run the automatic setup
bash docker-env-setup-auto.sh

## STEP 3: Done! Your backend is running
# Check status
docker-compose ps

# View logs
docker-compose logs -f backend

# ========================================
# Optional: Run database seeds
# ========================================
docker-compose exec backend pnpm run seed:all

# ========================================
# Optional: Access MongoDB directly
# ========================================
docker exec -it arancia-mongodb mongosh -u mongo -p Pantonio2404

# ========================================
# CUSTOMIZE VARIABLES (Only if needed)
# ========================================
# If you need to change any environment variables:
# 1. Edit .env file
nano .env

# 2. Rebuild and restart
docker-compose up -d --build

# ========================================
# USEFUL COMMANDS
# ========================================

# View all containers
docker-compose ps

# View backend logs
docker-compose logs backend

# View all logs (follow mode)
docker-compose logs -f

# Restart all services
docker-compose restart

# Stop all services
docker-compose down

# Stop and remove all data
docker-compose down -v

# View resource usage
docker stats

# Execute commands in backend
docker-compose exec backend pnpm run test
docker-compose exec backend pnpm run build
docker-compose exec backend pnpm run seed:all

# ========================================
# TROUBLESHOOTING
# ========================================

# Error: "Port already in use"
# Solution: Edit .env and change BACKEND_PORT or MONGODB_PORT
nano .env
docker-compose up -d --build

# Error: "Cannot connect to MongoDB"
# Solution: Check if MongoDB is running
docker-compose ps mongodb

# Restart MongoDB
docker-compose restart mongodb

# Error: Backend container keeps restarting
# Solution: Check logs
docker-compose logs backend

# ========================================
# FOR DOKPLOY DEPLOYMENT
# ========================================
# 1. Use values from .env.dokploy
# 2. Add to Dokploy Environment Variables section:
cat .env.dokploy

# 3. Then run the auto setup script
bash docker-env-setup-auto.sh
