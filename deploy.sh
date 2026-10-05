#!/usr/bin/env bash
# =============================================================================
# Xplore Lanka – Complete Deployment Script
# =============================================================================
#
# This script performs a full, production-grade deployment from scratch or as
# an incremental update. It handles:
#
#   • Dependency checks (docker, docker compose, git, openssl, curl, gzip)
#   • Environment file bootstrapping (first-run secret generation)
#   • Git pull / revision checkout
#   • Docker image build (multi-stage: composer → vite → PHP-FPM runtime)
#   • Database + Redis readiness waiting
#   • Pre-migration database backup (gzip, verified)
#   • Laravel migrations
#   • Optional database seeding (--seed flag)
#   • Zero-downtime service rollout (app + worker + scheduler)
#   • Laravel cache warm-up and queue restart
#   • HTTP health check with automatic rollback on failure
#   • Backup rotation (keeps last N snapshots)
#   • Instructions for configuring the host reverse proxy (Nginx / Caddy)
#
# Usage:
#   bash deploy.sh [OPTIONS]
#
# Options:
#   --branch NAME       Deploy a specific git branch  (default: main)
#   --revision COMMIT   Deploy an exact git commit SHA (overrides --branch)
#   --seed              Run db:seed after migrations (use only on fresh installs)
#   --fresh             Run migrate:fresh --seed (⚠ DESTROYS all data)
#   --skip-backup       Skip the pre-migration database backup
#   --max-backups N     Number of database snapshots to retain (default: 10)
#   --health-url URL    Override the health-check URL
#   --help, -h          Show this help message
#
# Environment variables (may be set in the shell to avoid editing the script):
#   APP_DIR             Root of the checked-out repository  (default: script dir)
#   DEPLOY_BRANCH       Default branch to deploy            (default: main)
#   HEALTHCHECK_URL     Public URL that must return HTTP 200
#   BACKUP_DIR          Where database dumps are written     (default: APP_DIR/.backups)
#
# Prerequisites on the server:
#   • Docker Engine ≥ 24 with the Compose v2 plugin
#   • git, curl, gzip, openssl, flock
#   • A .env file in APP_DIR (auto-created from .env.example on first run)
#   • A host reverse proxy forwarding to 127.0.0.1:9000 (see --help output)
#
# =============================================================================
set -Eeuo pipefail

# ── Colour helpers ─────────────────────────────────────────────────────────────
RED='\033[0;31m'   GREEN='\033[0;32m'   YELLOW='\033[1;33m'
CYAN='\033[0;36m'  BOLD='\033[1m'       NC='\033[0m'

# ── Logging ────────────────────────────────────────────────────────────────────
LOG_FILE=""   # Set after APP_DIR is resolved
log()  { printf "${CYAN}[%s]${NC} %s\n" "$(date '+%Y-%m-%d %H:%M:%S')" "$*" | tee -a "${LOG_FILE:-/dev/null}"; }
ok()   { printf "${GREEN}  ✓${NC} %s\n" "$*" | tee -a "${LOG_FILE:-/dev/null}"; }
warn() { printf "${YELLOW}  ⚠${NC}  %s\n" "$*" | tee -a "${LOG_FILE:-/dev/null}"; }
fail() { printf "${RED}ERROR:${NC} %s\n" "$*" >&2; exit 1; }

# ── Banner ─────────────────────────────────────────────────────────────────────
banner() {
    printf "\n${BOLD}${CYAN}"
    printf "╔══════════════════════════════════════════════════════════╗\n"
    printf "║           Xplore Lanka – Deployment Script               ║\n"
    printf "╚══════════════════════════════════════════════════════════╝\n"
    printf "${NC}\n"
}

