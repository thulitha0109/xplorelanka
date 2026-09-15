#!/bin/bash
# =============================================================================
# Xplorelanka – STAGING Deploy Script
# =============================================================================
# Usage:
#   ./deploy/staging.sh [--branch <branch>] [--skip-build] [--rollback]
#
# Options:
#   --branch <name>   Git branch to deploy (default: main)
#   --skip-build      Skip Docker image rebuild (re-use cached layers)
#   --rollback        Roll back to the previous release
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# CONFIG — edit these to match your staging environment
# ---------------------------------------------------------------------------
APP_DIR="/home/thulitha/docker/xplorelanka"    # Deployment directory on server
COMPOSE_FILE="docker-compose.staging.yml"
APP_CONTAINER="xplorelanka_staging_app"
DB_CONTAINER="xplorelanka_staging_db"
BRANCH="stag"
SKIP_BUILD=false
ROLLBACK=false
BACKUP_DIR="${APP_DIR}/.backups"
LOG_FILE="${APP_DIR}/deploy.log"
MAX_BACKUPS=5

# ---------------------------------------------------------------------------
# COLORS
# ---------------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# ---------------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------------
log()     { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $*" | tee -a "$LOG_FILE"; }
success() { echo -e "${GREEN}[$(date '+%H:%M:%S')] ✓${NC} $*" | tee -a "$LOG_FILE"; }
warn()    { echo -e "${YELLOW}[$(date '+%H:%M:%S')] ⚠${NC}  $*" | tee -a "$LOG_FILE"; }
error()   { echo -e "${RED}[$(date '+%H:%M:%S')] ✗ ERROR:${NC} $*" | tee -a "$LOG_FILE"; exit 1; }
header()  { echo -e "\n${CYAN}${BOLD}══════════════════════════════════════════${NC}"; \
            echo -e "${CYAN}${BOLD}  $*${NC}"; \
            echo -e "${CYAN}${BOLD}══════════════════════════════════════════${NC}\n"; }

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --branch)     BRANCH="$2"; shift 2 ;;
            --skip-build) SKIP_BUILD=true; shift ;;
            --rollback)   ROLLBACK=true; shift ;;
            *) error "Unknown argument: $1" ;;
        esac
    done
}

require_env_file() {
    if [[ ! -f "${APP_DIR}/.env" ]]; then
        error ".env not found at ${APP_DIR}/.env\n  Run: cp .env.docker.dev ${APP_DIR}/.env  and fill in staging values."
    fi
}

check_dependencies() {
    for cmd in docker git curl; do
        command -v "$cmd" &>/dev/null || error "Required command not found: $cmd"
    done
    docker compose version &>/dev/null || error "Docker Compose v2 not found."
}

