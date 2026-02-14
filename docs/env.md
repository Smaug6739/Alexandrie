# Alexandrie — Environment Variables Reference

This document provides a **concise reference of all supported environment variables** in Alexandrie.

Only variables documented here and in `.env.example` are officially supported.

---

## Public URLs & Global Access

| Variable       | Accepted Values            | Description                                                                             |
| -------------- | -------------------------- | --------------------------------------------------------------------------------------- |
| `FRONTEND_URL` | URL                        | Public URL of the frontend application (used by clients/browsers).                      |
| `API_URL`      | URL                        | Public URL of the backend API.                                                          |
| `CDN_URL`      | URL (no path/query)        | Public base URL of the S3-compatible storage (RustFS / CDN).                            |
| `CDN_ENDPOINT` | Path (e.g. `/alexandrie/`) | Path prefix used to expose objects. Combined as `<CDN_URL><CDN_ENDPOINT><object-path>`. |

---

## Application Feature Flags

| Variable                 | Accepted Values  | Default | Description                                             |
| ------------------------ | ---------------- | ------- | ------------------------------------------------------- |
| `CONFIG_DISABLE_LANDING` | `true` / `false` | `false` | Disables the landing page and redirects users to login. |
| `CONFIG_DISABLE_SIGNUP`  | `true` / `false` | `false` | Disables new user registrations (frontend + backend).   |

---

## Backend API — Runtime & Security

| Variable                | Accepted Values      | Description                                                                                                 |
| ----------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------- |
| `BACKEND_EXTERNAL_PORT` | Port number          | Port exposed on the host for the backend API.                                                               |
| `COOKIE_DOMAIN`         | Domain (no protocol) | Domain scope for authentication cookies. Must match the highest common domain between frontend and backend. |
| `ALLOW_UNSECURE`        | `true` / `false`     | Allows HTTP connections (recommended `false` in production).                                                |
| `JWT_SECRET`            | String               | Secret key used to sign JWT tokens. Changing it invalidates all sessions.                                   |

---

## Database — MySQL

| Variable              | Accepted Values | Description                         |
| --------------------- | --------------- | ----------------------------------- |
| `MYSQL_EXTERNAL_PORT` | Port number     | Port exposed on the host for MySQL. |
| `MYSQL_DATABASE`      | String          | Name of the default database.       |
| `MYSQL_USER`          | String          | Database user for Alexandrie.       |
| `MYSQL_PASSWORD`      | String          | Password for the database user.     |
| `MYSQL_ROOT_PASSWORD` | String          | MySQL root password.                |

---

## Object Storage — RustFS / S3

### RustFS Service Configuration

| Variable               | Accepted Values | Description                                                                        |
| ---------------------- | --------------- | ---------------------------------------------------------------------------------- |
| `RUSTFS_EXTERNAL_PORT` | Port number     | Port exposed on the host for RustFS.                                               |
| `RUSTFS_ACCESS_KEY`    | String          | Access key for the S3-compatible API.                                              |
| `RUSTFS_SECRET_KEY`    | String          | Secret key for the S3-compatible API.                                              |
| `MINIO_BUCKET`         | String          | Main bucket name. Backend automatically creates `<bucket>` and `<bucket>-backups`. |

---

### S3 / MinIO — TLS & HTTPS

| Variable             | Accepted Values  | Default | Description                                                                                                    |
| -------------------- | ---------------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `MINIO_SECURE`       | `true` / `false` | `true`  | Enables HTTPS (TLS) when connecting to the S3 endpoint. Must match how the server is exposed.                  |
| `MINIO_CA_PATH`      | File path        | —       | Path to a custom CA certificate (PEM) for internal or private PKI. Must be mounted into the backend container. |
| `MINIO_INSECURE_TLS` | `true` / `false` | `false` | Disables TLS certificate verification while keeping HTTPS enabled (not recommended for production).            |

---

## Email — SMTP (optional)

| Variable        | Accepted Values | Description                    |
| --------------- | --------------- | ------------------------------ |
| `SMTP_HOST`     | Hostname        | SMTP server host.              |
| `SMTP_MAIL`     | Email address   | Sender email address.          |
| `SMTP_PASSWORD` | String          | Password for the SMTP account. |

---

## Frontend — Nuxt

| Variable                 | Accepted Values | Description                                          |
| ------------------------ | --------------- | ---------------------------------------------------- |
| `FRONTEND_EXTERNAL_PORT` | Port number     | Port exposed on the host for the frontend container. |

---

## Advanced Backend Configuration

| Variable      | Accepted Values | Description                                                      |
| ------------- | --------------- | ---------------------------------------------------------------- |
| `CONFIG_PATH` | File path       | Path to a custom `config.toml` file overriding backend defaults. |

---

## OIDC Integration

Up to **10 OpenID Connect providers** can be configured.

| Variable                 | Accepted Values | Description                                                         |
| ------------------------ | --------------- | ------------------------------------------------------------------- |
| `OIDC_{i}_CONFIG_URL`    | URL             | OpenID configuration endpoint (`.well-known/openid-configuration`). |
| `OIDC_{i}_CLIENT_ID`     | String          | Client ID issued by the provider.                                   |
| `OIDC_{i}_CLIENT_SECRET` | String          | Client secret issued by the provider.                               |
| `OIDC_{i}_PROVIDER_NAME` | String          | Display name of the provider (e.g. Google, GitHub, Microsoft).      |

Replace `{i}` with a number between **1 and 10**.

---

## Notes

- Variables related to TLS trust **must be configured inside the backend container**, not only on the host.
- `MINIO_INSECURE_TLS` should only be used for temporary debugging.
- `MINIO_SECURE=false` is required for local RustFS deployments without TLS (e.g. `localhost`).
