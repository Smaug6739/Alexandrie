# End-to-end (e2e) tests for web

Browser tests written in plain English for [Kane CLI](https://www.testmuai.com/kane-cli/).

| Test | What it covers |
|---|---|
| `signup_test.md` | Signing up, logging in and landing on the dashboard |
| `document_test.md` | Signing up, creating a document, saving it and opening it from the sidebar |

## Run

Start Alexandrie with `docker compose up -d` and these ports in `.env`: `FRONTEND_EXTERNAL_PORT=4820`, `BACKEND_EXTERNAL_PORT=4821`, `RUSTFS_EXTERNAL_PORT=4822`, `FRONTEND_URL=http://localhost:4820`, `API_URL=http://localhost:4821`, `CDN_URL=http://localhost:4822`, `COOKIE_DOMAIN=localhost:4820`.

```bash
npm install -g @testmuai/kane-cli
kane-cli login
kane-cli testmd run e2e/kane/signup_test.md
kane-cli testmd run e2e/kane/document_test.md
```

Each test creates its own user, so reset the database (`docker compose down -v`) before running them again.
