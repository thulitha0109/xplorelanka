#!/usr/bin/env bash

# =============================================================================
# Xplorelanka – STAGING Deploy Script
# =============================================================================
#
# Usage:
#
#   ./deploy/staging.sh
#   ./deploy/staging.sh --branch stag
#   ./deploy/staging.sh --skip-build
#   ./deploy/staging.sh --rollback
#
# =============================================================================

set -Eeuo pipefail


# =============================================================================
# CONFIGURATION
# =============================================================================

APP_DIR="/home/thulitha/docker/xplorelanka"

COMPOSE_FILE="docker-compose.staging.yml"

BRANCH="stag"

APP_CONTAINER="xplorelanka_staging_app"
DB_CONTAINER="xplorelanka_staging_db"
REDIS_CONTAINER="xplorelanka_staging_redis"
WORKER_CONTAINER="xplorelanka_staging_worker"
SCHEDULER_CONTAINER="xplorelanka_staging_scheduler"

NETWORK_NAME="xplorelanka_staging"

BACKUP_DIR="${APP_DIR}/.backups"

LOG_FILE="${APP_DIR}/deploy.log"

MAX_BACKUPS=5

SKIP_BUILD=false
ROLLBACK=false

DEPLOY_LOCK="${APP_DIR}/.deploy.lock"


# =============================================================================
# COLORS
# =============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'


# =============================================================================
# LOGGING
# =============================================================================

timestamp() {
    date '+%Y-%m-%d %H:%M:%S'
}

log() {
    echo -e "${BLUE}[$(timestamp)]${NC} $*" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[$(timestamp)] ✓${NC} $*" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(timestamp)] ⚠${NC} $*" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(timestamp)] ✗ ERROR:${NC} $*" | tee -a "$LOG_FILE"
    exit 1
}

header() {
    echo -e "\n${CYAN}${BOLD}══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}${BOLD}  $*${NC}"
    echo -e "${CYAN}${BOLD}══════════════════════════════════════════════════════════${NC}\n"
}


# =============================================================================
# ERROR HANDLER
# =============================================================================

on_error() {

    local exit_code=$?

    echo ""

    warn "Deployment failed with exit code ${exit_code}"

    if command -v docker >/dev/null 2>&1; then

        echo ""
        warn "Container status:"
        docker compose \
            -f "$COMPOSE_FILE" \
            ps 2>/dev/null || true

        echo ""
        warn "Application logs:"
        docker compose \
            -f "$COMPOSE_FILE" \
            logs \
            --tail=80 \
            app 2>/dev/null || true

        echo ""
        warn "Database logs:"
        docker compose \
            -f "$COMPOSE_FILE" \
            logs \
            --tail=50 \
            db 2>/dev/null || true
    fi

    exit "$exit_code"
}

trap on_error ERR


# =============================================================================
# ARGUMENT PARSING
# =============================================================================

parse_args() {

    while [[ $# -gt 0 ]]; do

        case "$1" in

            --branch)

                [[ $# -ge 2 ]] ||
                    error "--branch requires a branch name"

                BRANCH="$2"

                shift 2
                ;;

            --skip-build)

                SKIP_BUILD=true

                shift
                ;;

            --rollback)

                ROLLBACK=true

                shift
                ;;

            --help|-h)

                echo ""
                echo "Usage:"
                echo "  ./deploy/staging.sh [options]"
                echo ""
                echo "Options:"
                echo "  --branch <name>   Git branch (default: stag)"
                echo "  --skip-build      Skip Docker image rebuild"
                echo "  --rollback        Roll back database/release"
                echo "  --help            Show this help"
                echo ""

                exit 0
                ;;

            *)

                error "Unknown argument: $1"

                ;;
        esac

    done
}


# =============================================================================
# LOCK
# =============================================================================

acquire_lock() {

    if [[ -e "$DEPLOY_LOCK" ]]; then

        error "Another deployment appears to be running.

Lock file:
$DEPLOY_LOCK

If no deployment is running, remove it with:

rm -f $DEPLOY_LOCK"

    fi

    echo "$$" > "$DEPLOY_LOCK"

}

