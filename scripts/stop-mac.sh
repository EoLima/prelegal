#!/bin/bash

cd "$(dirname "$0")/.."

echo "Stopping Prelegal..."
pkill -f "node backend/dist/main.js" 2>/dev/null || echo "Not running"
