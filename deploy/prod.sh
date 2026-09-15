#!/bin/bash
# =============================================================================
# Xplorelanka – PRODUCTION Deploy Script
# =============================================================================
# Usage:
#   ./deploy/prod.sh [--branch <branch>] [--skip-build] [--rollback]
#                    [--no-backup] [--no-maintenance]
#
# Options:
#   --branch <name>     Git branch/tag to deploy (default: main)
#   --skip-build        Re-use existing Docker image (no rebuild)
#   --rollback          Interactive rollback to previous backup & commit
#   --no-backup         Skip pre-deploy database backup (not recommended)
#   --no-maintenance    Skip maintenance mode during deploy
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# CONFIG — edit these to match your production environment
# ---------------------------------------------------------------------------
APP_DIR="/home/thulitha/xplorelanka"           # Production deployment directory
COMPOSE_FILE="docker-compose.prod.yml"
APP_CONTAINER="xplorelanka_prod_app"
DB_CONTAINER="xplorelanka_prod_db"
WEB_CONTAINER="xplorelanka_prod_web"
BRANCH="main"
SKIP_BUILD=false
ROLLBACK=false
DO_BACKUP=true
USE_MAINTENANCE=true
BACKUP_DIR="${APP_DIR}/.backups"
LOG_FILE="${APP_DIR}/deploy.log"
MAX_BACKUPS=10
HEALTH_CHECK_RETRIES=5
HEALTH_CHECK_DELAY=5

# ---------------------------------------------------------------------------
# COLORS
# ---------------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m'

# ---------------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------------
log()     { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $*" | tee -a "$LOG_FILE"; }
success() { echo -e "${GREEN}[$(date '+%H:%M:%S')] ✓${NC} $*" | tee -a "$LOG_FILE"; }
warn()    { echo -e "${YELLOW}[$(date '+%H:%M:%S')] ⚠${NC}  $*" | tee -a "$LOG_FILE"; }
error()   {
    echo -e "${RED}[$(date '+%H:%M:%S')] ✗ ERROR:${NC} $*" | tee -a "$LOG_FILE"
    disable_maintenance_mode
    exit 1
}
header()  {
    echo -e "\n${MAGENTA}${BOLD}══════════════════════════════════════════${NC}" | tee -a "$LOG_FILE"
    echo -e "${MAGENTA}${BOLD}  $*${NC}" | tee -a "$LOG_FILE"
    echo -e "${MAGENTA}${BOLD}══════════════════════════════════════════${NC}\n" | tee -a "$LOG_FILE"
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --branch)          BRANCH="$2"; shift 2 ;;
            --skip-build)      SKIP_BUILD=true; shift ;;
            --rollback)        ROLLBACK=true; shift ;;
            --no-backup)       DO_BACKUP=false; shift ;;
            --no-maintenance)  USE_MAINTENANCE=false; shift ;;
            *) error "Unknown argument: $1" ;;
        esac
    done
}

require_env_file() {
    if [[ ! -f "${APP_DIR}/.env" ]]; then
        error ".env not found at ${APP_DIR}/.env\n  Run: cp .env.docker.prod ${APP_DIR}/.env  and fill in all production values."
    fi

    # Verify critical env vars are not placeholders
    local app_key db_pass
    app_key=$(grep '^APP_KEY=' "${APP_DIR}/.env" | cut -d= -f2)
    db_pass=$(grep '^DB_PASSWORD=' "${APP_DIR}/.env" | cut -d= -f2)

    [[ -z "$app_key" || "$app_key" == "" ]] \
        && error "APP_KEY is not set in .env — run: php artisan key:generate"
    [[ "$db_pass" == "change_this_to_a_secure_production_password" || -z "$db_pass" ]] \
        && error "DB_PASSWORD is not set or is still the default placeholder in .env"
}

check_dependencies() {
    for cmd in docker git curl; do
        command -v "$cmd" &>/dev/null || error "Required command not found: $cmd"
    done
    docker compose version &>/dev/null || error "Docker Compose v2 not found."
}

confirm_prod() {
    local commit
    commit=$(cd "$APP_DIR" && git rev-parse --short HEAD 2>/dev/null || echo "N/A")
    echo -e "\n${RED}${BOLD}  ⚠  PRODUCTION DEPLOYMENT${NC}"
    echo -e "  Branch : ${YELLOW}${BRANCH}${NC}"
    echo -e "  Commit : ${YELLOW}${commit}${NC}"
    echo -e "  Server : ${YELLOW}${APP_DIR}${NC}"
    echo ""
    read -r -p "  Type 'deploy' to continue: " confirm
    [[ "$confirm" == "deploy" ]] || { log "Deployment cancelled."; exit 0; }
}