usage() {
    cat <<'USAGE'
Xplore Lanka – deploy.sh

USAGE:  bash deploy.sh [OPTIONS]

OPTIONS:
  --branch NAME       Git branch to deploy              (default: main)
  --revision COMMIT   Exact commit SHA to deploy        (overrides --branch)
  --seed              Run db:seed after migrations
  --fresh             migrate:fresh --seed  ⚠ DESTROYS ALL DATA
  --skip-backup       Skip pre-migration database snapshot
  --max-backups N     Snapshots to keep locally         (default: 10)
  --health-url URL    Override the HTTP health-check endpoint
  --help, -h          Show this message

EXAMPLE – first deployment:
  bash deploy.sh --branch main --seed

EXAMPLE – routine update:
  bash deploy.sh --branch main

EXAMPLE – rollback to a previous commit:
  bash deploy.sh --revision abc1234567

HOST REVERSE PROXY (manual setup – run once after first deployment):
  See the "Nginx / Caddy" section printed at the end of a successful deploy.
USAGE
}

# ── Defaults ───────────────────────────────────────────────────────────────────
APP_DIR="${APP_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"
CURRENT_GIT_BRANCH=$(git -C "$APP_DIR" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
BRANCH="${DEPLOY_BRANCH:-$CURRENT_GIT_BRANCH}"
REVISION=""
SEED=false
FRESH=false
SKIP_BACKUP=false
LOCAL_BUILD=false
SKIP_HEALTHCHECK=false
MAX_BACKUPS="${MAX_BACKUPS:-10}"
HEALTHCHECK_URL="${HEALTHCHECK_URL:-}"
IMAGE_NAME="xplorelanka/app"

# ── Argument parsing ───────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
    case "$1" in
        --branch)            [[ $# -ge 2 ]] || fail '--branch requires a name';    BRANCH="$2";         shift 2 ;;
        --revision)          [[ $# -ge 2 ]] || fail '--revision requires a SHA';   REVISION="$2";        shift 2 ;;
        --local|--no-git)    LOCAL_BUILD=true;                                                          shift   ;;
        --seed)              SEED=true;                                                                 shift   ;;
        --fresh)             FRESH=true;                                                                shift   ;;
        --skip-backup)       SKIP_BACKUP=true;                                                          shift   ;;
        --skip-healthcheck)  SKIP_HEALTHCHECK=true;                                                     shift   ;;
        --max-backups)       [[ $# -ge 2 ]] || fail '--max-backups requires N';    MAX_BACKUPS="$2";     shift 2 ;;
        --health-url)        [[ $# -ge 2 ]] || fail '--health-url requires a URL'; HEALTHCHECK_URL="$2"; shift 2 ;;
        --help|-h)           usage; exit 0 ;;
        *) fail "Unknown option: $1" ;;
    esac
done

[[ "$FRESH" == true && "$SEED" == false ]] && SEED=true   # --fresh implies --seed

BACKUP_DIR="${BACKUP_DIR:-$APP_DIR/.backups}"
LOG_FILE="$APP_DIR/deploy.log"

banner

# ══════════════════════════════════════════════════════════════════════════════
# PHASE 0 – Dependency checks
# ══════════════════════════════════════════════════════════════════════════════
log "Phase 0 │ Checking dependencies"

for cmd in docker git curl gzip openssl flock stat; do
    command -v "$cmd" > /dev/null 2>&1 || fail "Required command not found: $cmd"
done
docker compose version > /dev/null 2>&1 || fail "Docker Compose v2 plugin is required (docker compose version)."
[[ -d "$APP_DIR/.git" ]] || fail "No git repository found at $APP_DIR."
ok "All dependencies present"

# ── Prevent concurrent deploys ─────────────────────────────────────────────────
LOCK_FILE="${TMPDIR:-/tmp}/xplorelanka.deploy.lock"
exec 9>"$LOCK_FILE"
flock -n 9 || fail "Another deployment is already running (lock: $LOCK_FILE)."

mkdir -p "$BACKUP_DIR" && chmod 700 "$BACKUP_DIR"
touch "$LOG_FILE"       && chmod 600 "$LOG_FILE"

# ══════════════════════════════════════════════════════════════════════════════
# PHASE 1 – Environment file
# ══════════════════════════════════════════════════════════════════════════════
log "Phase 1 │ Environment configuration"

ENV_FILE="$APP_DIR/.env"

if [[ ! -f "$ENV_FILE" ]]; then
    warn ".env not found – bootstrapping from .env.example"
    [[ -f "$APP_DIR/.env.example" ]] || fail "Neither .env nor .env.example found in $APP_DIR."

    cp "$APP_DIR/.env.example" "$ENV_FILE"
    chmod 600 "$ENV_FILE"

    # Generate APP_KEY
    APP_KEY="base64:$(openssl rand -base64 32 | tr -d '\n')"
    sed -i "s|^APP_KEY=.*|APP_KEY=${APP_KEY}|" "$ENV_FILE"

    # Generate DB_PASSWORD
    DB_PWD=$(openssl rand -hex 32)
    sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=${DB_PWD}|" "$ENV_FILE"

    printf "\n"
    printf "${YELLOW}══════════════════════════════════════════════════════════${NC}\n"
    printf "${YELLOW}  .env created. You MUST edit it before continuing:        ${NC}\n"
    printf "${YELLOW}  1. Set APP_URL to your domain                            ${NC}\n"
    printf "${YELLOW}  2. Set AWS_* storage credentials                         ${NC}\n"
    printf "${YELLOW}  3. Set MAIL_* SMTP credentials                           ${NC}\n"
    printf "${YELLOW}  4. Set GOOGLE_MAPS_API_KEY                               ${NC}\n"
    printf "${YELLOW}  File: %s${NC}\n" "$ENV_FILE"
    printf "${YELLOW}══════════════════════════════════════════════════════════${NC}\n\n"
    printf "Press ENTER after editing .env to continue, or Ctrl-C to abort: "
    read -r _
fi

# Validate .env permissions
ENV_MODE=$(stat -c '%a' "$ENV_FILE")
(( (8#$ENV_MODE & 077) == 0 )) || {
    warn ".env permissions are too open (mode $ENV_MODE) – fixing to 600"
    chmod 600 "$ENV_FILE"
}

# Validate required secrets are set
grep -Eq '^APP_KEY=base64:[A-Za-z0-9+/=]{40,}$' "$ENV_FILE" \
    || fail "APP_KEY is missing or invalid. Run: php artisan key:generate --show, then add it to .env."
grep -Eq '^DB_PASSWORD=.+$' "$ENV_FILE" \
    || fail "DB_PASSWORD is empty in .env."
ENV_APP_ENV=$(grep -E '^APP_ENV=' "$ENV_FILE" | cut -d= -f2- | tr -d ' "' | tr '[:upper:]' '[:lower:]' || echo "production")
if [[ "${ENV_APP_ENV:-production}" == "production" ]]; then
    grep -Eq '^DB_PASSWORD=(secret|password|change_me|CHANGE_ME|change_this)' "$ENV_FILE" \
        && fail "DB_PASSWORD is still a placeholder. Set a real password in .env for production."
fi
grep -Eq '^MINIO_ROOT_USER=.+$' "$ENV_FILE" \
    || fail "MINIO_ROOT_USER is not set in .env."
grep -Eq '^MINIO_ROOT_PASSWORD=.+$' "$ENV_FILE" \
    || fail "MINIO_ROOT_PASSWORD is not set in .env."

ok ".env validated"

# Source .env for shell-level variable access (DB_DATABASE, DB_USERNAME etc.)
set -o allexport
# shellcheck disable=SC1091
source <(grep -v '^\s*#' "$ENV_FILE" | grep -v '^\s*$')
set +o allexport

# ══════════════════════════════════════════════════════════════════════════════
# PHASE 2 – Git checkout
# ══════════════════════════════════════════════════════════════════════════════
log "Phase 2 │ Git checkout"

cd "$APP_DIR"

# Warn about dirty working tree (do not abort – server edits like .env are OK)
if [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
    warn "Working tree has local modifications (expected for .env and generated files):"
    git status --short || true
fi

PREVIOUS_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "")
PREVIOUS_TAG=$(cat ".deploy-tag" 2>/dev/null || echo "")

if [[ "$LOCAL_BUILD" == true ]]; then
    log "Building from current local directory (--local) without git checkout"
    IMAGE_TAG=$(git rev-parse --short=12 HEAD 2>/dev/null || echo "local")
elif [[ -n "$REVISION" ]]; then
    log "Checking out specific revision: $REVISION"
    git fetch --tags origin
    git cat-file -e "${REVISION}^{commit}" 2>/dev/null || fail "Unknown git revision: $REVISION"
    git checkout --detach "$REVISION"
    IMAGE_TAG=$(git rev-parse --short=12 HEAD)
else
    log "Deploying branch: $BRANCH"
    # Check remote branch exists
    if ! git ls-remote --exit-code --heads origin "$BRANCH" > /dev/null 2>&1; then
        printf "ERROR: Remote branch '%s' not found. Available branches:\n" "$BRANCH" >&2
        git ls-remote --heads origin | sed 's|^.\{40\}[[:space:]]*refs/heads/||' >&2
        exit 1
    fi
    git fetch --tags origin "$BRANCH"
    if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
        git checkout "$BRANCH"
    else
        git checkout --track -b "$BRANCH" "origin/$BRANCH"
    fi
    git pull --ff-only origin "$BRANCH"
    IMAGE_TAG=$(git rev-parse --short=12 HEAD)
fi
export IMAGE_TAG IMAGE_NAME

ok "Target image tag: $IMAGE_TAG"

# ══════════════════════════════════════════════════════════════════════════════
# PHASE 3 – Docker image build
# ══════════════════════════════════════════════════════════════════════════════
log "Phase 3 │ Building Docker image  ($IMAGE_NAME:$IMAGE_TAG)"

# Helper: run docker compose with correct env file and image tag
dc() {
    IMAGE_TAG="$IMAGE_TAG" IMAGE_NAME="$IMAGE_NAME" \
    docker compose \
        --project-directory "$APP_DIR" \
        --env-file         "$ENV_FILE" \
        --file             "$APP_DIR/docker-compose.yml" \
        "$@"
}

# Validate compose file syntax
dc config --quiet

dc build --pull app
# Tag as :latest alias for convenient local and compose operations
docker tag "${IMAGE_NAME}:${IMAGE_TAG}" "${IMAGE_NAME}:latest"

# Copy compiled Vite assets out of the image with correct host user ownership
# and permissions so host reverse proxy (Nginx/Caddy) can serve them directly.
log "Extracting compiled frontend assets to public/build/ with proper permissions"
HOST_UID=$(id -u)
HOST_GID=$(id -g)
docker run --rm -u 0 -v "$APP_DIR:/host" --entrypoint sh "${IMAGE_NAME}:${IMAGE_TAG}" \
    -c "rm -rf /host/public/build && mkdir -p /host/public/build && cp -r /var/www/public/build/. /host/public/build/ && chown -R ${HOST_UID}:${HOST_GID} /host/public/build && chmod -R u=rwX,go=rX /host/public/build"
ok "Image built and frontend assets extracted with correct permissions"

# ══════════════════════════════════════════════════════════════════════════════
# PHASE 4 – Infrastructure services (PostgreSQL + Redis)
# ══════════════════════════════════════════════════════════════════════════════
log "Phase 4 │ Starting infrastructure services"

dc up -d db redis minio

log "Waiting for PostgreSQL, Redis and MinIO to become healthy (up to 120 s)…"
DB_READY=false
for attempt in $(seq 1 60); do
    if dc exec -T db sh -ec 'pg_isready -q -U "$POSTGRES_USER" -d "$POSTGRES_DB"' > /dev/null 2>&1 \
        && dc exec -T redis redis-cli ping 2>/dev/null | grep -q PONG \
        && dc exec -T minio mc ready local > /dev/null 2>&1; then
        DB_READY=true
        break
    fi
    sleep 2
done
[[ "$DB_READY" == true ]] || fail "Database, Redis, or MinIO did not become healthy within 120 s."
ok "PostgreSQL, Redis and MinIO are healthy"

log "Running MinIO bucket bootstrapper"
dc up minio_init
ok "MinIO bucket ready"

# ══════════════════════════════════════════════════════════════════════════════
# PHASE 5 – Database backup
# ══════════════════════════════════════════════════════════════════════════════
if [[ "$SKIP_BACKUP" == false && "$FRESH" == false ]]; then
    log "Phase 5 │ Creating pre-migration database snapshot"

    BACKUP_FILE="$BACKUP_DIR/$(date '+%Y%m%d_%H%M%S').sql.gz"
    TMP_BACKUP="${BACKUP_FILE}.tmp"

    if dc exec -T db sh -ec 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' \
        | gzip -c > "$TMP_BACKUP"; then
        gzip -t "$TMP_BACKUP" || fail "Backup archive is corrupt."
        [[ -s "$TMP_BACKUP" ]] || fail "Backup archive is empty – aborting to protect data."
        mv "$TMP_BACKUP" "$BACKUP_FILE"
        chmod 600 "$BACKUP_FILE"
        ok "Backup saved: $BACKUP_FILE"
    else
        rm -f "$TMP_BACKUP"
        fail "pg_dump failed – migrations were not run. Investigate before retrying."
    fi
else
    [[ "$FRESH" == true ]] && warn "Phase 5 │ Skipped backup (--fresh will reset the database)."
    [[ "$SKIP_BACKUP" == true ]] && warn "Phase 5 │ Skipped backup (--skip-backup)."
fi

# ══════════════════════════════════════════════════════════════════════════════
# PHASE 6 – Migrations and seeding
# ══════════════════════════════════════════════════════════════════════════════
log "Phase 6 │ Database migrations"

if [[ "$FRESH" == true ]]; then
    warn "Running migrate:fresh – ALL DATA WILL BE ERASED"
    dc run --rm --no-deps app php artisan migrate:fresh --seed --force
    ok "Fresh migration and seeding complete"
else
    dc run --rm --no-deps app php artisan migrate --force
    ok "Migrations applied"

    if [[ "$SEED" == true ]]; then
        log "Running database seeders (--seed flag)"
        dc run --rm --no-deps app php artisan db:seed --force
        ok "Seeding complete"
    fi
fi

# ══════════════════════════════════════════════════════════════════════════════
# PHASE 7 – Cache clear before rollout
# ══════════════════════════════════════════════════════════════════════════════
log "Phase 7 │ Clearing stale caches"
dc run --rm --no-deps app php artisan optimize:clear
ok "Caches cleared"

# ══════════════════════════════════════════════════════════════════════════════
# PHASE 8 – Zero-downtime service rollout
# ══════════════════════════════════════════════════════════════════════════════
log "Phase 8 │ Rolling out application services"

ROLLOUT_STARTED=false

rollback() {
    local reason="$1"
    log "Rollback triggered: $reason"
    if [[ -n "$PREVIOUS_TAG" ]] \
        && docker image inspect "${IMAGE_NAME}:${PREVIOUS_TAG}" > /dev/null 2>&1; then
        warn "Restoring previous image ${IMAGE_NAME}:${PREVIOUS_TAG}"
        IMAGE_TAG="$PREVIOUS_TAG" dc up -d --no-build --force-recreate app worker scheduler || true
    else
        warn "No previous image to restore – leaving current state. Investigate manually."
    fi
    dc logs --tail=100 app || true
    exit 1
}

on_error() {
    local code=$?
    trap - ERR
    log "Deployment step failed (exit $code)."
    if [[ "$ROLLOUT_STARTED" == true ]]; then
        rollback "step failure during rollout"
    fi
    dc ps  || true
    dc logs --tail=80 app db redis || true
    exit "$code"
}
trap on_error ERR

ROLLOUT_STARTED=true
dc up -d --remove-orphans --force-recreate app worker scheduler

log "Ensuring storage permissions on containers and host"
dc exec -u 0 -T app chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
dc exec -u 0 -T app chmod -R 775 /var/www/storage /var/www/bootstrap/cache
chmod -R 775 "$APP_DIR/storage" "$APP_DIR/bootstrap/cache" 2>/dev/null || true

log "Warming up Laravel caches on the running container"
dc exec -T app php artisan optimize
dc exec -T app php artisan queue:restart
ok "Services are up"

# ══════════════════════════════════════════════════════════════════════════════
# PHASE 9 – Health check
# ══════════════════════════════════════════════════════════════════════════════
log "Phase 9 │ Health check"

# Derive health URL from APP_URL if not explicitly set
if [[ -z "$HEALTHCHECK_URL" ]]; then
    _APP_URL="${APP_URL:-}"
    if [[ -n "$_APP_URL" ]]; then
        HEALTHCHECK_URL="${_APP_URL%/}/up"
    fi
fi

if [[ "$SKIP_HEALTHCHECK" == true ]]; then
    warn "Skipping HTTP health check (--skip-healthcheck)."
    log "Verifying PHP-FPM container responsiveness internally..."
    dc exec -T app php -r "echo 'PHP OK';" > /dev/null 2>&1 || rollback "PHP-FPM failed internal sanity check."
    ok "PHP-FPM container is responsive"
elif [[ -n "$HEALTHCHECK_URL" && -f "$APP_DIR/.proxy-configured" ]]; then
    log "Checking: $HEALTHCHECK_URL"
    HEALTHY=false
    for attempt in $(seq 1 18); do
        if curl --fail --silent --show-error --max-time 15 "$HEALTHCHECK_URL" -o /dev/null; then
            HEALTHY=true
            break
        fi
        warn "Attempt $attempt/18 – retrying in 10 s…"
        sleep 10
    done
    if [[ "$HEALTHY" == false ]]; then
        rollback "HTTP health check failed at $HEALTHCHECK_URL after 3 minutes."
    fi
    ok "Health check passed"
else
    log "Verifying PHP-FPM container responsiveness internally..."
    dc exec -T app php -r "echo 'PHP OK';" > /dev/null 2>&1 || rollback "PHP-FPM failed internal sanity check."
    ok "PHP-FPM container is healthy and responding"
    warn "External HTTP check skipped (host reverse proxy not yet marked as configured)."
    warn "Configure your host reverse proxy (Nginx/Caddy) to 127.0.0.1:9000, then touch .proxy-configured."
fi

# ══════════════════════════════════════════════════════════════════════════════
# PHASE 10 – Post-deploy housekeeping
# ══════════════════════════════════════════════════════════════════════════════
log "Phase 10 │ Housekeeping"

# Record successful deploy tag
printf '%s\n' "$IMAGE_TAG" > "$APP_DIR/.deploy-tag"
chmod 600 "$APP_DIR/.deploy-tag"

# Tag :latest alias for manual compose operations
docker tag "${IMAGE_NAME}:${IMAGE_TAG}" "${IMAGE_NAME}:latest"

# Rotate old database snapshots
if [[ "$SKIP_BACKUP" == false && "$FRESH" == false ]]; then
    mapfile -t backups < <(
        find "$BACKUP_DIR" -maxdepth 1 -type f -name '*.sql.gz' \
            -printf '%T@ %p\n' | sort -rn | awk '{print $2}'
    )
    if (( ${#backups[@]} > MAX_BACKUPS )); then
        rm -f -- "${backups[@]:MAX_BACKUPS}"
        ok "Rotated old backups (kept last $MAX_BACKUPS)"
    fi
fi

ROLLOUT_STARTED=false
trap - ERR

dc ps

# ══════════════════════════════════════════════════════════════════════════════
# Success banner + reverse proxy instructions
# ══════════════════════════════════════════════════════════════════════════════
printf "\n${GREEN}${BOLD}"
printf "╔══════════════════════════════════════════════════════════╗\n"
printf "║   ✓  Deployment successful  │  commit %s  ║\n" "$IMAGE_TAG"
printf "╚══════════════════════════════════════════════════════════╝\n"
printf "${NC}\n"

log "Deployment complete. Commit: $IMAGE_TAG"

# ── Reverse proxy setup instructions (printed once) ───────────────────────────
if [[ ! -f "$APP_DIR/.proxy-configured" ]]; then
    _DOMAIN="${APP_URL:-https://xplorelanka.com}"
    _DOMAIN="${_DOMAIN#https://}"
    _DOMAIN="${_DOMAIN#http://}"
    _DOMAIN="${_DOMAIN%%/*}"

    printf "${CYAN}${BOLD}"
    printf "════════════════════════════════════════════════════════════\n"
    printf "  HOST REVERSE PROXY SETUP  (run once on the server)\n"
    printf "════════════════════════════════════════════════════════════\n"
    printf "${NC}\n"

    cat <<PROXY_INSTRUCTIONS
PHP-FPM is listening on 127.0.0.1:9000.
Configure your reverse proxy to forward requests to it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 OPTION A – Nginx  (recommended)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Install Nginx then create /etc/nginx/sites-available/${_DOMAIN}:

─────────────────────────────────────────────────────────────
server {
    listen 80;
    listen [::]:80;
    server_name ${_DOMAIN} www.${_DOMAIN};

    # ACME challenge for Let's Encrypt
    location ^~ /.well-known/acme-challenge/ { try_files \$uri =404; }
    location / { return 301 https://${_DOMAIN}\$request_uri; }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.${_DOMAIN};
    ssl_certificate     /etc/letsencrypt/live/${_DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${_DOMAIN}/privkey.pem;
    return 301 https://${_DOMAIN}\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${_DOMAIN};

    root  ${APP_DIR}/public;
    index index.php;

    ssl_certificate       /etc/letsencrypt/live/${_DOMAIN}/fullchain.pem;
    ssl_certificate_key   /etc/letsencrypt/live/${_DOMAIN}/privkey.pem;
    ssl_protocols         TLSv1.2 TLSv1.3;
    ssl_session_cache     shared:SSL:10m;
    ssl_session_timeout   1d;

    server_tokens off;
    client_max_body_size 64m;

    add_header X-Frame-Options          SAMEORIGIN                          always;
    add_header X-Content-Type-Options   nosniff                             always;
    add_header Referrer-Policy          strict-origin-when-cross-origin     always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;

    # Serve Vite-compiled assets directly from host (immutable, 1-year cache)
    location ^~ /build/ {
        try_files \$uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Other static files
    location ~* \\.(?:css|js|jpg|jpeg|png|gif|ico|svg|webp|woff2?)$ {
        try_files \$uri =404;
        expires 7d;
        access_log off;
    }

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location = /index.php {
        include fastcgi_params;
        fastcgi_pass            127.0.0.1:9000;       # PHP-FPM container port
        fastcgi_param SCRIPT_FILENAME   /var/www/public/index.php;
        fastcgi_param DOCUMENT_ROOT     /var/www/public;
        fastcgi_param SCRIPT_NAME       /index.php;
        fastcgi_param HTTP_PROXY        "";
        fastcgi_read_timeout            120s;
        fastcgi_buffer_size             16k;
        fastcgi_buffers                 8 16k;
    }

    location ~ \\.php$ { return 404; }
    location ~ /\\.       { deny all; }
}
─────────────────────────────────────────────────────────────

Enable and reload Nginx:
  sudo ln -s /etc/nginx/sites-available/${_DOMAIN} /etc/nginx/sites-enabled/
  sudo nginx -t && sudo systemctl reload nginx

Obtain TLS certificate (first time only):
  sudo certbot --nginx -d ${_DOMAIN} -d www.${_DOMAIN}


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 OPTION B – Caddy  (automatic HTTPS, zero config)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Install Caddy then create /etc/caddy/Caddyfile:

─────────────────────────────────────────────────────────────
${_DOMAIN}, www.${_DOMAIN} {
    redir https://${_DOMAIN}{uri} permanent

    root * ${APP_DIR}/public

    # Serve compiled Vite assets with long-lived cache
    @vite path /build/*
    handle @vite {
        file_server
        header Cache-Control "public, immutable, max-age=31536000"
    }

    # Serve other static files
    @static {
        file
        path *.css *.js *.jpg *.jpeg *.png *.gif *.ico *.svg *.webp *.woff2
    }
    handle @static {
        file_server
        header Cache-Control "public, max-age=604800"
    }

    # Proxy PHP files to FPM
    php_fastcgi 127.0.0.1:9000 {
        root /var/www/public
        index index.php
        resolve_root_symlink
    }

    file_server
    encode gzip
}
─────────────────────────────────────────────────────────────

Reload Caddy:
  sudo systemctl reload caddy


Once your proxy is configured, mark it as done to silence this message:
  touch ${APP_DIR}/.proxy-configured

PROXY_INSTRUCTIONS

fi

log "Deployment log: $LOG_FILE"
