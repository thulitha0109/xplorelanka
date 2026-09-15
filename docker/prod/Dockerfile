# -------------------------------------------------------------
# Stage 1: Composer Dependencies Builder
# -------------------------------------------------------------
FROM php:8.4-cli AS composer-builder

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    libicu-dev \
    libpng-dev \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-scripts --no-autoloader --prefer-dist

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

# Install production system dependencies
RUN apk add --no-cache \
    postgresql-dev \
    libpng-dev \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    libxml2-dev \
    $PHPIZE_DEPS

# Install PHP extensions
RUN docker-php-ext-configure pgsql -with-pgsql=/usr/include/postgresql/ \
    && docker-php-ext-install \
        pdo \
        pdo_pgsql \
        pgsql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        opcache

# Install Redis
RUN pecl install redis && docker-php-ext-enable redis

# Cleanup build tools
RUN apk del $PHPIZE_DEPS

# Production PHP settings
COPY docker/prod/php.ini /usr/local/etc/php/conf.d/custom.ini

# Set working directory
WORKDIR /var/www

# Copy application source
COPY . /var/www

# Copy vendor from composer-builder
COPY --from=composer-builder /app/vendor /var/www/vendor

# Copy compiled assets from frontend-builder
COPY --from=frontend-builder /app/public/build /var/www/public/build

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Copy entrypoint
COPY docker/prod/entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
