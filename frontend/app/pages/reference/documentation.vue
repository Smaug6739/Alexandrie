<template>
  <div class="body-container">
    <article class="markdown-preview modern-theme document-content" style="font-size: 16px; font-family: Poppins; line-height: 1.5">
      <h1 id="alexandrie-setup-guide">Alexandrie Setup Guide</h1>
      <p>This guide explains how to set up, configure, and deploy the Alexandrie stack.</p>
      <p>
        It covers both <strong>local development</strong> and <strong>production deployment</strong>, including how to configure environment variables, connect
        the different services, and handle HTTPS with a reverse proxy.
      </p>
      <hr />
      <h2 id="overview-of-the-stack">Overview of the Stack</h2>
      <p>The Alexandrie stack consists of four main services, defined in the <code>docker-compose.yml</code> file:</p>
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>MySQL</strong></td>
            <td>Relational database used to store user data and metadata.</td>
          </tr>
          <tr>
            <td><strong>RustFS</strong></td>
            <td>S3-compatible object storage used for file and media storage.</td>
          </tr>
          <tr>
            <td><strong>Backend</strong></td>
            <td>The Go-based API server providing authentication, storage, and access control.</td>
          </tr>
          <tr>
            <td><strong>Frontend</strong></td>
            <td>A Nuxt 4 web app that communicates with the backend via REST API.</td>
          </tr>
        </tbody>
      </table>
      <p>All services are connected through a dedicated Docker network (<code>alexandrie-network</code>).</p>
      <hr />
      <h2 id="quick-start">Quick Start</h2>
      <p>For local testing, you can run Alexandrie directly using the provided <code>docker-compose.yml</code>:</p>
      <p>
        Download the <code>docker-compose.yml</code> file from the repository:
        <a href="https://github.com/Smaug6739/Alexandrie/blob/main/docker-compose.yml">https://github.com/Smaug6739/Alexandrie/blob/main/docker-compose.yml</a>
        and run:
      </p>

      <div class="code-block-wrapper">
        <button class="code-copy-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px">
            <path
              d="M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h80v-80q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240h-80v80q0 33-23.5 56.5T640-80H160Zm160-240h480v-480H320v480Z"
            ></path>
          </svg>
        </button>
        <pre><code class="hljs language-bash">docker compose up
</code></pre>
      </div>
      <p>Once the containers are running:</p>
      <ul>
        <li>Frontend → <a href="http://localhost:8200">http://localhost:8200</a></li>
        <li>Backend API → <a href="http://localhost:8201">http://localhost:8201</a></li>
        <li>Object Storage (RustFS) → <a href="http://localhost:9000">http://localhost:9000</a></li>
      </ul>
      <p><em>Note: No default account is created. You can register a new user directly from the frontend.</em></p>
      <h2 id="configuration-(environment-variables)">Configuration (Environment Variables)</h2>
      <p>
        To customize the setup (ports, domains, security, feature flags, production deployment), you can create a <code>.env</code> file next to
        <code>docker-compose.yml</code>.
      </p>
      <p>
        The <code>.env</code> file template can be found here:
        <a href="https://github.com/Smaug6739/Alexandrie/blob/main/.env.example">https://github.com/Smaug6739/Alexandrie/blob/main/.env.example</a>
      </p>
      <p>Only the variables defined in <code>.env.example</code> are officially supported.</p>
      <h3 id="1.-public-urls-%26-global-access">1. Public URLs &amp; Global Access</h3>

      <div class="code-block-wrapper">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px">
            <path
              d="M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h80v-80q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240h-80v80q0 33-23.5 56.5T640-80H160Zm160-240h480v-480H320v480Z"
            ></path>
          </svg>
        </button>
        <pre><code class="hljs language-env">FRONTEND_URL=http://localhost:8200
API_URL=http://localhost:8201
CDN_URL=http://localhost:9005

