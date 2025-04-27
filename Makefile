.PHONY: backend frontend minio migrate all


backend:
	cd backend && go run main.go

frontend:
	cd frontend && npm run dev

minio:
	minio server ./minio --console-address :9001 --address "localhost:9000"

migrate:
	migrate create -ext sql -dir backend/migrations/ -seq $(name)

