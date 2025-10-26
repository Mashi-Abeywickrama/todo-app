#!/bin/bash
# wait-for-db.sh

host="$1"
port="$2"
shift 2

echo "Waiting for MySQL at $host:$port..."

for i in {1..30}; do
  if nc -z "$host" "$port" 2>/dev/null; then
    echo "MySQL is up - executing command"
    sleep 3  # Extra wait for MySQL to be fully ready
    exit 0
  fi
  echo "Waiting... ($i/30)"
  sleep 2
done

echo "Timeout waiting for MySQL"
exit 1