CDN_ENDPOINT=/alexandrie/
</code></pre>
      </div>
      <p>These variables define how clients (browsers) reach your services.</p>
      <ul>
        <li><code>FRONTEND_URL</code>: The public URL for the frontend service.</li>
        <li><code>API_URL</code>: The public URL for the backend API service.</li>
        <li><code>CDN_URL</code>: The public URL for the object storage service (RustFS).</li>
        <li>
          <code>CDN_ENDPOINT</code>: The path prefix under which files are exposed. You probably want to keep this as /alexandrie/ to match the bucket name,
          change it only if you changed the bucket name or if you have configured a reverse proxy path.<br />
          Final URL are constructed as: <code>&lt;CDN_URL&gt;&lt;CDN_ENDPOINT&gt;&lt;object-path&gt;</code><br />
          If you have a problem with files URL just open devtools in your browser and check the actual URL used to load files and then adjust these variables
          accordingly.
        </li>
      </ul>
      <h3 id="2.-application-feature-flags">2. Application Feature Flags</h3>

      <div class="code-block-wrapper">
        <button class="code-copy-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px">
            <path
              d="M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h80v-80q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240h-80v80q0 33-23.5 56.5T640-80H160Zm160-240h480v-480H320v480Z"
            ></path>
          </svg>
        </button>
        <pre><code class="hljs language-env">CONFIG_DISABLE_LANDING=false
CONFIG_DISABLE_SIGNUP=false
CONFIG_DISABLE_NATIVE_LOGIN=false
</code></pre>
      </div>
      <p>These variables control specific features of the application (useful for private deployments, internal tools etc.).</p>
      <ul>
        <li>
          <code>CONFIG_DISABLE_LANDING</code>: If set to <code>true</code>, the landing page is disabled, and users are redirected to the login page. The
          default is <code>false</code>.
        </li>
        <li>
          <code>CONFIG_DISABLE_SIGNUP</code>: If set to <code>true</code>, new user registrations are disabled (in frontend + backend for security). The default
          is <code>false</code>.
        </li>
        <li>
          <code>CONFIG_DISABLE_NATIVE_LOGIN</code>: If set to <code>true</code>, the native username/password login method is disabled. This is useful if you
          want to enforce OIDC or other external authentication methods. The default is <code>false</code>.
        </li>
      </ul>
      <h3 id="3.-backend-api-%E2%80%94-runtime-%26-security">3. Backend API — Runtime &amp; Security</h3>

      <div class="code-block-wrapper">
        <button class="code-copy-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px">
            <path
              d="M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h80v-80q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240h-80v80q0 33-23.5 56.5T640-80H160Zm160-240h480v-480H320v480Z"
            ></path>
          </svg>
        </button>
        <pre><code class="hljs language-env">BACKEND_EXTERNAL_PORT=8201