# ---------------------------------------------------------------------------
# MAINTENANCE MODE
# ---------------------------------------------------------------------------
enable_maintenance_mode() {
    [[ "$USE_MAINTENANCE" == false ]] && return
    log "Enabling Laravel maintenance mode..."
    docker exec "$APP_CONTAINER" php artisan down --retry=60 --refresh=15 2>/dev/null || true
    success "Maintenance mode ON"
}

disable_maintenance_mode() {
    [[ "$USE_MAINTENANCE" == false ]] && return
    log "Disabling maintenance mode..."
    docker exec "$APP_CONTAINER" php artisan up 2>/dev/null || true
    success "Maintenance mode OFF — App is live"
}

# ---------------------------------------------------------------------------
# BACKUP DATABASE
# ---------------------------------------------------------------------------
backup_db() {
    if [[ "$DO_BACKUP" == false ]]; then
        warn "Database backup skipped (--no-backup flag)"
        return
    fi

    log "Backing up production database..."
    mkdir -p "$BACKUP_DIR"

    local timestamp db_name db_user backup_file
    timestamp=$(date '+%Y%m%d_%H%M%S')
    db_name=$(grep '^DB_DATABASE=' "${APP_DIR}/.env" | cut -d= -f2)
    db_user=$(grep '^DB_USERNAME=' "${APP_DIR}/.env" | cut -d= -f2)
    backup_file="${BACKUP_DIR}/prod_${timestamp}.sql.gz"

    docker exec "$DB_CONTAINER" pg_dump -U "$db_user" -d "$db_name" \
        | gzip > "$backup_file" \
        && success "Database backed up → $(basename "$backup_file") ($(du -sh "$backup_file" | cut -f1))" \
        || error "Database backup FAILED. Aborting deployment. Use --no-backup to skip (not recommended)."

    # Keep only last N backups
    ls -t "${BACKUP_DIR}"/prod_*.sql.gz 2>/dev/null | tail -n +"$((MAX_BACKUPS + 1))" | xargs rm -f -- 2>/dev/null || true
}

# ---------------------------------------------------------------------------
# ROLLBACK
# ---------------------------------------------------------------------------
rollback() {
    header "PRODUCTION ROLLBACK"
    warn "This will restore the database from a backup and switch the app to a previous commit."
    echo ""

    local latest_backup
    latest_backup=$(ls -t "${BACKUP_DIR}"/prod_*.sql.gz 2>/dev/null | head -1 || true)

    if [[ -z "$latest_backup" ]]; then
        error "No production backups found in ${BACKUP_DIR}."
    fi

    echo "  Available backups:"
    ls -t "${BACKUP_DIR}"/prod_*.sql.gz | head -5 | while read -r f; do
        echo "    - $(basename "$f")  ($(du -sh "$f" | cut -f1))"
    done
    echo ""
    read -r -p "  Backup to restore [press Enter for latest: $(basename "$latest_backup")]: " chosen
    [[ -n "$chosen" ]] && latest_backup="${BACKUP_DIR}/${chosen}"
    [[ -f "$latest_backup" ]] || error "Backup file not found: $latest_backup"

    echo ""
    echo "  Recent commits:"
    cd "$APP_DIR" && git log --oneline -8
    echo ""
    read -r -p "  Commit hash to rollback to (or press Enter to keep current): " commit_hash

    echo ""
    read -r -p "  ${RED}CONFIRM PRODUCTION ROLLBACK?${NC} Type 'rollback': " confirm
    [[ "$confirm" == "rollback" ]] || { log "Rollback cancelled."; exit 0; }

    enable_maintenance_mode

    local db_name db_user
    db_name=$(grep '^DB_DATABASE=' "${APP_DIR}/.env" | cut -d= -f2)
    db_user=$(grep '^DB_USERNAME=' "${APP_DIR}/.env" | cut -d= -f2)

    log "Restoring database from $(basename "$latest_backup")..."
    gunzip -c "$latest_backup" | docker exec -i "$DB_CONTAINER" psql -U "$db_user" -d "$db_name"
    success "Database restored"

    if [[ -n "$commit_hash" ]]; then
        log "Checking out commit $commit_hash..."
        git checkout "$commit_hash"
        docker compose -f "$COMPOSE_FILE" up -d --build
    fi

    disable_maintenance_mode
    success "Production rollback complete."
    exit 0
}

