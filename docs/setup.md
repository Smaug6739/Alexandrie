# Alexandrie Setup Guide

This guide explains how to set up, configure, and deploy the Alexandrie stack.

It covers both **local development** and **production deployment**, including how to configure environment variables, connect the different services, and handle HTTPS with a reverse proxy.

---

## Overview of the Stack

The Alexandrie stack consists of four main services, defined in the `docker-compose.yml` file:

| Service      | Description                                                                    |
| ------------ | ------------------------------------------------------------------------------ |
| **MySQL**    | Relational database used to store user data and metadata.                      |
| **RustFS**   | S3-compatible object storage used for file and media storage.                  |
| **Backend**  | The Go-based API server providing authentication, storage, and access control. |
| **Frontend** | A Nuxt 4 web app that communicates with the backend via REST API.              |

All services are connected through a dedicated Docker network (`alexandrie-network`).

---

## Quick Start

For local testing, you can run Alexandrie directly using the provided `docker-compose.yml`:

Download the `docker-compose.yml` file from the repository: [https://github.com/Smaug6739/Alexandrie/blob/main/docker-compose.yml](https://github.com/Smaug6739/Alexandrie/blob/main/docker-compose.yml) and run:

```bash
docker compose up
```

Once the containers are running:

- Frontend → http://localhost:8200
- Backend API → http://localhost:8201
- Object Storage (RustFS) → http://localhost:9000

_Default credentials and basic settings are automatically applied._

## Configuration (Environment Variables)

Each service can be configured using environment variables defined in the docker-compose file (or in a separate `.env` file, if you prefer but need to include the file in the docker compose config).

Key variables include:

### MySQL

```yml
MYSQL_ROOT_PASSWORD: rootpassword
MYSQL_DATABASE: alexandrie
MYSQL_USER: alexandrie
MYSQL_PASSWORD: password
```

**Notes:**

- Change all default passwords before deploying to production.
- The database is stored in a named Docker volume (mysql_data).
- You can access the MySQL shell with:

```bash
docker exec -it alexandrie-mysql mysql -u alexandrie -p
```

### RustFS (Object Storage)

```yml
RUSTFS_ACCESS_KEY: alexandrie-key
RUSTFS_SECRET_KEY: alexandrie-secret
RUSTFS_CONSOLE_ENABLE: 'false'
```

**Notes:**

RustFS acts like an S3-compatible object storage (similar to MinIO).

- All uploaded files like images, videos, or attachments are stored here.
- The `RUSTFS_CONSOLE_ENABLE` option enables a simple web console (useful in dev, disable in prod).
- Data is stored in the `rustfs_data` volume and logs in `rustfs_logs`.

### Backend

```yml
BACKEND_PORT: 8201
```

The port on which the backend API listens.

```yml
FRONTEND_URL: https://example.com
```

When `FRONTEND_URL` is defined, `FRONTEND_URL` and `COOKIE_DOMAIN` will be automatically derived at startup.

**Legacy variables (still supported, but not recommended):**

```yml
FRONTEND_URL: http://localhost:8200
COOKIE_DOMAIN: localhost
```

**Authentication and security:**

```yml
JWT_SECRET: your-secure-jwt-secret-key-change-this-in-production
ALLOW_UNSECURE: 'true'
```

- `JWT_SECRET`: Secret key used to sign JWT tokens. Change this in production.
- `ALLOW_UNSECURE`
  - `true` allows non-HTTPS connections (for local testing).
  - `false` enforces HTTPS (recommended in production).

**Database connection:**

```yml
DATABASE_HOST: mysql
DATABASE_PORT: 3306
DATABASE_NAME: alexandrie
DATABASE_USER: alexandrie
DATABASE_PASSWORD: password
```

These variables configure the connection to the MySQL database.

These should match the MySQL service configuration.

**Object Storage (RustFS / MinIO)** (OPTIONAL)

```yml
MINIO_ENDPOINT: rustfs:9000
MINIO_ACCESSKEY: alexandrie-key
MINIO_SECRETKEY: alexandrie-secret
MINIO_BUCKET: alexandrie
```

These variables configure the connection to the object storage server.

If you don't want to use the "CDN" feature, you can omit these variables.

**SMTP Email Settings** (OPTIONAL)

```yml
SMTP_HOST: smtp.example.com
SMTP_MAIL: no-reply@example.com
SMTP_PASSWORD: yourpassword
```

These variables configure the SMTP server for sending emails (only for password resets).
If not set, email features will be disabled.

**Other settings:**

```yml
GIN_MODE: release
```

Sets the Gin framework mode. Use `release` in production for better performance.

### Frontend

```yml
PORT: 8200
NUXT_PUBLIC_BASE_API: http://localhost:8201
NUXT_PUBLIC_BASE_CDN: http://localhost:9000/alexandrie
NUXT_PUBLIC_BASE_URL: http://localhost:8200
```

These variables configure the frontend application:

- `PORT`: Port on which the frontend listens.
- `NUXT_PUBLIC_BASE_API`: Base URL for the backend API.
- `NUXT_PUBLIC_BASE_CDN`: Base URL for the object storage (CDN).
- `NUXT_PUBLIC_BASE_URL`: Base URL for the frontend.

When deploying to production, update these URLs to match your domain and ensure HTTPS is used.

## Production Deployment

For production, you **should not** expose MySQL, RustFS, or Backend ports publicly.
Instead, use a reverse proxy like Nginx or Apache to:

- route HTTPS traffic to frontend and backend,
- manage SSL certificates (e.g., via Let's Encrypt),
- add basic rate limiting or caching.

Ensure all default passwords and secrets are changed before going live.

**Example Nginx configuration:**

**Frontend configuration:**

```nginx
server {
    listen                               443 ssl http2;
    listen                               [::]:443 ssl http2;
    server_name                          alexandrie-hub.fr;

    # SSL
    ssl_certificate                      /etc/nginx/ssl/alexandrie-hub.fr/alexandrie-hub.fr_ssl_certificate.cer;
    ssl_trusted_certificate              /etc/nginx/ssl/alexandrie-hub.fr/_.alexandrie-hub.fr_ssl_certificate_INTERMEDIATE.cer;
    ssl_certificate_key                  /etc/nginx/ssl/alexandrie-hub.fr/_.alexandrie-hub.fr_private_key.key;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # logging
    access_log                           /var/log/nginx/access.log combined buffer=512k flush=1m;
    error_log                            /var/log/nginx/error.log warn;

    # reverse proxy
    location / {
        proxy_pass            http://127.0.0.1:8200; # Frontend
        proxy_set_header Host $host;
        include               nginxconfig.io/proxy.conf;
    }

}

# HTTP redirect
server {
    listen      80;
    listen      [::]:80;
    server_name alexandrie-hub.fr;
    return      301 https://alexandrie-hub.fr$request_uri;
}
```

**Backend configuration:**

```nginx
server {
    listen                               443 ssl http2;
    listen                               [::]:443 ssl http2;
    server_name                          api.alexandrie-hub.fr;

    # SSL
    ssl_certificate                      /etc/nginx/ssl/alexandrie-hub.fr/alexandrie-hub.fr_ssl_certificate.cer;
    ssl_trusted_certificate              /etc/nginx/ssl/alexandrie-hub.fr/_.alexandrie-hub.fr_ssl_certificate_INTERMEDIATE.cer;
    ssl_certificate_key                  /etc/nginx/ssl/alexandrie-hub.fr/_.alexandrie-hub.fr_private_key.key;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # logging
    access_log                           /var/log/nginx/access.log combined buffer=512k flush=1m;
    error_log                            /var/log/nginx/error.log warn;

    # reverse proxy
    location / {
        proxy_pass            http://127.0.0.1:8201;
        proxy_set_header Host $host;
        include               nginxconfig.io/proxy.conf;
    }

}

# HTTP redirect
server {
    listen      80;
    listen      [::]:80;
    server_name api.alexandrie-hub.fr;
    return      301 https://api.alexandrie-hub.fr$request_uri;
}
```

Same principles for CDN domain if used.
