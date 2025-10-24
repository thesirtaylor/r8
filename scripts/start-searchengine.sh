#!/bin/sh
set -e

MODE=${1:-development}

echo "🔍 SearchEngine Service - Starting..."

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

# Wait for Elasticsearch with more patience
echo "⏳ Waiting for Elasticsearch..."
ELASTICSEARCH_HOST=$(echo ${ELASTICSEARCH_NODE:-http://r8_elasticsearch:9200} | sed 's|http://||' | cut -d: -f1)
ELASTICSEARCH_PORT=$(echo ${ELASTICSEARCH_NODE:-http://r8_elasticsearch:9200} | cut -d: -f3)
ELASTICSEARCH_PORT=${ELASTICSEARCH_PORT:-9200}

until nc -z ${ELASTICSEARCH_HOST} ${ELASTICSEARCH_PORT}; do
  echo "Elasticsearch is unavailable - sleeping"
  sleep 3
done

# Additional wait for Elasticsearch to be fully ready
sleep 5
echo "✅ Dependencies are up!"

if [ "$MODE" = "development" ]; then
  echo "🚀 Starting SearchEngine service in development mode..."
  yarn start:searchengine:dev
else
  echo "🚀 Starting SearchEngine service in production mode..."
  yarn start:searchengine
fi