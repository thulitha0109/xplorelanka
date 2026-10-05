#!/usr/bin/env bash
# Build and deploy the current checkout. The upstream HTTP reverse proxy is
# intentionally external and is not installed or changed by this script.
set -Eeuo pipefail

APP_DIR="${APP_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"
ENV_FILE="$APP_DIR/.env"
BACKUP_DIR="${BACKUP_DIR:-$APP_DIR/.backups}"
MAX_BACKUPS="${MAX_BACKUPS:-10}"
BRANCH=""
SKIP_BACKUP=false
IMAGE_NAME="${IMAGE_NAME:-xplorelanka/app}"
IMAGE_TAG=""
PREVIOUS_TAG=""
ROLLOUT_STARTED=false

RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'
log() { printf "${CYAN}[%s]${NC} %s\n" "$(date '+%Y-%m-%d %H:%M:%S')" "$*"; }
ok() { printf "${GREEN}  ✓${NC} %s\n" "$*"; }
fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

usage() {
    cat <<'EOF'
Xplore Lanka production deployment

Usage: bash deploy.sh [--branch NAME] [--skip-backup] [--help]

Deploys the current checkout by default. --branch fetches and fast-forward
updates that Git branch before building. Migrations are always non-destructive;
this script never runs seeders or migrate:fresh.
EOF
}

while (($#)); do
    case "$1" in
        --branch) (($# >= 2)) || fail '--branch requires a branch name'; BRANCH="$2"; shift 2 ;;
        --skip-backup) SKIP_BACKUP=true; shift ;;
        --help|-h) usage; exit 0 ;;
        *) fail "Unknown option: $1" ;;
    esac
done

[[ -f "$ENV_FILE" ]] || fail "Missing $ENV_FILE. Run: bash deploy/setup-env.sh"
[[ "$MAX_BACKUPS" =~ ^[1-9][0-9]*$ ]] || fail 'MAX_BACKUPS must be a positive integer.'
for cmd in docker gzip flock stat; do command -v "$cmd" >/dev/null 2>&1 || fail "Required command not found: $cmd"; done
docker compose version >/dev/null 2>&1 || fail 'Docker Compose v2 is required.'

env_value() {
    local key="$1"
    sed -n "s/^${key}=//p" "$ENV_FILE" | head -n 1 | sed -E 's/^"(.*)"$/\1/; s/^\x27(.*)\x27$/\1/'
}

