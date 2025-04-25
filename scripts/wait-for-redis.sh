#!/bin/sh

echo "Waiting for Redis..."

until redis-cli -h redis ping > /dev/null 2>&1; do
  echo "Redis is not ready yet..."
  sleep 1
done

echo "Redis is ready!"
exec "$@" 