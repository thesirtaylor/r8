#!/bin/sh
set -e

MODE=${1:-development}

echo "🌐 Gateway Service - Starting..."

# Wait for all gRPC services to be available
echo "⏳ Waiting for gRPC services..."

# Extract host and port from AUTH_GRPC (format: host:port)
AUTH_HOST=$(echo ${AUTH_GRPC:-r8_auth:50059} | cut -d: -f1)
AUTH_PORT=$(echo ${AUTH_GRPC:-r8_auth:50059} | cut -d: -f2)

R8_HOST=$(echo ${R8_GRPC:-r8_r8:50050} | cut -d: -f1)
R8_PORT=$(echo ${R8_GRPC:-r8_r8:50050} | cut -d: -f2)

MEDIA_HOST=$(echo ${MEDIA_GRPC:-r8_media:50056} | cut -d: -f1)
MEDIA_PORT=$(echo ${MEDIA_GRPC:-r8_media:50056} | cut -d: -f2)

SEARCH_HOST=$(echo ${SEARCHENGINE_GRPC:-r8_searchengine:50053} | cut -d: -f1)
SEARCH_PORT=$(echo ${SEARCHENGINE_GRPC:-r8_searchengine:50053} | cut -d: -f2)

# Wait for each service
echo "Waiting for Auth service at ${AUTH_HOST}:${AUTH_PORT}..."
until nc -z ${AUTH_HOST} ${AUTH_PORT}; do
  sleep 2
done

echo "Waiting for R8 service at ${R8_HOST}:${R8_PORT}..."
until nc -z ${R8_HOST} ${R8_PORT}; do
  sleep 2
done

echo "Waiting for Media service at ${MEDIA_HOST}:${MEDIA_PORT}..."
until nc -z ${MEDIA_HOST} ${MEDIA_PORT}; do
  sleep 2
done

echo "Waiting for SearchEngine service at ${SEARCH_HOST}:${SEARCH_PORT}..."
until nc -z ${SEARCH_HOST} ${SEARCH_PORT}; do
  sleep 2
done

echo "✅ All gRPC services are up!"

if [ "$MODE" = "development" ]; then
  echo "🚀 Starting Gateway service in development mode..."
  yarn start:gateway:dev
else
  echo "🚀 Starting Gateway service in production mode..."
  yarn start:gateway
fi