# Protect deployment secrets and reject template/development configuration.
chmod 600 "$ENV_FILE"
grep -Eq '^APP_ENV=production$' "$ENV_FILE" || fail 'Set APP_ENV=production in .env.'
grep -Eq '^APP_DEBUG=false$' "$ENV_FILE" || fail 'Set APP_DEBUG=false in .env.'
grep -Eq '^APP_KEY=base64:[A-Za-z0-9+/=]{40,}$' "$ENV_FILE" || fail 'APP_KEY is missing or invalid; run deploy/setup-env.sh.'
grep -Eq '^DB_PASSWORD=.{16,}$' "$ENV_FILE" || fail 'Set a strong DB_PASSWORD (at least 16 characters).'
if grep -Eqi '^DB_PASSWORD=(secret|password|change_me|change_this)' "$ENV_FILE"; then fail 'DB_PASSWORD is still a placeholder.'; fi
APP_URL="$(env_value APP_URL)"
[[ "$APP_URL" == https://* && "$APP_URL" != *example.com* ]] || fail 'Set APP_URL to the real public HTTPS URL.'
FILESYSTEM_DISK="$(env_value FILESYSTEM_DISK)"
MINIO_ENABLED=false
if [[ "$FILESYSTEM_DISK" == s3 ]]; then
    for key in AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_BUCKET; do
        [[ -n "$(env_value "$key")" ]] || fail "$key is required when FILESYSTEM_DISK=s3."
    done
    AWS_ENDPOINT="$(env_value AWS_ENDPOINT)"
    if [[ "$AWS_ENDPOINT" == 'http://minio:9000' || "$AWS_ENDPOINT" == 'https://minio:9000' ]]; then
        MINIO_ENABLED=true
        [[ -n "$(env_value MINIO_ROOT_USER)" ]] || fail 'MINIO_ROOT_USER is required for the bundled MinIO profile.'
        [[ "$(env_value MINIO_ROOT_PASSWORD)" =~ .{16,} ]] || fail 'Set a strong MINIO_ROOT_PASSWORD (at least 16 characters).'
    fi
fi
PROJECT_NAME="$(env_value COMPOSE_PROJECT_NAME)"
PROJECT_NAME="${PROJECT_NAME:-xplorelanka}"
[[ "$PROJECT_NAME" =~ ^[a-z0-9][a-z0-9_-]*$ ]] || fail 'COMPOSE_PROJECT_NAME must contain lowercase letters, digits, hyphens, or underscores.'
FPM_PORT="$(env_value FPM_PORT)"
FPM_PORT="${FPM_PORT:-9000}"
[[ "$FPM_PORT" =~ ^[0-9]{1,5}$ ]] && ((FPM_PORT > 0 && FPM_PORT < 65536)) || fail 'FPM_PORT must be a valid TCP port.'

# Optional Git update, deliberately requiring a clean tracked worktree.
if [[ -n "$BRANCH" ]]; then
    command -v git >/dev/null 2>&1 || fail 'git is required for --branch.'
    git -C "$APP_DIR" rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail 'APP_DIR is not a Git checkout.'
    [[ -z "$(git -C "$APP_DIR" status --porcelain --untracked-files=no)" ]] || fail 'Tracked local changes exist; commit or stash them before --branch.'
    git -C "$APP_DIR" fetch origin "$BRANCH"
    if git -C "$APP_DIR" show-ref --verify --quiet "refs/heads/$BRANCH"; then
        git -C "$APP_DIR" checkout "$BRANCH"
    else
        git -C "$APP_DIR" checkout --track -b "$BRANCH" "origin/$BRANCH"
    fi
    git -C "$APP_DIR" pull --ff-only origin "$BRANCH"
fi

if git -C "$APP_DIR" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    IMAGE_TAG="$(git -C "$APP_DIR" rev-parse --short=12 HEAD)"
    if ! git -C "$APP_DIR" diff-index --quiet HEAD -- || [[ -n "$(git -C "$APP_DIR" ls-files --others --exclude-standard)" ]]; then
        IMAGE_TAG="${IMAGE_TAG}-$(date -u +%Y%m%d%H%M%S)"
    fi
else
    IMAGE_TAG="local-$(date -u +%Y%m%d%H%M%S)"
fi
export IMAGE_NAME IMAGE_TAG
PREVIOUS_TAG="$(cat "$APP_DIR/.deploy-tag" 2>/dev/null || true)"
[[ "$PREVIOUS_TAG" == "$IMAGE_TAG" ]] && PREVIOUS_TAG=""

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"
LOG_FILE="$APP_DIR/deploy.log"
touch "$LOG_FILE"
chmod 600 "$LOG_FILE"
exec 9>"${TMPDIR:-/tmp}/${PROJECT_NAME}.deploy.lock"
flock -n 9 || fail 'Another deployment for this Compose project is running.'

# Every Compose operation uses the same environment and project name.
dc() {
    local compose_args=(docker compose --project-directory "$APP_DIR" --env-file "$ENV_FILE"
        --file "$APP_DIR/docker-compose.yml" --project-name "$PROJECT_NAME")
    if [[ "$MINIO_ENABLED" == true ]]; then compose_args+=(--profile minio); fi
    "${compose_args[@]}" "$@"
}

on_error() {
    local status=$?
    trap - ERR
    log "Deployment failed (exit $status)."
    if [[ "$ROLLOUT_STARTED" == true && -n "$PREVIOUS_TAG" ]] && docker image inspect "$IMAGE_NAME:$PREVIOUS_TAG" >/dev/null 2>&1; then
        log "Restoring previous app image tag $PREVIOUS_TAG (database migrations are not reversed)."
        IMAGE_TAG="$PREVIOUS_TAG" dc up -d --no-build --force-recreate app worker scheduler || true
    fi
    dc ps || true
    dc logs --tail=80 app worker scheduler db redis || true
    exit "$status"
}
trap on_error ERR

log "Validating Compose configuration for project $PROJECT_NAME"
dc config --quiet
log "Building immutable image $IMAGE_NAME:$IMAGE_TAG"
dc build app

log 'Publishing this release’s Vite assets to the host public/build directory'
HOST_UID="$(id -u)"
HOST_GID="$(id -g)"
docker run --rm --user "$HOST_UID:$HOST_GID" --volume "$APP_DIR:/host" \
    --entrypoint sh "$IMAGE_NAME:$IMAGE_TAG" -ec \
    'mkdir -p /host/public/build && cp -R /var/www/public/build/. /host/public/build/ && chmod -R a+rX /host/public/build'

if [[ "$MINIO_ENABLED" == true ]]; then
    log 'Starting the compatibility MinIO service and initializing its bucket'
    dc up -d minio
    dc run --rm --no-deps minio-init
fi

log 'Starting private PostgreSQL and Redis services'
dc up -d --wait db redis

if [[ "$SKIP_BACKUP" == false ]]; then
    BACKUP_FILE="$BACKUP_DIR/$(date -u '+%Y%m%d_%H%M%S').sql.gz"
    TMP_BACKUP="${BACKUP_FILE}.tmp"
    log 'Taking a compressed PostgreSQL backup before migrations'
    if dc exec -T db sh -ec 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip -c > "$TMP_BACKUP"; then
        gzip -t "$TMP_BACKUP"
        [[ -s "$TMP_BACKUP" ]] || fail 'Database backup is empty; refusing to migrate.'
        mv "$TMP_BACKUP" "$BACKUP_FILE"
        chmod 600 "$BACKUP_FILE"
        ok "Backup saved: $BACKUP_FILE"
    else
        rm -f "$TMP_BACKUP"
        fail 'Database backup failed; migrations were not run.'
    fi
fi

log 'Applying forward-only migrations'
dc run --rm --no-deps app php artisan migrate --force

ROLLOUT_STARTED=true
log 'Starting the HTTP app, queue worker, and scheduler'
dc up -d --remove-orphans --wait app worker scheduler

dc exec -T -u www-data app php artisan storage:link --force
dc exec -T -u www-data app php artisan optimize
dc exec -T -u www-data app php artisan queue:restart

log "Checking PHP-FPM listener on 127.0.0.1:$FPM_PORT"
dc exec -T -u www-data app php -r '$s=@fsockopen("127.0.0.1",9000); if (!$s) exit(1); fclose($s);'
printf '%s\n' "$IMAGE_TAG" > "$APP_DIR/.deploy-tag"
chmod 600 "$APP_DIR/.deploy-tag"

if [[ "$SKIP_BACKUP" == false ]]; then
    mapfile -t backups < <(find "$BACKUP_DIR" -maxdepth 1 -type f -name '*.sql.gz' -printf '%T@ %p\n' | sort -rn | awk '{print $2}')
    if ((${#backups[@]} > MAX_BACKUPS)); then rm -f -- "${backups[@]:MAX_BACKUPS}"; fi
fi
ROLLOUT_STARTED=false
trap - ERR

dc ps
ok "Deployment successful: $IMAGE_NAME:$IMAGE_TAG"
printf '\nManual Nginx FastCGI upstream: 127.0.0.1:%s\n' "$FPM_PORT"
printf 'Nginx serves static files from the checkout public/ directory; configure SCRIPT_FILENAME=/var/www/public/index.php for FastCGI.\n'
