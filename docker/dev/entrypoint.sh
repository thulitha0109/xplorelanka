#!/bin/sh
set -e

# Ensure required Laravel storage directories exist
mkdir -p /var/www/storage/framework/cache/data \
         /var/www/storage/framework/sessions \
         /var/www/storage/framework/views \
         /var/www/storage/logs \
         /var/www/bootstrap/cache

# Execute the container command
exec "$@"
