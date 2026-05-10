# Start both backend and frontend development servers for MediSync.
# Usage: .\start-dev.ps1

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $repoRoot 'backend'
$frontendDir = Join-Path $repoRoot 'frontend'

Write-Host 'Checking prerequisites...' -ForegroundColor Cyan

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host 'Python is not installed or not available in PATH.' -ForegroundColor Red
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host 'npm is not installed or not available in PATH.' -ForegroundColor Red
    exit 1
}

Write-Host 'Opening backend server in a new PowerShell window...' -ForegroundColor Green
Start-Process pwsh -ArgumentList '-NoExit', '-Command', "Set-Location -Path '$backendDir'; python manage.py runserver 8001" -WorkingDirectory $backendDir

Write-Host 'Opening frontend server in a new PowerShell window...' -ForegroundColor Green
Start-Process pwsh -ArgumentList '-NoExit', '-Command', "Set-Location -Path '$frontendDir'; npm run dev" -WorkingDirectory $frontendDir

Write-Host 'All startup commands have been launched.' -ForegroundColor Cyan
Write-Host 'Backend: http://localhost:8001' -ForegroundColor Yellow
Write-Host 'Frontend: http://localhost:3001 (or next available port)' -ForegroundColor Yellow
