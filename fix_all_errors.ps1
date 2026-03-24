# Quick Fix Script for Windows (PowerShell)
# Run this from the project root directory

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Word Search Game - Error Fix Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "Uzgame")) {
    Write-Host "❌ Error: Uzgame directory not found!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Found project structure" -ForegroundColor Green
Write-Host ""

# Step 1: Recreate tables
Write-Host "Step 1: Recreating database tables..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

try {
    Push-Location "Uzgame"
    Write-Host "Running: python recreate_tables.py" -ForegroundColor Yellow
    & python recreate_tables.py
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to recreate tables"
    }
    Pop-Location
    Write-Host "✓ Database tables recreated" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host ""

# Step 2: Seed data
Write-Host "Step 2: Seeding sample questions..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

try {
    Push-Location "Uzgame"
    Write-Host "Running: python seed_word_search.py" -ForegroundColor Yellow
    # Pipe 'y' to auto-answer the overwrite prompt
    "y" | & python seed_word_search.py
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to seed data"
    }
    Pop-Location
    Write-Host "✓ Sample questions seeded" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✓ ALL FIXES COMPLETED!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start backend server:" -ForegroundColor White
Write-Host "   cd Uzgame" -ForegroundColor Gray
Write-Host "   python -m uvicorn app.main:app --reload --port 8000" -ForegroundColor Gray
Write-Host ""
Write-Host "2. In another terminal, start frontend:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Open browser:" -ForegroundColor White
Write-Host "   http://localhost:5174" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Navigate to Word Search Game (SO'Z QIDIRUV)" -ForegroundColor White
Write-Host ""