COOKIE_DOMAIN=localhost:8200
ALLOW_UNSECURE=true
JWT_SECRET=your-secure-jwt-secret-key-change-this-in-production
</code></pre>
      </div>
      <p>These variables configure the backend API service.</p>
      <ul>
        <li><code>BACKEND_EXTERNAL_PORT</code>: The port exposed on your host machine for the Backend API service.</li>
        <li>
          <code>COOKIE_DOMAIN</code> (IMPORTANT): This variable defines where authentication cookies are valid.<br />
          It should match with the common domain used by both frontend and backend services.<br />
          Example: If your frontend is at <code>frontend.yourdomain.com</code> and your backend API is at <code>api.yourdomain.com</code>, then set
          <code>COOKIE_DOMAIN=yourdomain.com</code>.<br />
          <strong>Rules:</strong>
          <ul>
            <li>Must match with the highest common domain between the frontend and the backend. See #286 for more details.</li>
            <li>Must NOT include protocol (http:// or https://)</li>
            <li>If misconfigured, login will appear to work but users will be instantly logged out</li>
          </ul>
        </li>
        <li>
          <code>ALLOW_UNSECURE</code>: If set to <code>true</code>, HTTP connections are allowed (useful for local and dev). In production, it is recommended to
          set this to <code>false</code> to enforce HTTPS.
        </li>
        <li>
          <code>JWT_SECRET</code>: Secret key used to sign JWT tokens. You should change this to a random long string correcly generated (with openssl or
          similar) in production for security. Changing this value will invalidate all existing sessions.
        </li>
      </ul>
      <h3 id="4.-database-%E2%80%94-mysql">4. Database — MySQL</h3>

      <div class="code-block-wrapper">
        <button class="code-copy-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px">
            <path
              d="M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h80v-80q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240h-80v80q0 33-23.5 56.5T640-80H160Zm160-240h480v-480H320v480Z"
            ></path>
          </svg>
        </button>
        <pre><code class="hljs language-env">MYSQL_EXTERNAL_PORT=3307
MYSQL_DATABASE=alexandrie
MYSQL_USER=alexandrie
MYSQL_PASSWORD=password
MYSQL_ROOT_PASSWORD=rootpassword
</code></pre>
      </div>
      <p>These variables configure the MySQL database service.</p>
      <ul>
        <li><code>MYSQL_EXTERNAL_PORT</code>: The port exposed on your host machine for the MySQL service.</li>
        <li><code>MYSQL_DATABASE</code>: The name of the default database created for Alexandrie.</li>
        <li><code>MYSQL_USER</code>: The username for the default Alexandrie database user.</li>
        <li><code>MYSQL_PASSWORD</code>: The password for the default Alexandrie database user.</li>
        <li><code>MYSQL_ROOT_PASSWORD</code>: The password for the MySQL root user.</li>
      </ul>
      <h3 id="5.-object-storage-%E2%80%94-s3-(rustfs-%2F-minio-compatible)-(optional%2C-leave-empty-to-disable)">
        <a class="header-anchor" href="#5.-object-storage-%E2%80%94-s3-(rustfs-%2F-minio-compatible)-(optional%2C-leave-empty-to-disable)" aria-hidden="true"
          >#</a
        >
        5. Object Storage — S3 (RustFS / MinIO-compatible) (optional, leave empty to disable)
      </h3>

      <div class="code-block-wrapper">
        <button class="code-copy-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px">
            <path
              d="M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h80v-80q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240h-80v80q0 33-23.5 56.5T640-80H160Zm160-240h480v-480H320v480Z"
            ></path>
          </svg>
        </button>
        <pre><code class="hljs language-env">RUSTFS_EXTERNAL_PORT=9005

RUSTFS_ACCESS_KEY=alexandrie-key
RUSTFS_SECRET_KEY=alexandrie-secret

MINIO_BUCKET=alexandrie
</code></pre>
      </div>
      <p>These variables configure the RustFS object storage service.</p>
      <ul>
        <li><code>RUSTFS_EXTERNAL_PORT</code>: The port exposed on your host machine for the RustFS service.</li>
        <li><code>RUSTFS_ACCESS_KEY</code>: The access key for the RustFS S3-compatible API.</li>
        <li><code>RUSTFS_SECRET_KEY</code>: The secret key for the RustFS S3-compatible API.</li>
        <li>
          <code>MINIO_BUCKET</code>: The name of the default bucket created for Alexandrie. Note that this bucket name should match the
          <code>CDN_ENDPOINT</code> variable in the backend configuration. By default, it is set to <code>alexandrie</code> and the backend will create
          <code>alexandrie</code> and <code>alexandrie-backups</code> buckets.
        </li>
      </ul>
      <h3 id="6.-email-%E2%80%94-smtp-(optional)">6. Email — SMTP (optional)</h3>

      <div class="code-block-wrapper">
        <button class="code-copy-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px">
            <path
              d="M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h80v-80q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240h-80v80q0 33-23.5 56.5T640-80H160Zm160-240h480v-480H320v480Z"
            ></path>
          </svg>
        </button>
        <pre><code class="hljs language-env">SMTP_HOST=
SMTP_MAIL=
SMTP_PASSWORD=
</code></pre>
      </div>
      <p>Used only for password reset emails. Leave empty to disable email features (default).</p>
      <ul>
        <li><code>SMTP_HOST</code>: The SMTP server host.</li>
        <li><code>SMTP_MAIL</code>: The email address used to send emails.</li>
        <li><code>SMTP_PASSWORD</code>: The password for the SMTP email account.</li>
      </ul>
      <h3 id="7.-frontend-%E2%80%94-nuxt">7. Frontend — Nuxt</h3>

      <div class="code-block-wrapper">
        <button class="code-copy-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px">
            <path
              d="M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h80v-80q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240h-80v80q0 33-23.5 56.5T640-80H160Zm160-240h480v-480H320v480Z"
            ></path>
          </svg>
        </button>
        <pre><code class="hljs language-env">FRONTEND_EXTERNAL_PORT=8200
</code></pre>
      </div>
      <p>The port exposed on the host for the frontend container.</p>
      <p>In production, this is usually only accessed by a reverse proxy.</p>
      <h2 id="production-deployment-notes">Production Deployment Notes</h2>
      <p>In production, you should:</p>
      <ul>
        <li>NOT expose MySQL or RustFS directly</li>
        <li>Use a reverse proxy (Nginx, Traefik, Caddy)</li>
        <li>Terminate HTTPS at the proxy</li>
      </ul>
      <h2 id="additional-configuration-%26-advanced-setup">Additional Configuration &amp; Advanced Setup</h2>
      <h3 id="custom-configuations---config.toml">Custom configuations - config.toml</h3>
      <p>
        For advanced configuration options for backend you can create your own <code>config.toml</code> file with the same structure as the default one (in
        <code>backend/config.toml</code>) and add the following environment variable to your <code>.env</code> file:
      </p>

      <div class="code-block-wrapper">
        <button class="code-copy-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px">
            <path
              d="M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h80v-80q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240h-80v80q0 33-23.5 56.5T640-80H160Zm160-240h480v-480H320v480Z"
            ></path>
          </svg>
        </button>
        <pre><code class="hljs language-env">CONFIG_PATH=./config.toml # Path to your custom config.toml file
</code></pre>
      </div>
      <p>This allows you to customize advanced settings not covered by environment variables (such as default values, logging levels, supported files etc).</p>
      <h3 id="oidc-integration">OIDC Integration</h3>
      <p>Open ID Connect (OIDC) is supported since version 8.5.0. You can setup up to 10 providers using environment variables to the backend.</p>
      <p>First you have to generate client ID and client secret from your provider (refer to their doc or ask questions in discussions / discord)</p>
      <p>
        Then you have to configure the redirect URI (in the provider interface with this value):
        <code>https://your-alexandrie-frontend/login/oidc/callback</code>
      </p>
      <p>To config a provider you have to fill 4 variables:</p>

      <div class="code-block-wrapper">
        <button class="code-copy-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px">
            <path
              d="M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h80v-80q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240h-80v80q0 33-23.5 56.5T640-80H160Zm160-240h480v-480H320v480Z"
            ></path>
          </svg>
        </button>
        <pre><code class="hljs language-env">OIDC_{i}_CONFIG_URL=https://yourdomain.com/.well-known/openid-configuration
OIDC_{i}_CLIENT_ID=
OIDC_{i}_CLIENT_SECRET=
OIDC_{i}_PROVIDER_NAME= # e.g. Google, Discord, Microsoft...
</code></pre>
      </div>
      <p>
        <em>Replace <code>{i}</code> with a number between 1 to 10</em>
      </p>
      <p>
        To setup these variables to your configuration you have to edit the <code>docker-compose.yml</code> and add variables to the backend config (direct
        values or a reference to your env file) like this for example:
      </p>

      <div class="code-block-wrapper">
        <button class="code-copy-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px">
            <path
              d="M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h80v-80q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240h-80v80q0 33-23.5 56.5T640-80H160Zm160-240h480v-480H320v480Z"
            ></path>
          </svg>
        </button>
        <pre><code class="hljs language-yml"><span class="hljs-attr">OIDC_1_CONFIG_URL:</span> <span class="hljs-string">${OIDC_1_CONFIG_URL}</span>
<span class="hljs-attr">OIDC_1_CLIENT_ID:</span> <span class="hljs-string">${OIDC_1_CLIENT_ID}</span>
<span class="hljs-attr">OIDC_1_CLIENT_SECRET:</span> <span class="hljs-string">${OIDC_1_CLIENT_SECRET}</span>
<span class="hljs-attr">OIDC_1_PROVIDER_NAME:</span> <span class="hljs-string">${OIDC_1_PROVIDER_NAME}</span>
</code></pre>
      </div>
      <h3 id="s3-%2F-minio-%E2%80%94-tls%2C-https-and-custom-certificate-authorities">S3 / Minio — TLS, HTTPS and Custom Certificate Authorities</h3>
      <p>
        Alexandrie connects to the S3-compatible storage (RustFS / MinIO...) using an internal backend client. This client supports HTTPS, custom certificate
        authorities (CA), and explicit TLS configuration.
      </p>
      <p>This section explains how TLS is handled and how to configure it correctly.</p>
      <h4 id="https-vs-http-(minio_secure)">HTTPS vs HTTP (MINIO_SECURE)</h4>

      <div class="code-block-wrapper">
        <button class="code-copy-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px">
            <path
              d="M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h80v-80q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240h-80v80q0 33-23.5 56.5T640-80H160Zm160-240h480v-480H320v480Z"
            ></path>
          </svg>
        </button>
        <pre><code class="hljs language-env">MINIO_SECURE=true|false
</code></pre>
      </div>
      <p>
        This variable controls whether HTTPS (TLS) is used at all when the backend connects to the S3 endpoint. It must explicitly match how your S3 server is
        exposed.
      </p>
      <ul>
        <li><code>true</code> → HTTPS is used (default)</li>
        <li><code>false</code> → HTTP is used (no TLS)</li>
      </ul>
      <h4 id="custom-certificate-authorities-(minio_ca_path)">Custom Certificate Authorities (MINIO_CA_PATH)</h4>
      <p>If your S3 endpoint uses a certificate signed by an internal or private certificate authority, you must explicitly provide this CA to the backend.</p>

      <div class="code-block-wrapper">
        <button class="code-copy-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px">
            <path
              d="M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h80v-80q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240h-80v80q0 33-23.5 56.5T640-80H160Zm160-240h480v-480H320v480Z"
            ></path>
          </svg>
        </button>
        <pre><code class="hljs language-env">MINIO_CA_PATH=/path/to/ca-certificate.pem
</code></pre>
      </div>
      <ul>
        <li>The file must contain the CA certificate (root or intermediate), in PEM format</li>
        <li>This CA will be added to the system trust store used by the S3 client</li>
        <li>This is the recommended and secure way to handle internal PKI</li>
      </ul>
      <p>
        <em
          >Note: if you are using docker containers, you must mount this file into the backend container using a volume in <code>docker-compose.yml</code>.</em
        >
      </p>
      <p><em>TLS Verification Bypass (Not Recommended)</em></p>

      <div class="code-block-wrapper">
        <button class="code-copy-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px">
            <path
              d="M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h80v-80q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240h-80v80q0 33-23.5 56.5T640-80H160Zm160-240h480v-480H320v480Z"
            ></path>
          </svg>
        </button>
        <pre><code class="hljs language-env">MINIO_INSECURE_TLS=true|false
</code></pre>
      </div>
      <p>This option disables TLS certificate verification while still using HTTPS.</p>
      <ul>
        <li>The connection remains encrypted</li>
        <li>Certificate validation (CA + hostname) is skipped</li>
      </ul>
      <div class="yellow custom-block">
        <p class="custom-block-title">Security warning</p>
        <div class="custom-block-content">
          <p>This option should only be used for:</p>
          <ul>
            <li>temporary debugging</li>
            <li>local testing environments</li>
            <li>It is not recommended for production use.</li>
          </ul>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'public',
});
</script>

<style lang="scss" scoped>
.body-container {
  display: flex;
  width: 100%;
  max-width: 1000px;
  margin: 2rem auto;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
</style>
