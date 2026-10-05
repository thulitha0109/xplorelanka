# Multi-stage production image: locked PHP dependencies, Vite assets, PHP-FPM runtime.
FROM php:8.4-cli-bookworm AS composer-builder

RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip $PHPIZE_DEPS libicu-dev libonig-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev libzip-dev libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" pdo_pgsql mbstring exif pcntl bcmath gd zip intl opcache \
    && rm -rf /var/lib/apt/lists/*
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-scripts --no-autoloader --prefer-dist --no-progress
COPY . .
RUN composer dump-autoload --optimize --no-dev

FROM node:22-bookworm-slim AS frontend-builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ARG VITE_GOOGLE_MAPS_API_KEY=
ENV VITE_GOOGLE_MAPS_API_KEY=${VITE_GOOGLE_MAPS_API_KEY}
RUN npm run build

FROM php:8.4-fpm-bookworm AS runtime
LABEL org.opencontainers.image.title="Xplore Lanka" \
      org.opencontainers.image.description="Laravel PHP-FPM application behind a manually managed Nginx proxy"

RUN apt-get update && apt-get install -y --no-install-recommends \
        libicu72 libonig5 libpng16-16 libjpeg62-turbo libfreetype6 libzip4 libpq5 gosu \
        $PHPIZE_DEPS libicu-dev libonig-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev libzip-dev libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" pdo_pgsql mbstring exif pcntl bcmath gd zip intl opcache \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get purge -y --auto-remove $PHPIZE_DEPS libicu-dev libonig-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev libzip-dev libpq-dev \
    && rm -rf /var/lib/apt/lists/* \
    && printf '%s\n' \
        '[PHP]' \
        'memory_limit=256M' \
        'max_execution_time=60' \
        'upload_max_filesize=64M' \
        'post_max_size=64M' \
        'display_errors=Off' \
        'display_startup_errors=Off' \
        'log_errors=On' \
        'error_log=/proc/self/fd/2' \
        'expose_php=Off' \
        '[Date]' \
        'date.timezone=UTC' \
        '[opcache]' \
        'opcache.enable=1' \
        'opcache.enable_cli=0' \
        'opcache.memory_consumption=256' \
        'opcache.interned_strings_buffer=16' \
        'opcache.max_accelerated_files=20000' \
        'opcache.validate_timestamps=0' \
        'opcache.save_comments=1' \
        > /usr/local/etc/php/conf.d/99-app.ini \
    && printf '%s\n' \
        '[www]' \
        'user=www-data' \
        'group=www-data' \
        'listen=0.0.0.0:9000' \
        'pm=dynamic' \
        'pm.max_children=20' \
        'pm.start_servers=4' \
        'pm.min_spare_servers=2' \
        'pm.max_spare_servers=8' \
        'pm.max_requests=500' \
        'access.log=/proc/self/fd/2' \
        'catch_workers_output=yes' \
        'decorate_workers_output=no' \
        'clear_env=no' \
        'php_admin_flag[log_errors]=on' \
        'php_admin_value[error_log]=/proc/self/fd/2' \
        'php_admin_value[memory_limit]=256M' \
        > /usr/local/etc/php-fpm.d/zz-app.conf

WORKDIR /var/www
COPY --chown=www-data:www-data . /var/www
COPY --from=composer-builder --chown=www-data:www-data /app/vendor /var/www/vendor
COPY --from=composer-builder --chown=www-data:www-data /app/bootstrap/cache/ /var/www/bootstrap/cache/
COPY --from=frontend-builder --chown=www-data:www-data /app/public/build /var/www/public/build

RUN mkdir -p \
        /var/www/storage/app/public \
        /var/www/storage/app/private \
        /var/www/storage/framework/cache/data \
        /var/www/storage/framework/sessions \
        /var/www/storage/framework/views \
        /var/www/storage/logs \
        /var/www/bootstrap/cache \
    && ln -s ../storage/app/public /var/www/public/storage \
    && chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R ug+rwX,o-rwx /var/www/storage /var/www/bootstrap/cache

COPY entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod 0755 /usr/local/bin/docker-entrypoint.sh

EXPOSE 9000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm", "-F"]
