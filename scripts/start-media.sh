#!/bin/sh
set -e

MODE=${1:-development}

echo "📸 Media Service - Starting..."

# Wait for dependencies
echo "⏳ Waiting for dependencies..."
until nc -z ${DB_HOST:-r8_postgres} ${DB_PORT:-5432}; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

until nc -z ${REDIS_HOST:-r8_redis} ${REDIS_PORT:-6379}; do
  echo "Redis is unavailable - sleeping"
  sleep 2
done
echo "✅ Dependencies are up!"

# Ensure uploads directory exists
mkdir -p /app/uploads
chmod 755 /app/uploads

if [ "$MODE" = "development" ]; then
  echo "🚀 Starting Media service in development mode..."
  yarn start:media:dev
else
  echo "🚀 Starting Media service in production mode..."
  yarn start:media
fi