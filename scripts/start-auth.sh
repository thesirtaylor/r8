#!/bin/sh
set -e

MODE=${1:-development}

echo "🔐 Auth Service - Starting..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
until nc -z ${DB_HOST:-r8_postgres} ${DB_PORT:-5432}; do
  echo "Database is unavailable - sleeping"
  sleep 2
done
echo "✅ Database is up!"

# Run migrations
echo "🧭 Running database migrations..."
yarn typeorm:run || echo "⚠️  Migrations failed or already applied"

if [ "$MODE" = "development" ]; then
  echo "🚀 Starting Auth service in development mode..."
  yarn start:auth:dev
else
  echo "🚀 Starting Auth service in production mode..."
  yarn start:auth
fi