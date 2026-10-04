# -------------------------------------------------------------
# Stage 1: Composer Dependencies Builder
# -------------------------------------------------------------
FROM php:8.4-cli-alpine AS composer-builder

RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS postgresql-dev libzip-dev icu-dev libpng-dev oniguruma-dev libxml2-dev \
    && apk add --no-cache postgresql-libs libzip icu-libs libpng oniguruma libxml2 \
    && docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd zip intl \
    && apk del .build-deps

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-scripts --no-autoloader --prefer-dist --no-progress

COPY . .
RUN composer dump-autoload --optimize --no-dev

# -------------------------------------------------------------
# Stage 2: Node.js Frontend Assets Builder
# -------------------------------------------------------------
FROM node:22-alpine AS frontend-builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# -------------------------------------------------------------
# Stage 3: Hardened Production PHP-FPM Runtime
# -------------------------------------------------------------
FROM php:8.4-fpm-alpine

# Install runtime libraries and only retain compiler dependencies during extension builds.
RUN apk add --no-cache postgresql-libs libpng libzip icu-libs oniguruma libxml2 \
    && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS postgresql-dev libpng-dev libzip-dev icu-dev oniguruma-dev libxml2-dev \
    && docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd zip intl opcache \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

# Production PHP settings
COPY docker/prod/php.ini /usr/local/etc/php/conf.d/custom.ini

# Set working directory
WORKDIR /var/www

# Copy application source
COPY --chown=www-data:www-data . /var/www

# Copy vendor from composer-builder
COPY --from=composer-builder --chown=www-data:www-data /app/vendor /var/www/vendor
COPY --from=composer-builder --chown=www-data:www-data /app/bootstrap/cache/ /var/www/bootstrap/cache/

# Copy compiled assets from frontend-builder
COPY --from=frontend-builder --chown=www-data:www-data /app/public/build /var/www/public/build

RUN mkdir -p /var/www/storage/framework/cache/data \
        /var/www/storage/framework/sessions \
        /var/www/storage/framework/views \
        /var/www/storage/logs \
        /var/www/bootstrap/cache \
    && chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R u+rwX,g+rwX /var/www/storage /var/www/bootstrap/cache

# Copy entrypoint
COPY docker/prod/entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
