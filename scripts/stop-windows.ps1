#!/usr/bin/env pwsh

Write-Host "Stopping Prelegal..." -ForegroundColor Cyan
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match "backend/dist/main.js" } | Stop-Process -Force
Write-Host "Stopped" -ForegroundColor Green
