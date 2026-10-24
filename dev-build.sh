#!/usr/bin/env bash
# ==============================================================================
# Xplor Lanka - Dev Environment Management & Build Tool
# ==============================================================================
# Usage:
#   ./dev-build.sh            -> Runs migrations, seeds, builds Vite assets, clears cache
#   ./dev-build.sh --up       -> Starts all dev docker containers in background
#   ./dev-build.sh --down     -> Stops all dev docker containers
#   ./dev-build.sh --fresh    -> Fresh database migration with all seeders
#   ./dev-build.sh --assets   -> Frontend build only (npm run build inside container)
#   ./dev-build.sh --watch    -> Runs Vite dev server with hot reload
#   ./dev-build.sh --test     -> Runs PHPUnit test suite inside container
#   ./dev-build.sh --artisan <cmd>  -> Runs php artisan <cmd> inside container
#   ./dev-build.sh --composer <cmd> -> Runs composer <cmd> inside container
# ==============================================================================

set -e

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

COMPOSE_FILE="docker-compose.dev.yml"
APP_CONTAINER="xplorelanka_dev_app"

echo -e "${CYAN}======================================================${NC}"
echo -e "${CYAN}        Xplor Lanka - Dev Build & Refresh Tool        ${NC}"
echo -e "${CYAN}======================================================${NC}"

# Detect if Docker container is active
IN_DOCKER=false
if [ -f /.dockerenv ]; then
    IN_DOCKER=true
fi

is_container_running() {
    docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^${APP_CONTAINER}$"
}

run_in_app() {
    if [ "$IN_DOCKER" = true ]; then
        eval "$@"
    else
        if ! is_container_running; then
            echo -e "${YELLOW}Starting dev containers first...${NC}"
            docker compose -f "$COMPOSE_FILE" up -d
        fi
        docker compose -f "$COMPOSE_FILE" exec -T app "$@"
    fi
}

run_interactive_in_app() {
    if [ "$IN_DOCKER" = true ]; then
        eval "$@"
    else
        if ! is_container_running; then
            echo -e "${YELLOW}Starting dev containers first...${NC}"
            docker compose -f "$COMPOSE_FILE" up -d
        fi
        docker compose -f "$COMPOSE_FILE" exec app "$@"
    fi
}

case "${1:-}" in
    --up)
        echo -e "${GREEN}Starting development environment containers...${NC}"
        docker compose -f "$COMPOSE_FILE" up -d
        echo -e "${GREEN}✓ Dev containers are running!${NC}"
        echo -e "${GREEN}  App URL:    http://localhost:8000${NC}"
        echo -e "${GREEN}  MinIO API:  http://localhost:9000${NC}"
        echo -e "${GREEN}  MinIO Web:  http://localhost:9001${NC}"
        exit 0
        ;;
    --down)
        echo -e "${YELLOW}Stopping development environment containers...${NC}"
        docker compose -f "$COMPOSE_FILE" down
        echo -e "${GREEN}✓ Dev containers stopped.${NC}"
        exit 0
        ;;
    --watch)
        echo -e "${GREEN}Starting Vite dev server with hot reload on port 5173...${NC}"
        run_interactive_in_app npm run dev -- --host 0.0.0.0
        exit 0
        ;;
    --test)
        echo -e "${CYAN}Running test suite...${NC}"
        run_in_app php artisan test
        exit 0
        ;;
    --artisan)
        shift
        run_in_app php artisan "$@"
        exit 0
        ;;
    --composer)
        shift
        run_in_app composer "$@"
        exit 0
        ;;
esac

MODE="standard"
if [ "${1:-}" == "--fresh" ]; then
    MODE="fresh"
elif [ "${1:-}" == "--assets" ]; then
    MODE="assets"
fi

# Ensure dev containers are up
if [ "$IN_DOCKER" = false ] && ! is_container_running; then
    echo -e "${YELLOW}Dev containers not running. Starting stack...${NC}"
    docker compose -f "$COMPOSE_FILE" up -d
fi

# 1. Clean stale build artifacts & clear cache
echo -e "\n${YELLOW}[1/4] Cleaning caches and stale assets...${NC}"
if [ -f "public/hot" ]; then
    rm -f public/hot
    echo "Removed stale public/hot"
fi
run_in_app php artisan optimize:clear || true

# 2. Build Frontend Assets
echo -e "\n${YELLOW}[2/4] Building Vite Frontend Assets (React + Tailwind CSS)...${NC}"
run_in_app npm run build
echo -e "${GREEN}✓ Frontend assets compiled successfully to public/build/${NC}"

if [ "$MODE" == "assets" ]; then
    echo -e "\n${GREEN}✓ Asset build completed successfully!${NC}"
    exit 0
fi

# 3. Database Migrations and Seeders
echo -e "\n${YELLOW}[3/4] Running Database Migrations & Seeders...${NC}"
if [ "$MODE" == "fresh" ]; then
    echo -e "${YELLOW}Running fresh migration and seeding database...${NC}"
    run_in_app php artisan migrate:fresh --seed --force
    echo -e "${GREEN}✓ Database refreshed and seeded with fresh data!${NC}"
else
    echo -e "${CYAN}Running pending migrations...${NC}"
    run_in_app php artisan migrate --force
    echo -e "${CYAN}Seeding database...${NC}"
    run_in_app php artisan db:seed --force
    echo -e "${GREEN}✓ Migrations and Seeders completed!${NC}"
fi

# 4. Storage Link & Environment Finalization
echo -e "\n${YELLOW}[4/4] Finalizing storage and cache...${NC}"
run_in_app php artisan storage:link || true
run_in_app php artisan view:clear || true
run_in_app php artisan route:clear || true
run_in_app php artisan config:clear || true

echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}  ✓ Dev Environment Ready!                           ${NC}"
echo -e "${GREEN}  Visit: http://localhost:8000                        ${NC}"
echo -e "${GREEN}  Run Vite HMR: ./dev-build.sh --watch                ${NC}"
echo -e "${GREEN}======================================================${NC}"
