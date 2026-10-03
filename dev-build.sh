#!/usr/bin/env bash
# ==============================================================================
# Xplor Lanka - Fresh Dev Build & Seeding Script
# ==============================================================================
# Usage:
#   ./dev-build.sh            -> Rebuilds frontend assets, clears caches, runs migrations & seeds
#   ./dev-build.sh --fresh    -> Fresh database migration with all seeders (Warning: resets DB)
#   ./dev-build.sh --assets   -> Frontend build only (npm install + vite build)
#   ./dev-build.sh --watch    -> Runs Vite dev server with hot reload
# ==============================================================================

set -e

# Color definitions
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}======================================================${NC}"
echo -e "${CYAN}        Xplor Lanka - Dev Build & Refresh Tool        ${NC}"
echo -e "${CYAN}======================================================${NC}"

MODE="standard"
if [ "$1" == "--fresh" ]; then
    MODE="fresh"
elif [ "$1" == "--assets" ]; then
    MODE="assets"
elif [ "$1" == "--watch" ]; then
    MODE="watch"
fi

# Detect if Docker container is active
IN_DOCKER=false
if [ -f /.dockerenv ]; then
    IN_DOCKER=true
fi

DOCKER_RUNNING=false
if [ "$IN_DOCKER" = false ]; then
    if docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^xplorelanka_app$"; then
        DOCKER_RUNNING=true
    fi
fi

run_cmd() {
    local cmd="$1"
    if [ "$IN_DOCKER" = true ]; then
        eval "$cmd"
    elif [ "$DOCKER_RUNNING" = true ]; then
        docker compose exec -T app sh -c "$cmd"
    else
        eval "$cmd"
    fi
}

# 1. Clean stale build artifacts
echo -e "\n${YELLOW}[1/4] Cleaning caches and old build assets...${NC}"
if [ -f "public/hot" ]; then
    rm -f public/hot
    echo "Removed stale public/hot"
fi
run_cmd "php artisan optimize:clear || true"

# 2. Build Frontend Assets
echo -e "\n${YELLOW}[2/4] Building Vite Frontend Assets (React + Tailwind CSS)...${NC}"
if [ "$MODE" == "watch" ]; then
    echo -e "${GREEN}Starting Vite dev server on port 5173 with HMR...${NC}"
    if [ "$IN_DOCKER" = true ]; then
        npm run dev -- --host 0.0.0.0
    elif [ "$DOCKER_RUNNING" = true ]; then
        docker compose exec app npm run dev -- --host 0.0.0.0
    else
        npm run dev
    fi
    exit 0
else
    # Compile static production bundle for Inertia
    if [ "$IN_DOCKER" = true ]; then
        npm run build
    elif [ "$DOCKER_RUNNING" = true ]; then
        docker compose exec -T app npm run build
    else
        npm run build
    fi
    echo -e "${GREEN}✓ Frontend assets compiled successfully to public/build/${NC}"
fi

if [ "$MODE" == "assets" ]; then
    echo -e "\n${GREEN}✓ Asset build completed successfully!${NC}"
    exit 0
fi

# 3. Run Database Migrations and Seeders
echo -e "\n${YELLOW}[3/4] Running Database Migrations & Seeders...${NC}"
if [ "$MODE" == "fresh" ]; then
    echo -e "${YELLOW}Running fresh migration and seeding database...${NC}"
    run_cmd "php artisan migrate:fresh --seed --force"
    echo -e "${GREEN}✓ Database refreshed and seeded with fresh data!${NC}"
else
    echo -e "${CYAN}Running pending migrations...${NC}"
    run_cmd "php artisan migrate --force"
    echo -e "${CYAN}Seeding database (Accommodations, Vehicles, Blogs, Tours, Reviews, Partners)...${NC}"
    run_cmd "php artisan db:seed --force"
    echo -e "${GREEN}✓ Migrations and Seeders completed!${NC}"
fi

# 4. Storage Link & Final Cache Clear
echo -e "\n${YELLOW}[4/4] Finalizing environment...${NC}"
run_cmd "php artisan storage:link || true"
run_cmd "php artisan view:clear && php artisan route:clear && php artisan config:clear"

echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}  ✓ Dev Build Completed Successfully!                ${NC}"
echo -e "${GREEN}  Visit: http://localhost:8000                        ${NC}"
echo -e "${GREEN}======================================================${NC}"
