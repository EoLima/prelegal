#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "Starting Prelegal with Docker..."
docker compose up --build -d

echo ""
echo "Prelegal is running at http://localhost:8000"
echo "Run scripts/stop-linux.sh to stop."
