#!/bin/sh
set -e

# The image owns the Laravel writable paths; do not run permission changes or
# cache commands on every boot. Deploy scripts perform checked cache commands.
mkdir -p /var/www/storage/framework/cache/data \
         /var/www/storage/framework/sessions \
         /var/www/storage/framework/views \
         /var/www/storage/logs \
         /var/www/bootstrap/cache

exec "$@"