release_lock() {

    rm -f "$DEPLOY_LOCK" || true

}

trap release_lock EXIT


# =============================================================================
# DEPENDENCY CHECK
# =============================================================================

check_dependencies() {

    header "Checking Dependencies"

    for cmd in docker git curl; do

        if ! command -v "$cmd" >/dev/null 2>&1; then

            error "Required command not found: $cmd"

        fi

    done

    if ! docker compose version >/dev/null 2>&1; then

        error "Docker Compose v2 is required."

    fi

    success "Docker, Git and Compose are available"

}


# =============================================================================
# ENVIRONMENT
# =============================================================================

require_env_file() {

    if [[ ! -f "${APP_DIR}/.env" ]]; then

        error ".env not found:

${APP_DIR}/.env"

    fi

    local db_host

    db_host=$(
        grep '^DB_HOST=' "${APP_DIR}/.env" |
        cut -d= -f2- |
        tr -d '\r' |
        xargs || true
    )

    if [[ "$db_host" != "db" ]]; then

        warn "DB_HOST is currently: '${db_host}'"

        warn "For Docker staging it should normally be:

DB_HOST=db"

    fi

}


# =============================================================================
# COMPOSE VALIDATION
# =============================================================================

validate_compose() {

    header "Validating Docker Compose"

    docker compose \
        -f "$COMPOSE_FILE" \
        config >/dev/null

    success "Docker Compose configuration is valid"

}


# =============================================================================
# DATABASE VARIABLES
# =============================================================================

load_db_variables() {

    DB_NAME=$(
        grep '^DB_DATABASE=' "${APP_DIR}/.env" |
        cut -d= -f2- |
        tr -d '\r' |
        xargs
    )

    DB_USER=$(
        grep '^DB_USERNAME=' "${APP_DIR}/.env" |
        cut -d= -f2- |
        tr -d '\r' |
        xargs
    )

    DB_NAME="${DB_NAME:-xplorelanka_staging}"
    DB_USER="${DB_USER:-xplorelanka}"

}


# =============================================================================
# START INFRASTRUCTURE
# =============================================================================

start_infrastructure() {

    header "Starting Database and Redis"

    docker compose \
        -f "$COMPOSE_FILE" \
        up -d \
        db \
        redis

    success "Database and Redis started"

}


# =============================================================================
# WAIT FOR POSTGRESQL
# =============================================================================

wait_for_database() {

    header "Waiting for PostgreSQL"

    local retries=30

    until docker exec \
        "$DB_CONTAINER" \
        pg_isready \
        -U "$DB_USER" \
        -d "$DB_NAME" >/dev/null 2>&1
    do

        retries=$((retries - 1))

        if [[ "$retries" -le 0 ]]; then

            docker logs \
                --tail=100 \
                "$DB_CONTAINER" || true

            error "PostgreSQL did not become ready."

        fi

        log "Waiting for PostgreSQL... ${retries} retries remaining"

        sleep 2

    done

    success "PostgreSQL is ready"

}


# =============================================================================
# VERIFY DOCKER NETWORK
# =============================================================================

verify_network() {

    header "Verifying Docker Network"

    if ! docker network inspect "$NETWORK_NAME" >/dev/null 2>&1; then

        error "Docker network '$NETWORK_NAME' does not exist."

    fi

    if ! docker network inspect "$NETWORK_NAME" \
        --format '{{range .Containers}}{{.Name}}{{"\n"}}{{end}}' |
        grep -qx "$DB_CONTAINER"
    then

        error "$DB_CONTAINER is not attached to $NETWORK_NAME"

    fi

    success "Database is attached to $NETWORK_NAME"

}


# =============================================================================
# VERIFY DATABASE DNS
# =============================================================================

