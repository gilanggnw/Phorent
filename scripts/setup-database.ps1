# 🗄️ Database Setup - Interactive Guide

Write-Host "🎨 PhoRent Database Setup" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Choose your database setup option:" -ForegroundColor Yellow
Write-Host "1. Vercel Postgres (Recommended for production)" -ForegroundColor Green
Write-Host "2. Supabase (Free tier available)" -ForegroundColor Blue
Write-Host "3. Local PostgreSQL (Development)" -ForegroundColor Magenta
Write-Host "4. Keep SQLite (Quick testing only)" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host "🚀 Setting up for Vercel Postgres..." -ForegroundColor Green
        Write-Host ""
        Write-Host "Steps to complete:" -ForegroundColor Yellow
        Write-Host "1. Go to https://vercel.com and sign in" -ForegroundColor White
        Write-Host "2. Navigate to Storage > Create Database > Postgres" -ForegroundColor White
        Write-Host "3. Copy the DATABASE_URL connection string" -ForegroundColor White
        Write-Host "4. Come back here and paste it" -ForegroundColor White
        Write-Host ""
        
        $dbUrl = Read-Host "Paste your Vercel Postgres DATABASE_URL here"
        
        if ($dbUrl) {
            # Update .env.local
            $envContent = @"
# Database - Vercel Postgres
DATABASE_URL="$dbUrl"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# JWT
JWT_SECRET="your-jwt-secret-here"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
"@
            $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
            Write-Host "✅ .env.local updated with Vercel Postgres URL" -ForegroundColor Green
        }
    }
    
    "2" {
        Write-Host "🟢 Setting up for Supabase..." -ForegroundColor Blue
        Write-Host ""
        Write-Host "Steps to complete:" -ForegroundColor Yellow
        Write-Host "1. Go to https://supabase.com and sign up" -ForegroundColor White
        Write-Host "2. Create a new project" -ForegroundColor White
        Write-Host "3. Go to Settings > Database" -ForegroundColor White
        Write-Host "4. Copy the connection string (URI format)" -ForegroundColor White
        Write-Host ""
        
        $dbUrl = Read-Host "Paste your Supabase DATABASE_URL here"
        
        if ($dbUrl) {
            # Update .env.local
            $envContent = @"
# Database - Supabase
DATABASE_URL="$dbUrl"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# JWT
JWT_SECRET="your-jwt-secret-here"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
"@
            $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
            Write-Host "✅ .env.local updated with Supabase URL" -ForegroundColor Green
        }
    }
    
    "3" {
        Write-Host "💻 Setting up Local PostgreSQL..." -ForegroundColor Magenta
        Write-Host ""
        Write-Host "Do you have PostgreSQL installed?" -ForegroundColor Yellow
        Write-Host "1. Yes, it's already installed" -ForegroundColor White
        Write-Host "2. No, help me install it" -ForegroundColor White
        
        $pgChoice = Read-Host "Enter choice (1-2)"
        
        if ($pgChoice -eq "2") {
            Write-Host "📦 Installing PostgreSQL..." -ForegroundColor Blue
            Write-Host "Checking for Chocolatey..." -ForegroundColor Gray
            
            if (Get-Command choco -ErrorAction SilentlyContinue) {
                Write-Host "Installing PostgreSQL via Chocolatey..." -ForegroundColor Blue
                choco install postgresql -y
            } else {
                Write-Host "Chocolatey not found. Please install PostgreSQL manually:" -ForegroundColor Yellow
                Write-Host "https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
                Write-Host "Press Enter after installation is complete..."
                Read-Host
            }
        }
        
        Write-Host "Creating local database..." -ForegroundColor Blue
        $dbName = Read-Host "Enter database name (default: phorent)"
        if (-not $dbName) { $dbName = "phorent" }
        
        $username = Read-Host "Enter PostgreSQL username (default: postgres)"
        if (-not $username) { $username = "postgres" }
        
        $password = Read-Host "Enter PostgreSQL password" -AsSecureString
        $plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
        
        $dbUrl = "postgresql://$username`:$plainPassword@localhost:5432/$dbName"
        
        # Update .env.local
        $envContent = @"
# Database - Local PostgreSQL
DATABASE_URL="$dbUrl"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# JWT
JWT_SECRET="your-jwt-secret-here"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
"@
        $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
        Write-Host "✅ .env.local updated with local PostgreSQL URL" -ForegroundColor Green
    }
    
    "4" {
        Write-Host "📁 Keeping SQLite for testing..." -ForegroundColor Gray
        Write-Host "Note: This won't work on Vercel deployment" -ForegroundColor Yellow
        
        # Update schema back to SQLite
        $schemaPath = "prisma\schema.prisma"
        $content = Get-Content $schemaPath
        $content = $content -replace 'provider = "postgresql"', 'provider = "sqlite"'
        $content = $content -replace 'url\s*=\s*env\("DATABASE_URL"\)', 'url = "file:./dev.db"'
        $content | Set-Content $schemaPath
        
        Write-Host "✅ Schema updated to use SQLite" -ForegroundColor Green
        return
    }
    
    default {
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
        return
    }
}

# If we get here, user chose PostgreSQL option
Write-Host ""
Write-Host "🔄 Setting up database..." -ForegroundColor Blue

# Run migration
try {
    Write-Host "Generating Prisma client..." -ForegroundColor Gray
    npx prisma generate
    
    Write-Host "Creating database tables..." -ForegroundColor Gray
    npx prisma db push
    
    Write-Host "✅ Database setup complete!" -ForegroundColor Green
    
    $seedChoice = Read-Host "Would you like to add sample data? (y/n)"
    if ($seedChoice -match '^[yY]') {
        Write-Host "🌱 Adding sample data..." -ForegroundColor Blue
        npm run db:seed
        Write-Host "✅ Sample data added!" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "🎉 Database setup completed successfully!" -ForegroundColor Green
    Write-Host "You can now run: npm run dev" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Database setup failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please check your DATABASE_URL and try again." -ForegroundColor Yellow
}
