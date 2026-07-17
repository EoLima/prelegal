#!/bin/bash

cd "$(dirname "$0")/.."

echo "Building frontend..."
cd frontend && npm run build && cd ..

echo "Starting backend..."
exec node backend/dist/main.js
