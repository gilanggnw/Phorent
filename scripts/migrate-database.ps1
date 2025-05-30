# Database Migration Script for PowerShell

Write-Host "🔄 Starting database migration..." -ForegroundColor Green

# Check if DATABASE_URL is set
if (-not $env:DATABASE_URL) {
    Write-Host "❌ DATABASE_URL environment variable is not set" -ForegroundColor Red
    Write-Host "Please set your PostgreSQL connection string first" -ForegroundColor Yellow
    Write-Host "Example: `$env:DATABASE_URL = 'postgresql://username:password@host:port/database'" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ DATABASE_URL is set" -ForegroundColor Green

# Generate Prisma Client
Write-Host "🔄 Generating Prisma client..." -ForegroundColor Blue
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}

# Push schema to database (creates tables)
Write-Host "🔄 Creating database tables..." -ForegroundColor Blue
npx prisma db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create database tables" -ForegroundColor Red
    exit 1
}

# Optional: Seed database with sample data
$response = Read-Host "🔄 Would you like to seed the database with sample data? (y/n)"
if ($response -match '^[yY]([eE][sS])?$') {
    Write-Host "🌱 Seeding database..." -ForegroundColor Blue
    npm run db:seed
}

Write-Host "🎉 Database migration completed!" -ForegroundColor Green
Write-Host "Your PostgreSQL database is ready to use." -ForegroundColor Green
