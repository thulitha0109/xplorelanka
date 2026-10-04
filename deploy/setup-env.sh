#!/usr/bin/env bash
# Create a private production/staging env file and generate Laravel/DB secrets.
set -Eeuo pipefail

if [[ $# -ne 1 ]]; then
    echo 'Usage: bash deploy/setup-env.sh <production|staging>' >&2
    exit 2
fi
case "$1" in
    production) name=.env.production ;;
    staging) name=.env.staging ;;
    *) echo 'Environment must be production or staging.' >&2; exit 2 ;;
esac

ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
TARGET="$ROOT/$name"
TEMPLATE="$ROOT/$name.example"
command -v openssl >/dev/null 2>&1 || { echo 'openssl is required.' >&2; exit 1; }
[[ -f "$TEMPLATE" ]] || { echo "Missing template: $TEMPLATE" >&2; exit 1; }
[[ ! -e "$TARGET" ]] || { echo "$TARGET already exists; refusing to overwrite secrets." >&2; exit 1; }

cp "$TEMPLATE" "$TARGET"
APP_KEY="base64:$(openssl rand -base64 32 | tr -d '\n')"
DB_PASSWORD=$(openssl rand -hex 32)
sed -i "s|^APP_KEY=.*|APP_KEY=$APP_KEY|" "$TARGET"
sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=$DB_PASSWORD|" "$TARGET"
chmod 600 "$TARGET"
printf 'Created %s with generated APP_KEY and database password.\n' "$TARGET"
printf 'Now edit it to set the S3 credentials, bucket, public URL, and mail settings before deploying.\n'
