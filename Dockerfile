# =============================================================================
# Xplore Lanka – Unified Production Dockerfile
# =============================================================================
# Multi-stage build:
#   1. composer-builder  – installs PHP dependencies and dumps optimised autoloader
#   2. frontend-builder  – compiles Vite/React/Tailwind assets
#   3. runtime           – hardened PHP-FPM image that serves the app
#
# The final image exposes PHP-FPM on port 9000.
# A host-level reverse proxy (Nginx, Caddy, Apache, etc.) sits in front and
# passes FastCGI requests to 127.0.0.1:9000.
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Composer Dependencies
# -----------------------------------------------------------------------------
FROM php:8.4-cli-alpine AS composer-builder

RUN apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS postgresql-dev libzip-dev icu-dev libpng-dev oniguruma-dev libxml2-dev \
    && apk add --no-cache postgresql-libs libzip icu-libs libpng oniguruma libxml2 \
    && docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd zip intl \
    && apk del .build-deps

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Layer-cache: install deps before copying all source code
COPY composer.json composer.lock ./
RUN composer install \
        --no-dev \
        --no-interaction \
        --no-scripts \
        --no-autoloader \
        --prefer-dist \
        --no-progress

COPY . .
RUN composer dump-autoload --optimize --no-dev

# -----------------------------------------------------------------------------
# Stage 2: Frontend Assets
# -----------------------------------------------------------------------------
FROM node:22-alpine AS frontend-builder

WORKDIR /app

# Layer-cache: install node deps before copying all source
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 3: Production PHP-FPM Runtime
# -----------------------------------------------------------------------------
FROM php:8.4-fpm-alpine AS runtime

LABEL org.opencontainers.image.title="Xplore Lanka"
LABEL org.opencontainers.image.description="Laravel + Inertia.js PHP-FPM application"

# Install runtime libraries; compile PHP extensions then strip build tools
RUN apk add --no-cache \
        postgresql-libs libpng libzip icu-libs oniguruma libxml2 \
    && apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS postgresql-dev libpng-dev libzip-dev icu-dev oniguruma-dev libxml2-dev \
    && docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd zip intl opcache \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps \
    # Remove the default FPM pool config and use our own
    && rm -f /usr/local/etc/php-fpm.d/www.conf.default

# PHP runtime settings
COPY php.ini /usr/local/etc/php/conf.d/99-app.ini

# PHP-FPM pool configuration (listen on 0.0.0.0:9000)
COPY php-fpm.conf /usr/local/etc/php-fpm.d/www.conf

WORKDIR /var/www

# Copy full application source (owned by www-data)
COPY --chown=www-data:www-data . /var/www

# Overlay compiled vendor from Stage 1
COPY --from=composer-builder --chown=www-data:www-data /app/vendor           /var/www/vendor
COPY --from=composer-builder --chown=www-data:www-data /app/bootstrap/cache/ /var/www/bootstrap/cache/

# Overlay compiled frontend assets from Stage 2
COPY --from=frontend-builder --chown=www-data:www-data /app/public/build     /var/www/public/build

# Ensure writable Laravel directories exist and are owned by www-data
RUN mkdir -p \
        /var/www/storage/framework/cache/data \
        /var/www/storage/framework/sessions \
        /var/www/storage/framework/views \
        /var/www/storage/logs \
        /var/www/bootstrap/cache \
    && chown -R www-data:www-data \
        /var/www/storage \
        /var/www/bootstrap/cache \
    && chmod -R u+rwX,g+rwX \
        /var/www/storage \
        /var/www/bootstrap/cache

COPY entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER www-data

EXPOSE 9000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
