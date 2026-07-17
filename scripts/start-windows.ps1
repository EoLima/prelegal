#!/usr/bin/env pwsh

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $ProjectRoot

Write-Host "Starting Prelegal with Docker..." -ForegroundColor Cyan
docker compose up --build -d

Write-Host ""
Write-Host "Prelegal is running at http://localhost:8000" -ForegroundColor Green
Write-Host "Run scripts/stop-windows.ps1 to stop." -ForegroundColor Yellow