verify_database_dns() {

    header "Verifying Database DNS"

    local db_ip

    db_ip=$(
        docker exec \
            "$APP_CONTAINER" \
            getent hosts db 2>/dev/null |
        awk '{print $1}' |
        head -1 ||
        true
    )

    if [[ -z "$db_ip" ]]; then

        error "Laravel container cannot resolve hostname 'db'.

Expected:

db → PostgreSQL

Check:

docker network inspect ${NETWORK_NAME}"

    fi

    success "db resolves to ${db_ip}"


    if ! docker exec \
        "$APP_CONTAINER" \
        sh -c 'nc -z db 5432' >/dev/null 2>&1
    then

        warn "nc is unavailable or TCP test failed."

        if ! docker exec \
            "$APP_CONTAINER" \
            php -r '
                $fp = @fsockopen("db", 5432, $errno, $errstr, 5);
                if (!$fp) {
                    fwrite(STDERR, "TCP connection failed: $errno $errstr\n");
                    exit(1);
                }
                fclose($fp);
            '
        then

            error "Application cannot connect to db:5432"

        fi

    fi

    success "Application can reach PostgreSQL at db:5432"

}


# =============================================================================
# DATABASE BACKUP
# =============================================================================

backup_database() {

    header "Backing Up Staging Database"

    mkdir -p "$BACKUP_DIR"

    local timestamp
    local backup_file
    local temp_file

    timestamp=$(date '+%Y%m%d_%H%M%S')

    backup_file="${BACKUP_DIR}/staging_${timestamp}.sql.gz"

    temp_file="${backup_file}.tmp"

    log "Database: $DB_NAME"
    log "User    : $DB_USER"

    if docker exec \
        "$DB_CONTAINER" \
        pg_dump \
        -U "$DB_USER" \
        -d "$DB_NAME" |
        gzip > "$temp_file"
    then

        if [[ ! -s "$temp_file" ]]; then

            rm -f "$temp_file"

            error "Database backup is empty."

        fi

        mv "$temp_file" "$backup_file"

        success "Database backup created:"
        success "$(basename "$backup_file")"

    else

        rm -f "$temp_file"

        error "Database backup failed. Deployment stopped."

    fi


    # -------------------------------------------------------------------------
    # Retain only MAX_BACKUPS
    # -------------------------------------------------------------------------

    mapfile -t backups < <(
        find "$BACKUP_DIR" \
            -maxdepth 1 \
            -type f \
            -name 'staging_*.sql.gz' \
            -printf '%T@ %p\n' |
        sort -rn |
        awk '{print $2}'
    )

    if [[ "${#backups[@]}" -gt "$MAX_BACKUPS" ]]; then

        for old_backup in "${backups[@]:$MAX_BACKUPS}"; do

            rm -f "$old_backup"

            log "Removed old backup: $(basename "$old_backup")"

        done

    fi

}


# =============================================================================
# START APPLICATION
# =============================================================================

start_application() {

    header "Building and Starting Application"

    if [[ "$SKIP_BUILD" == true ]]; then

        warn "Skipping Docker image build"

        docker compose \
            -f "$COMPOSE_FILE" \
            up -d \
            --remove-orphans

    else

        docker compose \
            -f "$COMPOSE_FILE" \
            up -d \
            --build \
            --remove-orphans

    fi

    success "Application containers started"

}


# =============================================================================
# WAIT FOR APPLICATION
# =============================================================================

wait_for_application() {

    header "Waiting for Laravel Application"

    local retries=30

    while true; do

        if docker inspect \
            --format='{{.State.Running}}' \
            "$APP_CONTAINER" 2>/dev/null |
            grep -q true
        then
            break
        fi

        retries=$((retries - 1))

        if [[ "$retries" -le 0 ]]; then

            error "Application container did not start."

        fi

        log "Waiting for application... ${retries} retries remaining"

        sleep 2

    done

    success "Laravel application container is running"

    sleep 3

}


# =============================================================================
# VERIFY APPLICATION DATABASE CONNECTION
# =============================================================================

