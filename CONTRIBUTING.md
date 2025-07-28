# Contributing

## How to set up the project

### Prerequisites

- Install [Bun](https://bun.sh/)
- Install [Golang](https://go.dev/)
- Install [MySQL](https://www.mysql.com/) and create a database with name `alexandrie` (you can change it in config.toml)

### Steps

1. Clone the repository.
1. Update the .env file in the /backend and /frontend directories with your credentials & configurations.
1. Go to /backend and run `go mod download` to install the dependencies and then start with `go run main.go`.
1. Start minio server with `minio server ./minio --console-address :9001 --address "localhost:9000"`
1. Go to /frontend and run `bun install`, and then start with `bun dev`.

If you are on Linux you can use the following commands to start the application:

```bash
make frontend
make minio
make backend
```

### How to contribute

Don't hesitate to contribute to the project. You can open an issue or a pull request :)
