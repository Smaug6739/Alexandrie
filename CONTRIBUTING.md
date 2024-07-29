# Contributing

## How to set up the project

### Prerequisites

- [Bun](https://bun.sh/)
- [Golang](https://go.dev/)
- [MySQL](https://www.mysql.com/)

### Clone the database

The SQL model is in the `database` folder. You can import it to your MySQL database.

It's not necessary to fill the `City_IPv4_complete`, `City_IPv6_complete`, `City_Locations_fr` tables. They are used for the geolocation feature.

### Steps

1. Clone the repository.
2. Go to /backend and run `bun install`, change `.env.example` to `.env` and then start with `bun main.ts`.
3. Go to /cdn and start with `go run main.go`.
4. Go to /frontend and run `bun install`, and then start with `bun dev`.

### How to contribute

Don't hesitate to contribute to the project. You can open an issue or a pull request :)