verify_laravel_database() {

    header "Testing Laravel Database Connection"

    if docker exec \
        "$APP_CONTAINER" \
        php artisan db:show >/dev/null 2>&1
    then

        success "Laravel database connection is working"

        return 0

    fi

    warn "artisan db:show failed."

    docker exec \
        "$APP_CONTAINER" \
        php artisan about 2>/dev/null |
        head -50 || true

    error "Laravel cannot connect to PostgreSQL."


}


# =============================================================================
# MIGRATIONS
# =============================================================================

run_migrations() {

    header "Running Laravel Migrations"

    if docker exec \
        "$APP_CONTAINER" \
        php artisan migrate \
        --force
    then

        success "Migrations completed successfully"

    else

        error "Laravel migration failed."

    fi

}


# =============================================================================
# CACHE
# =============================================================================

refresh_laravel_cache() {

    header "Refreshing Laravel Cache"

    docker exec \
        "$APP_CONTAINER" \
        php artisan optimize:clear

    docker exec \
        "$APP_CONTAINER" \
        php artisan optimize

    success "Laravel cache refreshed"

}


# =============================================================================
# RESTART WORKERS
# =============================================================================

restart_workers() {

    header "Restarting Queue Workers"

    docker exec \
        "$APP_CONTAINER" \
        php artisan queue:restart || true

    docker compose \
        -f "$COMPOSE_FILE" \
        restart worker scheduler

    success "Queue worker and scheduler restarted"

}


# =============================================================================
# HEALTH CHECK
# =============================================================================

health_check() {

    header "Application Health Check"

    local app_url

    app_url=$(
        grep '^APP_URL=' "${APP_DIR}/.env" |
        cut -d= -f2- |
        tr -d '\r' |
        xargs
    )

    if [[ -z "$app_url" ]]; then

        warn "APP_URL is not configured."

        return 0

    fi

    log "Checking: $app_url"

    sleep 3

    if curl \
        --fail \
        --silent \
        --show-error \
        --max-time 15 \
        "$app_url" \
        -o /dev/null
    then

        success "Application is responding at $app_url"

    else

        warn "HTTP health check failed."

        warn "Recent application logs:"

        docker compose \
            -f "$COMPOSE_FILE" \
            logs \
            --tail=50 \
            app || true

        error "Application health check failed."

    fi

}


# =============================================================================
# DEPLOYMENT SUMMARY
# =============================================================================

summary() {

    local commit

    commit=$(git rev-parse --short HEAD)

    header "STAGING DEPLOY COMPLETE"

    echo -e "  Commit      : ${GREEN}${commit}${NC}"
    echo -e "  Branch      : ${GREEN}${BRANCH}${NC}"
    echo -e "  Database    : ${GREEN}${DB_NAME}${NC}"
    echo -e "  Network     : ${GREEN}${NETWORK_NAME}${NC}"

    local app_url

    app_url=$(
        grep '^APP_URL=' "${APP_DIR}/.env" |
        cut -d= -f2- |
        tr -d '\r' |
        xargs || true
    )

    if [[ -n "$app_url" ]]; then

        echo -e "  URL         : ${CYAN}${app_url}${NC}"

    fi

    echo -e "  Backup dir  : ${BACKUP_DIR}"
    echo -e "  Log         : ${LOG_FILE}"

    echo ""

    echo -e "${YELLOW}Useful commands:${NC}"

    echo "  docker compose -f $COMPOSE_FILE ps"

    echo "  docker compose -f $COMPOSE_FILE logs -f app"

    echo "  docker compose -f $COMPOSE_FILE logs -f worker"

    echo "  docker compose -f $COMPOSE_FILE logs -f scheduler"

    echo "  docker exec -it $APP_CONTAINER php artisan tinker"

    echo "  docker exec $APP_CONTAINER php artisan about"

    echo "  ./deploy/staging.sh --rollback"

    echo ""

}


# =============================================================================
# ROLLBACK
# =============================================================================

