.PHONY: backend frontend minio migrate all


backend:
	cd backend && go run main.go

frontend:
	cd frontend && bunx --bun nuxt dev 
frontendh:
	cd frontend && bunx --bun nuxt dev --host

minio:
	minio server ./minio --console-address :9001 --address "localhost:9000"

minioh:
	minio server ./minio --address 0.0.0.0:9000 --console-address 0.0.0.0:9001

migrate:
	migrate create -ext sql -dir backend/migrations/ -seq $(name)

