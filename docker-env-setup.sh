#!/bin/bash

# ========================================
# ARANCIA BACKEND - Docker Environment Setup Script
# Usage: bash docker-env-setup.sh [local|production]
# ========================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"
ENV_EXAMPLE="$SCRIPT_DIR/.env.example"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Main setup
main() {
    print_header "ARANCIA BACKEND - Environment Setup"
    
    local env_type=${1:-local}
    
    # Validate environment type
    if [[ ! "$env_type" =~ ^(local|production)$ ]]; then
        print_error "Invalid environment type: $env_type"
        echo "Usage: bash docker-env-setup.sh [local|production]"
        exit 1
    fi
    
    print_warning "Setting up environment for: $env_type"
    
    # Check if .env already exists
    if [[ -f "$ENV_FILE" ]]; then
        print_warning ".env file already exists"
        read -p "Do you want to overwrite it? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_warning "Keeping existing .env file"
            echo ""
            show_next_steps "$env_type"
            return 0
        fi
    fi
    
    # Copy appropriate template
    if [[ "$env_type" == "local" ]]; then
        cp "$SCRIPT_DIR/.env.local.example" "$ENV_FILE"
        print_success "Created .env for local development"
    else
        cp "$SCRIPT_DIR/.env.production.example" "$ENV_FILE"
        print_success "Created .env for production"
        print_warning "IMPORTANT: Review and update sensitive values in .env before deployment"
    fi
    
    echo ""
    show_next_steps "$env_type"
}

show_next_steps() {
    local env_type=$1
    
    print_header "Next Steps"
    
    echo "1. Review your configuration:"
    echo -e "   ${BLUE}cat .env${NC}"
    echo ""
    
    if [[ "$env_type" == "local" ]]; then
        echo "2. Build and start containers:"
        echo -e "   ${BLUE}docker-compose up -d${NC}"
        echo ""
        echo "3. Verify everything is running:"
        echo -e "   ${BLUE}docker-compose ps${NC}"
        echo ""
        echo "4. Check logs:"
        echo -e "   ${BLUE}docker-compose logs -f backend${NC}"
        echo ""
        echo "5. Run database seeds (if needed):"
        echo -e "   ${BLUE}docker-compose exec backend pnpm run seed:all${NC}"
        echo ""
        echo "6. Access the API:"
        echo -e "   ${BLUE}curl http://localhost:3003/api${NC}"
        echo -e "   ${BLUE}open http://localhost:3003/api-docs${NC}"
    else
        echo "2. Update sensitive values in .env:"
        echo -e "   ${BLUE}nano .env${NC}"
        echo ""
        echo "3. Set the following variables with YOUR actual values:"
        echo "   - JWT_SECRET (min 32 chars, strong password)"
        echo "   - MONGO_INITDB_ROOT_PASSWORD (strong password)"
        echo "   - FRONTEND_URL (your production frontend URL)"
        echo "   - DOMAIN (your API domain)"
        echo "   - MONGODB_URI (your production MongoDB host)"
        echo ""
        echo "4. Deploy to Dokploy:"
        echo "   - Copy the values to Dokploy's Environment Variables"
        echo "   - Deploy/redeploy the application"
        echo ""
        echo "5. Verify Traefik routing:"
        echo "   - Check Traefik dashboard for your router"
        echo "   - Access: https://\${DOMAIN}"
    fi
    
    echo ""
    print_header "Useful Resources"
    echo "- Documentation: DOCKER_SETUP_GUIDE.md"
    echo "- Dokploy config: .env.dokploy"
    echo "- All variables: .env.example"
    echo ""
}

# Run main function
main "$@"
