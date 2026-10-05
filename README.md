# Xplore Lanka deployment

Laravel 13 / PHP 8.4 application with PHP-FPM, PostgreSQL, Redis, a queue worker, and a scheduler. Docker Compose does **not** include or manage Nginx. Configure Nginx manually on the host as the FastCGI frontend.

## Request flow

`Browser → host Nginx (TLS + static files) → 127.0.0.1:9000 (PHP-FPM/FastCGI) → Laravel`

PHP-FPM speaks FastCGI, **not HTTP**. Nginx must use `fastcgi_pass`, not `proxy_pass`. Compose publishes FPM to loopback only. The image contains PHP runtime settings and an FPM pool configuration; no Apache configuration or host PHP installation is needed. The deploy script exports the matching Vite build to the checkout's `public/build` for host Nginx.

## One-time server setup

1. Provision a Linux host with Docker Engine, the Docker Compose v2 plugin, Git, and OpenSSL. Install/configure Nginx and TLS separately. Permit inbound 80/443 to Nginx; do not expose port 9000 publicly.
2. Clone the repository into a stable path accessible to the Nginx worker for static reads, for example `/srv/xplorelanka`. Ensure the Nginx worker can traverse the parent directories and read `public/`, `public/build/`, and the storage media directory. Keep `.env` private with mode `600`.
3. Generate the private environment file:

   `bash deploy/setup-env.sh`

   This creates `.env` with mode `600` plus random `APP_KEY`, DB password, and optional MinIO secret. It will not overwrite an existing file. Edit `.env` before deployment:
   - Set `APP_URL` to the real public HTTPS URL; keep `APP_ENV=production` and `APP_DEBUG=false`.
   - Set a unique `COMPOSE_PROJECT_NAME` for each installation. Use a unique `FPM_PORT` if another stack already uses 9000.
   - `STORAGE_PATH` defaults to `./storage`, a persistent directory under this checkout. Use a stable absolute path such as `/srv/xplorelanka/shared/storage` if deploying from replaceable release directories.
   - Uploads use Laravel's `public` disk by default. The container creates `public/storage` as a link into `STORAGE_PATH`, and Nginx serves that media directory directly. If using external S3, set `FILESYSTEM_DISK=s3` and its credentials, bucket, endpoint and browser-facing `AWS_URL`.
   - For a legacy/self-hosted MinIO backend, set `AWS_ENDPOINT=http://minio:9000`, `FILESYSTEM_DISK=s3`, `AWS_BUCKET`, and the generated MinIO credentials as the AWS credentials. `deploy.sh` activates MinIO and initializes the bucket only for that endpoint. The bucket is set to anonymous download: use this only for public media. Point `AWS_URL` at a browser-reachable media URL and configure a separate Nginx media location to the loopback MinIO port `9002` if required. External S3 is preferred for new production installs.
   - Configure mail and optional Google Maps values. The Vite Maps key is embedded in public browser assets; restrict it by allowed referrers.
4. Configure Nginx manually. A typical TLS server needs settings equivalent to:

   - `root /srv/xplorelanka/public;`
   - `location ^~ /build/ { try_files $uri =404; }` to serve compiled assets.
   - `location /storage/ { alias /srv/xplorelanka/storage/app/public/; try_files $request_filename =404; }` for local public uploads.
   - `location / { try_files $uri $uri/ /index.php?$query_string; }`
   - `location = /index.php` with `include fastcgi_params;`, `fastcgi_pass 127.0.0.1:9000;`, and `fastcgi_param SCRIPT_FILENAME /var/www/public/index.php;` (the PHP path is inside the container).
   - Deny other `*.php` requests, forward the original `Host` and `X-Forwarded-*` headers, and set `client_max_body_size 64m` plus suitable FastCGI timeouts.

   The exact Nginx syntax and TLS certificate paths are managed by you. Validate the server block with `nginx -t` and reload Nginx after changes. `TRUSTED_PROXIES` defaults to `*`; this is appropriate only because PHP-FPM is loopback-bound. If changing `FPM_BIND`, restrict access at the firewall and set `TRUSTED_PROXIES` to your Nginx source address.
5. Deploy the checkout:

   `bash deploy.sh`

   The default builds the current checkout without fetching. To fast-forward a clean Git checkout first, use `bash deploy.sh --branch main`. The script validates production settings, builds the PHP-FPM image and frontend, publishes `public/build`, starts/waits for PostgreSQL and Redis (and optional MinIO), takes a verified database backup, runs forward-only migrations, starts app/worker/scheduler, repairs Laravel storage permissions, runs `storage:link`, warms Laravel caches, and tests the FPM listener. Afterward, test `https://your-domain/up` through Nginx.

## Runtime, storage, and permissions

- PostgreSQL and Redis are private to the Compose network. The only published service is PHP-FPM on loopback. Do not expose FastCGI to the Internet or another untrusted network.
- Compose's PostgreSQL, Redis, and optional MinIO volumes retain their legacy resource names for existing stacks; project name isolates staging from production. `STORAGE_PATH` is a persistent host bind mount so Nginx can read public uploads. `docker compose down` preserves database volumes and host storage; never use `docker compose down -v` unless intentionally destroying data.
- The container entrypoint creates Laravel storage directories and repairs ownership/modes for the framework cache, sessions, logs, and public-storage directory as `www-data` (UID 33). Do not use `chmod -R 777` or recursively change ownership of the source checkout.
- `.env` is mode `600`. Database snapshots are stored under `.backups/` with directory mode `700` and file mode `600`; copy them off-host and define offsite retention. They contain sensitive production data.
- Logs go to the container log stream. Inspect with `docker compose --env-file .env -p "$COMPOSE_PROJECT_NAME" logs --tail=200 app worker scheduler db redis`.

## Database changes, backup, and rollback

Every deployment runs `php artisan migrate --force` after a compressed `pg_dump` backup is created and verified. The script never runs `migrate:fresh` or seeds production. Use backward-compatible expand/contract migrations so an old image can still run if an application rollout is reverted. On a failed app rollout the script attempts to restore the previous application image; it does not reverse schema migrations. Restore a backup only as a deliberate operator action, ideally into a separate database first and after stopping writes.

The default local retention is 10 snapshots; set `MAX_BACKUPS` to change it. `--skip-backup` is available only after independently verifying a recent usable backup.

Useful operations from the checkout:

- Services: `docker compose --env-file .env -p "$COMPOSE_PROJECT_NAME" ps`
- App logs: `docker compose --env-file .env -p "$COMPOSE_PROJECT_NAME" logs -f app`
- Artisan: `docker compose --env-file .env -p "$COMPOSE_PROJECT_NAME" exec -u www-data app php artisan about`
- Recovery: stop app/worker/scheduler, take a fresh copy of the current database, restore the selected dump into a clean PostgreSQL database, verify it, then resume services. Do not blindly pipe a dump into a populated database; it can fail on existing objects or partially restore.

## Staging

Use a separate checkout and `.env`; set a different `COMPOSE_PROJECT_NAME`, `FPM_PORT` (for example `9001`), `APP_URL`, `APP_KEY`, database credentials and storage path. Configure the staging Nginx virtual host to FastCGI-pass to `127.0.0.1:9001`. Use separate mail and object-storage credentials/buckets. Never point staging at production data.

## Local development

The root Compose stack is production-style and does not bind-mount application source into PHP. For local development use the PHP/Composer and Node toolchains from `composer.json` and `package.json` with local PostgreSQL and Redis. Do not use production secrets or volumes on a developer workstation.