# ---------------------------------------------------------------------------
# MAIN DEPLOY
# ---------------------------------------------------------------------------
main() {
    parse_args "$@"
    mkdir -p "$APP_DIR"
    touch "$LOG_FILE"

    header "XPLORELANKA PRODUCTION DEPLOY"
    log "Branch : ${BRANCH}"
    log "Target : ${APP_DIR}"
    log "Time   : $(date '+%Y-%m-%d %H:%M:%S %Z')"

    [[ "$ROLLBACK" == true ]] && rollback

    check_dependencies
    require_env_file

    # Require explicit confirmation for prod
    confirm_prod

    # 1. Pull latest code
    header "Pulling Code"
    cd "$APP_DIR"
    git fetch --tags origin
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
    local new_commit
    new_commit=$(git rev-parse --short HEAD)
    success "Code updated to ${new_commit}"

    # 2. Backup database before any changes
    backup_db

    # 3. Enable maintenance mode (on running app container if it exists)
    enable_maintenance_mode

    # 4. Build new Docker images
    header "Building Production Images"
    if [[ "$SKIP_BUILD" == true ]]; then
        warn "Skipping image build (--skip-build flag set)"
        docker compose -f "$COMPOSE_FILE" up -d --remove-orphans
    else
        log "Building images (this may take a few minutes)..."
        docker compose -f "$COMPOSE_FILE" build --no-cache
        success "Images built"
        docker compose -f "$COMPOSE_FILE" up -d --remove-orphans
        success "Containers started"
    fi

    # 5. Wait for DB to be healthy
    header "Waiting for Database"
    local retries=30
    until docker exec "$DB_CONTAINER" pg_isready -q 2>/dev/null; do
        retries=$((retries - 1))
        [[ $retries -le 0 ]] && error "Database did not become healthy in time."
        log "Waiting for database... ($retries retries left)"
        sleep 2
    done
    success "Database is ready"

    # 6. Run migrations
    header "Running Migrations"
    docker exec "$APP_CONTAINER" php artisan migrate --force
    success "Migrations applied"

    # 7. Run production optimizations
    header "Optimizing Application"
    docker exec "$APP_CONTAINER" php artisan optimize:clear
    docker exec "$APP_CONTAINER" php artisan optimize
    docker exec "$APP_CONTAINER" php artisan storage:link 2>/dev/null || true
    success "Application optimized"

    # 8. Disable maintenance mode
    disable_maintenance_mode

    # 9. Health check with retries
    header "Health Check"
    local app_url
    app_url=$(grep '^APP_URL=' "${APP_DIR}/.env" | cut -d= -f2)
    local attempt=0
    local health_ok=false
    while [[ $attempt -lt $HEALTH_CHECK_RETRIES ]]; do
        attempt=$((attempt + 1))
        log "Health check attempt ${attempt}/${HEALTH_CHECK_RETRIES}..."
        if curl -sf --max-time 15 "${app_url}" -o /dev/null; then
            health_ok=true
            break
        fi
        sleep "$HEALTH_CHECK_DELAY"
    done

    if [[ "$health_ok" == true ]]; then
        success "App is live at ${app_url}"
    else
        warn "Health check failed after ${HEALTH_CHECK_RETRIES} attempts."
        warn "Check logs: docker compose -f $COMPOSE_FILE logs --tail=50"
        warn "If broken: ./deploy/prod.sh --rollback"
    fi

    # 10. Summary
    header "PRODUCTION DEPLOY COMPLETE"
    echo -e "  Commit  : ${GREEN}${new_commit}${NC}"
    echo -e "  Branch  : ${GREEN}${BRANCH}${NC}"
    echo -e "  URL     : ${CYAN}${app_url}${NC}"
    echo -e "  Log     : ${LOG_FILE}"
    echo ""
    echo -e "  ${YELLOW}Useful commands:${NC}"
    echo "    docker compose -f $COMPOSE_FILE logs -f"
    echo "    docker exec -it $APP_CONTAINER php artisan queue:monitor"
    echo "    ./deploy/prod.sh --rollback"
    echo ""
    echo -e "  ${YELLOW}Container status:${NC}"
    docker compose -f "$COMPOSE_FILE" ps
}

main "$@"
