#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$APP_DIR/.env"
TEMPLATE="$APP_DIR/.env.example"

if [[ -e "$ENV_FILE" ]]; then
    printf 'Refusing to overwrite existing %s\n' "$ENV_FILE" >&2
    exit 1
fi
[[ -f "$TEMPLATE" ]] || { printf 'Missing environment template: %s\n' "$TEMPLATE" >&2; exit 1; }
command -v openssl >/dev/null 2>&1 || { printf 'openssl is required.\n' >&2; exit 1; }

umask 077
cp "$TEMPLATE" "$ENV_FILE"
APP_KEY="base64:$(openssl rand -base64 32 | tr -d '\n')"
DB_PASSWORD="$(openssl rand -hex 32)"
MINIO_PASSWORD="$(openssl rand -hex 32)"
sed -i "s#^APP_KEY=.*#APP_KEY=$APP_KEY#; s#^DB_PASSWORD=.*#DB_PASSWORD=$DB_PASSWORD#; s#^AWS_ACCESS_KEY_ID=.*#AWS_ACCESS_KEY_ID=xplorelanka_minio#; s#^AWS_SECRET_ACCESS_KEY=.*#AWS_SECRET_ACCESS_KEY=$MINIO_PASSWORD#; s#^MINIO_ROOT_USER=.*#MINIO_ROOT_USER=xplorelanka_minio#; s#^MINIO_ROOT_PASSWORD=.*#MINIO_ROOT_PASSWORD=$MINIO_PASSWORD#" "$ENV_FILE"
chmod 600 "$ENV_FILE"

cat <<EOF
Created $ENV_FILE with mode 600 and generated APP_KEY/DB_PASSWORD.
Before deploying, edit it and set:
  - APP_URL to the public HTTPS URL
  - COMPOSE_PROJECT_NAME / FPM_PORT if this is not the only stack on the host
  - SMTP settings and any Google Maps key
  - AWS_* settings if FILESYSTEM_DISK=s3 (otherwise uploads use persistent local storage)
EOF
