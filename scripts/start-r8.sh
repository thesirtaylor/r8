#!/bin/sh
set -e

MODE=${1:-development}

echo "🎯 R8 Service - Starting..."

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

if [ "$MODE" = "development" ]; then
  echo "🚀 Starting R8 service in development mode..."
  yarn start:r8:dev
else
  echo "🚀 Starting R8 service in production mode..."
  yarn start:r8
fi