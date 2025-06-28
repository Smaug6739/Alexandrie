.PHONY: backend frontend minio migrate all


backend:
	cd backend && go run main.go

frontend:
	cd frontend && bun dev
frontendh:
	cd frontend && bun dev --host

minio:
	minio server ./minio --console-address :9001 --address "localhost:9000"

migrate:
	migrate create -ext sql -dir backend/migrations/ -seq $(name)

