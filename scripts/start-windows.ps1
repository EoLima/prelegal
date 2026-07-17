#!/usr/bin/env pwsh

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "Building frontend..." -ForegroundColor Cyan
Set-Location (Join-Path $ProjectRoot "frontend")
npm run build

Write-Host "Starting backend..." -ForegroundColor Cyan
Set-Location $ProjectRoot
node backend/dist/main.js
