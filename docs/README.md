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

_Note: No default account is created. You can register a new user directly from the frontend._

## Configuration (Environment Variables)

To customize the setup (ports, domains, security, feature flags, production deployment), you can create a `.env` file next to `docker-compose.yml`.

The `.env` file template can be found here: [https://github.com/Smaug6739/Alexandrie/blob/main/.env.example](https://github.com/Smaug6739/Alexandrie/blob/main/.env.example)

Only the variables defined in `.env.example` are officially supported.

### 1. Public URLs & Global Access

```env
FRONTEND_URL=http://localhost:8200
API_URL=http://localhost:8201
CDN_URL=http://localhost:9005

CDN_ENDPOINT=/alexandrie/
```

These variables define how clients (browsers) reach your services.

- `FRONTEND_URL`: The public URL for the frontend service.
- `API_URL`: The public URL for the backend API service.
- `CDN_URL`: The public URL for the object storage service (RustFS).
- `CDN_ENDPOINT`: The path prefix under which files are exposed. You probably want to keep this as /alexandrie/ to match the bucket name, change it only if you changed the bucket name or if you have configured a reverse proxy path.  
  Final URL are constructed as: `<CDN_URL><CDN_ENDPOINT><object-path>`  
  If you have a problem with files URL just open devtools in your browser and check the actual URL used to load files and then adjust these variables accordingly.

### 2. Application Feature Flags

```env
CONFIG_DISABLE_LANDING=false
CONFIG_DISABLE_SIGNUP=false
```

These variables control specific features of the application (useful for private deployments, internal tools etc.).

- `CONFIG_DISABLE_LANDING`: If set to `true`, the landing page is disabled, and users are redirected to the login page. The default is `false`.
- `CONFIG_DISABLE_SIGNUP`: If set to `true`, new user registrations are disabled (in frontend + backend for security). The default is `false`.

### 3. Backend API — Runtime & Security

```env
BACKEND_EXTERNAL_PORT=8201
COOKIE_DOMAIN=localhost:8200
ALLOW_UNSECURE=true
JWT_SECRET=your-secure-jwt-secret-key-change-this-in-production
```

These variables configure the backend API service.

- `BACKEND_EXTERNAL_PORT`: The port exposed on your host machine for the Backend API service.
- `COOKIE_DOMAIN` (IMPORTANT): This variable defines where authentication cookies are valid.  
  It should match with the common domain used by both frontend and backend services.  
  Example: If your frontend is at `frontend.yourdomain.com` and your backend API is at `api.yourdomain.com`, then set `COOKIE_DOMAIN=yourdomain.com`.  
  **Rules:**
  - Must match with the highest common domain between the frontend and the backend. See #286 for more details.
  - Must NOT include protocol (http:// or https://)
  - If misconfigured, login will appear to work but users will be instantly logged out
- `ALLOW_UNSECURE`: If set to `true`, HTTP connections are allowed (useful for local and dev). In production, it is recommended to set this to `false` to enforce HTTPS.
- `JWT_SECRET`: Secret key used to sign JWT tokens. You should change this to a random long string correcly generated (with openssl or similar) in production for security. Changing this value will invalidate all existing sessions.

### 4. Database — MySQL

```env
MYSQL_EXTERNAL_PORT=3307
MYSQL_DATABASE=alexandrie
MYSQL_USER=alexandrie
MYSQL_PASSWORD=password
MYSQL_ROOT_PASSWORD=rootpassword
```

These variables configure the MySQL database service.

- `MYSQL_EXTERNAL_PORT`: The port exposed on your host machine for the MySQL service.
- `MYSQL_DATABASE`: The name of the default database created for Alexandrie.
- `MYSQL_USER`: The username for the default Alexandrie database user.
- `MYSQL_PASSWORD`: The password for the default Alexandrie database user.
- `MYSQL_ROOT_PASSWORD`: The password for the MySQL root user.

### 5. Object Storage — S3 (RustFS / MinIO-compatible) (optional, leave empty to disable)

```env
RUSTFS_EXTERNAL_PORT=9005

RUSTFS_ACCESS_KEY=alexandrie-key
RUSTFS_SECRET_KEY=alexandrie-secret

MINIO_BUCKET=alexandrie
```

These variables configure the RustFS object storage service.

- `RUSTFS_EXTERNAL_PORT`: The port exposed on your host machine for the RustFS service.
- `RUSTFS_ACCESS_KEY`: The access key for the RustFS S3-compatible API.
- `RUSTFS_SECRET_KEY`: The secret key for the RustFS S3-compatible API.
- `MINIO_BUCKET`: The name of the default bucket created for Alexandrie. Note that this bucket name should match the `CDN_ENDPOINT` variable in the backend configuration. By default, it is set to `alexandrie` and the backend will create `alexandrie` and `alexandrie-backups` buckets.

### 6. Email — SMTP (optional)

```env
SMTP_HOST=
SMTP_MAIL=
SMTP_PASSWORD=
```

Used only for password reset emails. Leave empty to disable email features (default).

- `SMTP_HOST`: The SMTP server host.
- `SMTP_MAIL`: The email address used to send emails.
- `SMTP_PASSWORD`: The password for the SMTP email account.

### 7. Frontend — Nuxt

```env
FRONTEND_EXTERNAL_PORT=8200
```

The port exposed on the host for the frontend container.

In production, this is usually only accessed by a reverse proxy.

## Production Deployment Notes

In production, you should:

- NOT expose MySQL or RustFS directly
- Use a reverse proxy (Nginx, Traefik, Caddy)
- Terminate HTTPS at the proxy

## Additional Configuration & Advanced Setup

For advanced configuration options for backend you can create your own `config.toml` file with the same structure as the default one (in `backend/config.toml`) and add the following environment variable to your `.env` file:

```env
CONFIG_PATH=./config.toml # Path to your custom config.toml file
```

This allows you to customize advanced settings not covered by environment variables (such as default values, logging levels, supported files etc).

## FAQ — Common Issues & Troubleshooting

### I am instantly logged out after logging in (login loop)

**Symptoms**

- Login succeeds (no error message).
- You are redirected correctly.
- You are immediately logged out or returned to the login page.
- Refreshing the page shows you as unauthenticated.

**Cause**

This is usually caused by a misconfiguration of the `COOKIE_DOMAIN` environment variable in the backend service.

**Common mistakes**

- Including protocol (http:// or https://) in `COOKIE_DOMAIN`.
- Setting `COOKIE_DOMAIN` to a subdomain that does not match both frontend and backend domains.
- Setting `COOKIE_DOMAIN` to a domain that does not match the actual domain used to access the services.

**Correct configuration examples**

- If your frontend is at `frontend.yourdomain.com` and your backend API is at `api.yourdomain.com`, then set `COOKIE_DOMAIN=yourdomain.com`.
- If your frontend is at `frontend.subdomain.yourdomain.com` and your backend API is at `api.subdomain.yourdomain.com`, then set `COOKIE_DOMAIN=subdomain.yourdomain.com`.
- If your frontend is at `yourdomain.com` and your backend API is at `api.yourdomain.com`, then set `COOKIE_DOMAIN=yourdomain.com`.

### Files are uploaded but cannot be accessed

**Symptoms**

- File uploads succeed without errors.
- You show files as uploaded in the frontend (for example on the cdn page, in the datatable or in cards)
- When trying to access the files, you get 404 errors or broken links.

**Cause**
This is usually caused by a misconfiguration of the `CDN_URL` and/or `CDN_ENDPOINT` environment variables in the backend service.

**Common mistakes**

- `CDN_URL` not matching the actual URL used to access to your S3 server storage (for example when using a reverse proxy with a different domain or path)
- `CDN_ENDPOINT` not matching the bucket name or the path used in the reverse proxy.

**Correct configuration examples**

- If your RustFS S3 server is accessible at `http://cdn.yourdomain.com`, then set:
  - `CDN_URL=http://cdn.yourdomain.com`
  - `CDN_ENDPOINT=/alexandrie/` (/alexandrie/ is the default bucket name, change it only if you changed the bucket name or if your reverse proxy uses a different path)
- If your RustFS S3 server is accessible at `http://yourdomain.com/files/`, then set:
  - `CDN_URL=http://yourdomain.com`
  - `CDN_ENDPOINT=/files/` (change /files/ to match the path used in your reverse proxy or the bucket name)

Test the right url in your browser by combining `CDN_URL`, `CDN_ENDPOINT` and the object path (you can get the object path from the frontend interface, for example in the cdn page with devtools or by copying the link).

## I have errors with backup system or minio client

**Symptoms**

- Backup creation fails with errors related to link generation with S3 or MinIO (example: Failed to generate download URL: XML syntax error on line 1: attribute name without = in element)

**Cause**
This is usually caused if you have an incorrect value for endpoint of public signer with minio client in the backend service.

**Correct configuration examples**

- If your RustFS S3 server is accessible at `http://cdn.yourdomain.com`, then set: `CDN_URL=http://cdn.yourdomain.com`

Note: According to S3 specification, the URL used to sign must not contain path or query parameters. So make sure your `CDN_URL` variable does not contain path or query parameters.  
Example of **incorrect** value: `http://yourdomain.com/files/` (contains path)  
Example of **correct** value: `http://cdn.yourdomain.com` (no path or query parameters)

## Additional Resources

- [Official Alexandrie GitHub Repository](https://github.com/Smaug6739/alexandrie)
- [Discord Community](https://discord.gg/UPsEg6egPj)
