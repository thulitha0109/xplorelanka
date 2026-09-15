#!/bin/sh
set -e

# Ensure required Laravel storage directories exist
mkdir -p /var/www/storage/framework/cache/data \
         /var/www/storage/framework/sessions \
         /var/www/storage/framework/views \
         /var/www/storage/logs \
         /var/www/bootstrap/cache

# Fix permissions if needed
chmod -R 775 /var/www/storage /var/www/bootstrap/cache 2>/dev/null || true

# Execute the container command
exec "$@"
