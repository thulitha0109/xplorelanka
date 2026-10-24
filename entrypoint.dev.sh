#!/bin/bash
set -e

# Ensure storage subdirectories and bootstrap cache exist
mkdir -p \
    /var/www/storage/app/public \
    /var/www/storage/app/private \
    /var/www/storage/framework/cache/data \
    /var/www/storage/framework/sessions \
    /var/www/storage/framework/views \
    /var/www/storage/logs \
    /var/www/bootstrap/cache

# Create storage symlink if missing
if [ ! -L /var/www/public/storage ] && [ -f /var/www/artisan ]; then
    php artisan storage:link --quiet || true
fi

# Initialize MinIO bucket if script exists
if [ -f /var/www/init-minio.php ] && [ -f /var/www/vendor/autoload.php ]; then
    php /var/www/init-minio.php || true
fi

exec "$@"
