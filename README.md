# Alexandrie – The Ultimate Note-Taking App

<img src="./frontend/public/Logo/Alexandrie-logo-dark.png" width="120" align="left">

<b>A modern and elegant application for taking notes in extended Markdown.</b><br>
Organize, search, and export your notes with an intuitive interface designed for students and productivity.

<p align="center">
  <a href="https://github.com/Smaug6739/Alexandrie/stargazers">
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/Smaug6739/Alexandrie?style=social">
  </a>
  <a href="https://github.com/Smaug6739/Alexandrie/issues">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/Smaug6739/Alexandrie">
  </a>
  <a href="https://github.com/Smaug6739/Alexandrie/blob/main/LICENSE">
    <img alt="GitHub license" src="https://img.shields.io/github/license/Smaug6739/Alexandrie">
  </a>
  <a href="https://github.com/Smaug6739/Alexandrie/pulls">
    <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/Smaug6739/Alexandrie">
  </a>
    <a href="https://github.com/Smaug6739/Alexandrie/releases">
    <img alt="GitHub release" src="https://img.shields.io/github/v/release/Smaug6739/Alexandrie">
  </a>
  <a href="https://discord.gg/UPsEg6egPj">
    <img alt="Discord" src="https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white">
  </a>
</p>

![alexandrie-hub fr_dashboard_docs_218914302160015361](.github/present.png)

## ✨ Features

- **Enhanced Markdown Editor** – Write notes with advanced and unique Markdown features.
- **Instant Search** – Find your notes in seconds.
- **Intuitive Organization** – Easily categorize and archive your notes with a complete sidebar, workspaces, categories, nested documents / categories, tags...
- **Export & Print** – Save your notes as PDF, Markdown, and more.
- **Access Anywhere** – Log in and retrieve your notes from any device. Use the PWA to access your notes offline.
- **Share Notes** – Share your notes with others via unique links or powerful permissions system.

---

## Interface Preview

![Interface 2](./frontend/public/screenshots/mock/2.png)

### Share your notes, collaborate with others, manage permissions.

![Interface 3](./frontend/public/screenshots/mock/3.png)

## Quick Start with Docker

For local testing and development, you can use Docker to run the entire stack:

**Start a demo server (local production, just need to copy the docker-compose file):**

```bash
docker compose up
```

**Start a development server with hot reloading (HMR, and need to clone the repo):**

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

**Access points:**

- **Frontend**: http://localhost:8200
- **Backend API**: http://localhost:8201
- **Object Storage Console**: http://localhost:9001
- **MySQL**: localhost:3307 (user: `alexandrie`, password: `password`)

**To stop:**

```bash
docker compose down
```

_The project support S3 compatible storage. The default in docker-compose is RustFS but you can use MinIO, garage, etc._

If you don't have Docker installed, you can follow the manual setup instructions in the [CONTRIBUTING.md](./CONTRIBUTING.md).

## Contributing

This project has an MIT license. And you are welcome to contribute.
For more details on contributions, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

> Thank you to everyone who contributes to the project. 🎉
