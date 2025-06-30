# Contributing

## How to set up the project

### Prerequisites

- [Bun](https://bun.sh/)
- [Golang](https://go.dev/)
- [MySQL](https://www.mysql.com/)

### Steps

1. Clone the repository.
1. Update the .env file in the /backend and /frontend directories with your credentials & configurations.
1. Go to /backend and run `go mod download` to install the dependencies and then start with `go run main.go`.
1. Start minio server with `minio server ./minio --console-address :9001 --address "localhost:9000"`
1. Go to /frontend and run `bun install`, and then start with `bun dev`.

### How to contribute

Don't hesitate to contribute to the project. You can open an issue or a pull request :)
