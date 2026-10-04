#!/usr/bin/env bash
# Shared, fail-fast deployment workflow. Invoke through prod.sh or staging.sh.
set -Eeuo pipefail

usage() {
    cat <<'USAGE'
Usage: deploy.sh <production|staging> [--branch NAME | --revision COMMIT] [--seed]

--seed is staging-only and runs the idempotent database seeder after migrations.
Deployments always build a fresh, commit-tagged image. Production never seeds.
USAGE
}

fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
log() { printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')" "$*" | tee -a "$LOG_FILE"; }

[[ $# -ge 1 ]] || { usage; exit 2; }
ENVIRONMENT=$1
shift
case "$ENVIRONMENT" in
    production)
        COMPOSE_FILE=docker-compose.prod.yml
        ENV_FILE_NAME=.env.production
        IMAGE_REPOSITORY=xplorelanka/app-production
        DEFAULT_BRANCH=${PRODUCTION_BRANCH:-stag}
        DEFAULT_HEALTH_URL=https://xplorelanka.com/up
        ;;
    staging)
        COMPOSE_FILE=docker-compose.staging.yml
        ENV_FILE_NAME=.env.staging
        IMAGE_REPOSITORY=xplorelanka/app-staging
        DEFAULT_BRANCH=stag
        DEFAULT_HEALTH_URL=https://staging.xplorelanka.com/up
        ;;
    *) usage; fail "Environment must be production or staging." ;;
esac

APP_DIR=${APP_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}
BRANCH=${DEPLOY_BRANCH:-$DEFAULT_BRANCH}
REVISION=
SEED=false
HEALTHCHECK_URL=${HEALTHCHECK_URL:-$DEFAULT_HEALTH_URL}
BACKUP_DIR=${BACKUP_DIR:-$APP_DIR/.backups}
MAX_BACKUPS=${MAX_BACKUPS:-10}
ENV_FILE="$APP_DIR/$ENV_FILE_NAME"
LOG_FILE="$APP_DIR/deploy-$ENVIRONMENT.log"
LOCK_FILE="${TMPDIR:-/tmp}/xplorelanka-${ENVIRONMENT}.deploy.lock"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --branch) [[ $# -ge 2 ]] || fail '--branch requires a name'; BRANCH=$2; shift 2 ;;
        --revision) [[ $# -ge 2 ]] || fail '--revision requires a commit'; REVISION=$2; shift 2 ;;
        --seed) SEED=true; shift ;;
        --help|-h) usage; exit 0 ;;
        *) fail "Unknown option: $1" ;;
    esac
done
[[ "$SEED" == false || "$ENVIRONMENT" == staging ]] || fail '--seed is only allowed for staging.'

for command in docker git curl gzip flock stat; do
    command -v "$command" >/dev/null 2>&1 || fail "Missing required command: $command"
done
docker compose version >/dev/null 2>&1 || fail 'Docker Compose v2 is required.'
[[ -d "$APP_DIR/.git" ]] || fail "No Git checkout found at $APP_DIR."
[[ -f "$ENV_FILE" ]] || fail "Missing $ENV_FILE; copy the matching example and configure it first."

