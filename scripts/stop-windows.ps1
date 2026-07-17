#!/usr/bin/env pwsh

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $ProjectRoot

Write-Host "Stopping Prelegal..." -ForegroundColor Cyan
docker compose down
Write-Host "Stopped." -ForegroundColor Green