# ---------------------------------------------------------------------------
# ROLLBACK
# ---------------------------------------------------------------------------
rollback() {
    header "STAGING ROLLBACK"
    local latest_backup
    latest_backup=$(ls -t "${BACKUP_DIR}"/*.sql.gz 2>/dev/null | head -1 || true)

    if [[ -z "$latest_backup" ]]; then
        error "No backups found in ${BACKUP_DIR}. Cannot rollback."
    fi

    warn "Rolling back database to: $(basename "$latest_backup")"
    read -r -p "  Are you sure? [y/N] " confirm
    [[ "$confirm" =~ ^[Yy]$ ]] || { log "Rollback cancelled."; exit 0; }

    local db_name db_user
    db_name=$(grep '^DB_DATABASE=' "${APP_DIR}/.env" | cut -d= -f2)
    db_user=$(grep '^DB_USERNAME=' "${APP_DIR}/.env" | cut -d= -f2)

    log "Restoring database..."
    gunzip -c "$latest_backup" | docker exec -i "$DB_CONTAINER" psql -U "$db_user" -d "$db_name"
    success "Database restored from $latest_backup"

    log "Recent commits:"
    cd "$APP_DIR" && git log --oneline -5
    read -r -p "  Enter commit hash to rollback to: " commit_hash
    git checkout "$commit_hash"
    docker compose -f "$COMPOSE_FILE" up -d --build
    success "Rollback complete."
    exit 0
}

# ---------------------------------------------------------------------------
# BACKUP DATABASE
# ---------------------------------------------------------------------------
backup_db() {
    log "Backing up staging database..."
    mkdir -p "$BACKUP_DIR"

    local timestamp db_name db_user backup_file
    timestamp=$(date '+%Y%m%d_%H%M%S')
    db_name=$(grep '^DB_DATABASE=' "${APP_DIR}/.env" | cut -d= -f2)
    db_user=$(grep '^DB_USERNAME=' "${APP_DIR}/.env" | cut -d= -f2)
    backup_file="${BACKUP_DIR}/staging_${timestamp}.sql.gz"

    docker exec "$DB_CONTAINER" pg_dump -U "$db_user" -d "$db_name" 2>/dev/null \
        | gzip > "$backup_file" \
        && success "Database backed up → $(basename "$backup_file")" \
        || warn "Database backup skipped (container may not be running yet)"

    # Keep only last N backups
    ls -t "${BACKUP_DIR}"/*.sql.gz 2>/dev/null | tail -n +"$((MAX_BACKUPS + 1))" | xargs rm -f -- 2>/dev/null || true
}

# ---------------------------------------------------------------------------
# MAIN DEPLOY
# ---------------------------------------------------------------------------
main() {
    parse_args "$@"
    mkdir -p "$APP_DIR"
    touch "$LOG_FILE"

    header "XPLORELANKA STAGING DEPLOY"
    log "Branch : ${BRANCH}"
    log "Target : ${APP_DIR}"
    log "Time   : $(date '+%Y-%m-%d %H:%M:%S %Z')"

    [[ "$ROLLBACK" == true ]] && rollback

    check_dependencies
    require_env_file

    # 1. Pull latest code
    header "Pulling Code"
    cd "$APP_DIR"
    git fetch origin
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
    success "Code updated to $(git rev-parse --short HEAD)"

    # 2. Backup existing DB
    backup_db

    # 3. Build & Start containers
    header "Building Docker Images"
    if [[ "$SKIP_BUILD" == true ]]; then
        warn "Skipping build (--skip-build flag set)"
        docker compose -f "$COMPOSE_FILE" up -d
    else
        docker compose -f "$COMPOSE_FILE" up -d --build --remove-orphans
    fi

    # 4. Wait for DB to be healthy
    header "Waiting for Database"
    local retries=30
    until docker exec "$DB_CONTAINER" pg_isready -q 2>/dev/null; do
        retries=$((retries - 1))
        [[ $retries -le 0 ]] && error "Database did not become healthy in time."
        log "Waiting for database... ($retries retries left)"
        sleep 2
    done
    success "Database is ready"

    # 5. Run migrations
    header "Running Migrations"
    docker exec "$APP_CONTAINER" php artisan migrate --force
    success "Migrations complete"

    # 6. Clear & re-cache Laravel
    header "Clearing and Caching"
    docker exec "$APP_CONTAINER" php artisan optimize:clear
    docker exec "$APP_CONTAINER" php artisan optimize
    success "Laravel cache refreshed"

    # 7. Verify health
    header "Health Check"
    sleep 3
    local app_url
    app_url=$(grep '^APP_URL=' "${APP_DIR}/.env" | cut -d= -f2)
    if curl -sf --max-time 10 "${app_url}" -o /dev/null; then
        success "App is responding at ${app_url}"
    else
        warn "App health check failed at ${app_url} — check container logs below:"
        docker compose -f "$COMPOSE_FILE" logs --tail=30 app
    fi

    # 8. Summary
    header "STAGING DEPLOY COMPLETE"
    echo -e "  Commit  : ${GREEN}$(git rev-parse --short HEAD)${NC}"
    echo -e "  Branch  : ${GREEN}${BRANCH}${NC}"
    echo -e "  URL     : ${CYAN}${app_url}${NC}"
    echo -e "  Log     : ${LOG_FILE}"
    echo ""
    echo -e "  ${YELLOW}Useful commands:${NC}"
    echo "    docker compose -f $COMPOSE_FILE logs -f app"
    echo "    docker exec -it $APP_CONTAINER php artisan tinker"
    echo "    ./deploy/staging.sh --rollback"
}

main "$@"