# Environment files contain secrets and should only be readable by their owner.
ENV_MODE=$(stat -c '%a' "$ENV_FILE")
(( (8#$ENV_MODE & 077) == 0 )) || fail "$ENV_FILE must be mode 600 (run chmod 600 on it)."
grep -Eq '^APP_KEY=base64:[A-Za-z0-9+/=]{40,}$' "$ENV_FILE" || fail 'APP_KEY is missing or invalid.'
grep -Eq '^DB_PASSWORD=.+$' "$ENV_FILE" || fail 'DB_PASSWORD is empty.'
grep -Eq '^DB_PASSWORD=(secret|password|change_me|change_this)' "$ENV_FILE" && fail 'DB_PASSWORD is still a sample value.'
grep -Eq '^FILESYSTEM_DISK=s3$' "$ENV_FILE" || fail 'Use the configured S3-compatible disk (FILESYSTEM_DISK=s3) for deployment.'
grep -Eq '^AWS_BUCKET=.+$' "$ENV_FILE" || fail 'AWS_BUCKET must be configured.'
grep -Eq '^AWS_ACCESS_KEY_ID=.+$' "$ENV_FILE" || fail 'AWS_ACCESS_KEY_ID must be configured.'
grep -Eq '^AWS_SECRET_ACCESS_KEY=.+$' "$ENV_FILE" || fail 'AWS_SECRET_ACCESS_KEY must be configured.'

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"
touch "$LOG_FILE"
chmod 600 "$LOG_FILE"
exec 9>"$LOCK_FILE"
flock -n 9 || fail "Another $ENVIRONMENT deployment is already running."

cd "$APP_DIR"
if [[ -n "$(git status --porcelain)" ]]; then
    printf 'Working-tree changes detected in %s:\n' "$APP_DIR" >&2
    git status --short >&2
    cat >&2 <<'DIRTY_TREE_HELP'
Review those paths on the server before deploying. Commit/push intentional code
changes, or restore/remove only changes you have verified are disposable. Do not
run `git reset --hard` blindly: it can permanently delete server-side changes.

Then deploy with `./deploy/prod.sh` (or `./deploy/staging.sh`). To invoke this
shared script directly, pass the environment: `./deploy/deploy.sh production`.
DIRTY_TREE_HELP
    exit 1
fi
PREVIOUS_COMMIT=$(git rev-parse HEAD)
PREVIOUS_TAG=$(cat ".deploy-tag-$ENVIRONMENT" 2>/dev/null || true)

if [[ -n "$REVISION" ]]; then
    git fetch --tags origin
    git cat-file -e "$REVISION^{commit}" 2>/dev/null || fail "Unknown Git revision: $REVISION"
    git checkout --detach "$REVISION"
else
    if ! git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1; then
        printf 'ERROR: remote branch %q does not exist on origin. Available branches:\n' "$BRANCH" >&2
        git ls-remote --heads origin | sed 's#^.\{40\}[[:space:]]*refs/heads/##' >&2 || true
        printf 'Choose a listed branch with --branch NAME, or set DEPLOY_BRANCH.\n' >&2
        exit 1
    fi
    git fetch --tags origin "$BRANCH"
    if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
        git checkout "$BRANCH"
    else
        git checkout --track -b "$BRANCH" "origin/$BRANCH"
    fi
    git pull --ff-only origin "$BRANCH"
fi
IMAGE_TAG=$(git rev-parse --short=12 HEAD)
export IMAGE_TAG IMAGE_REPOSITORY
log "Deploying $ENVIRONMENT commit $IMAGE_TAG (branch: $BRANCH)."

# Compose injects the runtime env file into Laravel services; --env-file is also
# needed for Postgres initialization values and Compose-time interpolation.
dc() { IMAGE_TAG="$IMAGE_TAG" IMAGE_REPOSITORY="$IMAGE_REPOSITORY" docker compose --project-directory "$APP_DIR" --env-file "$ENV_FILE" -f "$APP_DIR/$COMPOSE_FILE" "$@"; }
dc config --quiet

ROLLOUT_STARTED=false
rollback_code() {
    local reason=$1
    log "Deployment check failed: $reason"
    if [[ -n "$PREVIOUS_TAG" ]] && docker image inspect "$IMAGE_REPOSITORY:$PREVIOUS_TAG" >/dev/null 2>&1; then
        log "Restoring prior application image tag $PREVIOUS_TAG (database migrations are not automatically reversed)."
        IMAGE_TAG=$PREVIOUS_TAG dc up -d --no-build --force-recreate app worker scheduler || true
    else
        git checkout --detach "$PREVIOUS_COMMIT" || true
        log 'No prior image tag recorded; current image remains available for manual recovery.'
    fi
    dc logs --tail=80 app || true
    exit 1
}

on_error() {
    local exit_code=$?
    trap - ERR
    log "Deployment command failed (exit $exit_code)."
    if [[ "$ROLLOUT_STARTED" == true && -n "$PREVIOUS_TAG" ]] \
        && docker image inspect "$IMAGE_REPOSITORY:$PREVIOUS_TAG" >/dev/null 2>&1; then
        log "Restoring previous application image $PREVIOUS_TAG; database changes are left untouched."
        IMAGE_TAG=$PREVIOUS_TAG dc up -d --no-build --force-recreate app worker scheduler || true
    fi
    dc ps || true
    dc logs --tail=80 app db redis || true
    exit "$exit_code"
}
trap on_error ERR

# Build a new immutable image before touching running services.
dc build app worker scheduler
# The host Nginx serves the matching Vite assets directly from APP_DIR/public.
BUILD_CONTAINER=$(docker create "$IMAGE_REPOSITORY:$IMAGE_TAG")
mkdir -p "$APP_DIR/public/build"
docker cp "$BUILD_CONTAINER:/var/www/public/build/." "$APP_DIR/public/build/"
docker rm "$BUILD_CONTAINER" >/dev/null

dc up -d db redis
log 'Waiting for PostgreSQL and Redis readiness.'
DB_READY=false
for attempt in $(seq 1 60); do
    if dc exec -T db sh -ec 'pg_isready -q -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
        && dc exec -T redis redis-cli ping | grep -q PONG; then
        DB_READY=true
        break
    fi
    sleep 2
done
[[ "$DB_READY" == true ]] || rollback_code 'database or Redis did not become ready.'

# Snapshot before migrations. gzip -t verifies the written archive.
BACKUP_FILE="$BACKUP_DIR/${ENVIRONMENT}_$(date '+%Y%m%d_%H%M%S').sql.gz"
TMP_BACKUP="$BACKUP_FILE.tmp"
if dc exec -T db sh -ec 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip -c > "$TMP_BACKUP"; then
    gzip -t "$TMP_BACKUP"
    [[ -s "$TMP_BACKUP" ]] || rollback_code 'database backup is empty.'
    mv "$TMP_BACKUP" "$BACKUP_FILE"
    chmod 600 "$BACKUP_FILE"
    log "Database backup verified: $BACKUP_FILE"
else
    rm -f "$TMP_BACKUP"
    rollback_code 'database backup failed; migrations were not run.'
fi

# Apply migrations exactly once using the new, versioned image.
dc run --rm --no-deps app php artisan migrate --force
if [[ "$SEED" == true ]]; then
    log 'Running the staging seeder by explicit request.'
    dc run --rm --no-deps app php artisan db:seed --force
fi
dc run --rm --no-deps app php artisan optimize:clear
# Update app, worker, scheduler together; Compose removes the old bundled web service.
ROLLOUT_STARTED=true
dc up -d --remove-orphans --force-recreate app worker scheduler
dc exec -T app php artisan optimize
dc exec -T app php artisan queue:restart

log "Checking public endpoint $HEALTHCHECK_URL"
HEALTHY=false
for attempt in $(seq 1 12); do
    if curl --fail --silent --show-error --max-time 15 "$HEALTHCHECK_URL" -o /dev/null; then
        HEALTHY=true
        break
    fi
    sleep 5
done
[[ "$HEALTHY" == true ]] || rollback_code "public health check failed at $HEALTHCHECK_URL."

printf '%s\n' "$IMAGE_TAG" > ".deploy-tag-$ENVIRONMENT"
chmod 600 ".deploy-tag-$ENVIRONMENT"
# Keep a convenient latest alias for manual Compose operations after deployment.
docker tag "$IMAGE_REPOSITORY:$IMAGE_TAG" "$IMAGE_REPOSITORY:latest"
ROLLOUT_STARTED=false
log "$ENVIRONMENT deployment succeeded: $IMAGE_TAG"
dc ps

# Retain only the newest local database snapshots; copy them off-host for disaster recovery.
mapfile -t backups < <(find "$BACKUP_DIR" -maxdepth 1 -type f -name "${ENVIRONMENT}_*.sql.gz" -printf '%T@ %p\n' | sort -rn | awk '{print $2}')
if (( ${#backups[@]} > MAX_BACKUPS )); then
    rm -f -- "${backups[@]:MAX_BACKUPS}"
fi
