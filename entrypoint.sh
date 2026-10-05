#!/bin/sh
set -eu

# Named volumes can be created as root on the first deployment or already
# contain data from an earlier release. Make Laravel's writable paths safe.
mkdir -p \
    /var/www/storage/app/public \
    /var/www/storage/app/private \
    /var/www/storage/framework/cache/data \
    /var/www/storage/framework/sessions \
    /var/www/storage/framework/views \
    /var/www/storage/logs \
    /var/www/bootstrap/cache
chown www-data:www-data /var/www/storage /var/www/storage/app /var/www/storage/app/public /var/www/storage/app/private
chown -R www-data:www-data /var/www/storage/framework /var/www/storage/logs /var/www/bootstrap/cache
chmod 2775 /var/www/storage /var/www/storage/app /var/www/storage/app/public /var/www/storage/app/private
chmod -R ug+rwX,o-rwx /var/www/storage/framework /var/www/storage/logs /var/www/bootstrap/cache

# PHP-FPM's master starts as root and drops pool workers to www-data. Artisan
# and queue/scheduler processes must run as www-data, not root.
if [ "${1##*/}" = "php-fpm" ]; then
    exec "$@"
fi
exec gosu www-data "$@"