rollback() {

    header "STAGING ROLLBACK"

    mkdir -p "$BACKUP_DIR"

    local latest_backup

    latest_backup=$(
        find "$BACKUP_DIR" \
            -maxdepth 1 \
            -type f \
            -name 'staging_*.sql.gz' \
            -printf '%T@ %p\n' |
        sort -rn |
        head -1 |
        cut -d' ' -f2-
    )

    if [[ -z "$latest_backup" ]]; then

        error "No staging database backups found."

    fi

    echo ""
    warn "Latest database backup:"
    echo ""
    echo "  $(basename "$latest_backup")"
    echo ""

    read -r -p "Restore this database backup? [y/N] " confirm

    [[ "$confirm" =~ ^[Yy]$ ]] ||
        {
            log "Rollback cancelled."
            exit 0
        }


    start_infrastructure

    wait_for_database

    log "Restoring database..."

    if gunzip -c "$latest_backup" |
        docker exec -i \
            "$DB_CONTAINER" \
            psql \
            -U "$DB_USER" \
            -d "$DB_NAME"
    then

        success "Database restored successfully"

    else

        error "Database restore failed."

    fi


    header "Available Git Commits"

    git log \
        --oneline \
        --decorate \
        -10

    echo ""

    read -r -p "Enter commit hash to checkout: " commit_hash

    if [[ -z "$commit_hash" ]]; then

        error "Commit hash cannot be empty."

    fi

    git checkout "$commit_hash"

    docker compose \
        -f "$COMPOSE_FILE" \
        up -d \
        --build \
        --remove-orphans

    success "Rollback complete."

}


# =============================================================================
# MAIN DEPLOYMENT
# =============================================================================

main() {

    parse_args "$@"

    mkdir -p "$APP_DIR"

    touch "$LOG_FILE"

    cd "$APP_DIR"

    header "XPLORELANKA STAGING DEPLOY"

    log "Branch : $BRANCH"
    log "Target : $APP_DIR"
    log "Time   : $(date '+%Y-%m-%d %H:%M:%S %Z')"

    acquire_lock

    check_dependencies

    require_env_file

    load_db_variables

    validate_compose


    # -------------------------------------------------------------------------
    # Rollback
    # -------------------------------------------------------------------------

    if [[ "$ROLLBACK" == true ]]; then

        rollback

        exit 0

    fi


    # -------------------------------------------------------------------------
    # Pull latest code
    # -------------------------------------------------------------------------

    header "Pulling Code"

    git fetch origin

    git checkout "$BRANCH"

    git pull --ff-only origin "$BRANCH"

    success "Code updated to $(git rev-parse --short HEAD)"


    # -------------------------------------------------------------------------
    # Start DB and Redis first
    # -------------------------------------------------------------------------

    start_infrastructure

    wait_for_database


    # -------------------------------------------------------------------------
    # Start application
    # -------------------------------------------------------------------------

    start_application

    wait_for_application


    # -------------------------------------------------------------------------
    # Verify Docker networking
    # -------------------------------------------------------------------------

    verify_network

    verify_database_dns


    # -------------------------------------------------------------------------
    # IMPORTANT:
    # Backup happens AFTER DB starts and BEFORE migrations
    # -------------------------------------------------------------------------

    backup_database


    # -------------------------------------------------------------------------
    # Verify Laravel DB
    # -------------------------------------------------------------------------

    verify_laravel_database


    # -------------------------------------------------------------------------
    # Migrations
    # -------------------------------------------------------------------------

    run_migrations


    # -------------------------------------------------------------------------
    # Laravel cache
    # -------------------------------------------------------------------------

    refresh_laravel_cache


    # -------------------------------------------------------------------------
    # Workers
    # -------------------------------------------------------------------------

    restart_workers


    # -------------------------------------------------------------------------
    # Health check
    # -------------------------------------------------------------------------

    health_check


    # -------------------------------------------------------------------------
    # Summary
    # -------------------------------------------------------------------------

    summary

}


main "$@"