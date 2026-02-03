# FAQ — Common Issues & Troubleshooting

## I am instantly logged out after logging in (login loop)

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

## Files are uploaded but cannot be accessed

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

## HTTPS errors when using MinIO/RustFS with Alexandrie

**Symptoms**

- error like `http: server gave HTTP response to HTTPS client`

**Cause**
This is usually caused by a misconfiguration of the `MINIO_SECURE` environment variable.

**Correct configuration examples**

- If your RustFS S3 server is running with HTTP (not HTTPS), then set: `MINIO_SECURE=false`
- If your RustFS S3 server is running with HTTPS, then set: `MINIO_SECURE=true`
