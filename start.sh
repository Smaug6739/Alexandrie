#!/bin/bash
set -e

echo "Starting Alexandrie self-hosting setup..."

# Set default environment variables if not provided
export DATABASE_HOST=${DATABASE_HOST:-localhost}
export DATABASE_PORT=${DATABASE_PORT:-3306}
export DATABASE_NAME=${DATABASE_NAME:-alexandrie}
export DATABASE_USER=${DATABASE_USER:-alexandrie}
export DATABASE_PASSWORD=${DATABASE_PASSWORD:-password}
export JWT_SECRET=${JWT_SECRET:-your-jwt-secret-key}
export MINIO_ENDPOINT=${MINIO_ENDPOINT:-localhost:9000}
export MINIO_ACCESSKEY=${MINIO_ACCESSKEY:-minioadmin}
export MINIO_SECRETKEY=${MINIO_SECRETKEY:-minioadmin}
export MINIO_BUCKET=${MINIO_BUCKET:-alexandrie}
export DOMAIN_CLIENT=${DOMAIN_CLIENT:-http://localhost:8200}
export COOKIE_DOMAIN=${COOKIE_DOMAIN:-localhost}
export SMTP_HOST=${SMTP_HOST:-}
export SMTP_MAIL=${SMTP_MAIL:-}
export SMTP_PASSWORD=${SMTP_PASSWORD:-}
export BACKEND_PORT=${BACKEND_PORT:-8201}
export FRONTEND_PORT=${FRONTEND_PORT:-8200}

# Function to wait for service
wait_for_service() {
    local host=$1
    local port=$2
    local service_name=$3
    echo "Waiting for $service_name to be ready..."
    while ! nc -z $host $port; do
        echo "Waiting for $service_name at $host:$port..."
        sleep 2
    done
    echo "$service_name is ready!"
}

# Function to check if MySQL is external or needs to be started
setup_database() {
    if [ "$DATABASE_HOST" != "localhost" ] && [ "$DATABASE_HOST" != "127.0.0.1" ]; then
        echo "Using external MySQL database at $DATABASE_HOST:$DATABASE_PORT"
        wait_for_service $DATABASE_HOST $DATABASE_PORT "MySQL"
    else
        echo "Starting local MySQL would require additional setup - please use external MySQL"
        echo "Set DATABASE_HOST to your MySQL server address"
        exit 1
    fi
}

# Function to setup MinIO
setup_minio() {
    if [ "$MINIO_ENDPOINT" = "localhost:9000" ]; then
        echo "Starting local MinIO server..."
        export MINIO_ROOT_USER=$MINIO_ACCESSKEY
        export MINIO_ROOT_PASSWORD=$MINIO_SECRETKEY
        minio server /app/data/minio --console-address ":9001" --address ":9000" &
        MINIO_PID=$!
        wait_for_service localhost 9000 "MinIO"
        echo "MinIO started with PID $MINIO_PID"
    else
        echo "Using external MinIO at $MINIO_ENDPOINT"
        MINIO_HOST=$(echo $MINIO_ENDPOINT | cut -d':' -f1)
        MINIO_PORT=$(echo $MINIO_ENDPOINT | cut -d':' -f2)
        wait_for_service $MINIO_HOST $MINIO_PORT "MinIO"
    fi
}

# Function to run database migrations
run_migrations() {
    echo "Running database migrations..."
    cd /app/backend
    migrate -path ./migrations -database "mysql://$DATABASE_USER:$DATABASE_PASSWORD@tcp($DATABASE_HOST:$DATABASE_PORT)/$DATABASE_NAME" up
    cd /app
}

# Function to start backend
start_backend() {
    echo "Starting backend server..."
    cd /app/backend
    export PORT=$BACKEND_PORT
    export CPWD=/app/backend/
    export CONFIG_CPWD=""
    export GIN_MODE=release
    ./backend_app &
    BACKEND_PID=$!
    wait_for_service localhost $BACKEND_PORT "Backend"
    echo "Backend started with PID $BACKEND_PID"
    cd /app
}

# Function to start frontend
start_frontend() {
    echo "Starting frontend server..."
    cd /app/frontend
    export NODE_ENV=production
    export PORT=$FRONTEND_PORT
    bun .output/server/index.mjs &
    FRONTEND_PID=$!
    wait_for_service localhost $FRONTEND_PORT "Frontend"
    echo "Frontend started with PID $FRONTEND_PID"
    cd /app
}

# Cleanup function
cleanup() {
    echo "Shutting down services..."
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$MINIO_PID" ]; then
        kill $MINIO_PID 2>/dev/null || true
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGTERM SIGINT

# Main execution
setup_database
setup_minio
run_migrations
start_backend
start_frontend

echo "✅ Alexandrie is running!"
echo "📝 Frontend: http://localhost:$FRONTEND_PORT"
echo "🔧 Backend API: http://localhost:$BACKEND_PORT"
if [ "$MINIO_ENDPOINT" = "localhost:9000" ]; then
    echo "📦 MinIO Console: http://localhost:9001"
fi
echo ""
echo "To stop all services, press Ctrl+C"

# Keep the script running and wait for signals
wait