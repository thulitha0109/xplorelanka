#!/bin/sh
# =============================================================================
# Docker container entrypoint for Xplore Lanka
# =============================================================================
# Runs as www-data. Ensures Laravel's writable directory tree exists inside
# the named storage volume, then hands control to the container CMD.
# =============================================================================
set -e

# Create framework directories that must exist at runtime.
# These live inside the named Docker volume mounted at /var/www/storage,
# so they may be absent on first boot.
mkdir -p \
    /var/www/storage/framework/cache/data \
    /var/www/storage/framework/sessions \
    /var/www/storage/framework/views \
    /var/www/storage/logs \
    /var/www/bootstrap/cache

exec "$@"
