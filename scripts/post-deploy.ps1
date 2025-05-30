# Post-Deployment Database Setup Script (PowerShell)
# Run this after deploying to Vercel

Write-Host "🗄️  Setting up database schema..." -ForegroundColor Cyan

# Deploy Prisma schema to Supabase
npx prisma db push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database schema deployed successfully!" -ForegroundColor Green
    
    Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Cyan
    npm run db:seed
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database seeded successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 Your PhoRent application is fully deployed and ready!" -ForegroundColor Green
        Write-Host "📱 You can now browse artworks, register users, and post artwork for rent." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "🔗 Next steps:" -ForegroundColor Cyan
        Write-Host "   1. Visit your deployed application"
        Write-Host "   2. Create a user account"
        Write-Host "   3. Post some artwork for rent"
        Write-Host "   4. Test the browse functionality"
    } else {
        Write-Host "⚠️  Database seeding failed, but schema is deployed." -ForegroundColor Yellow
        Write-Host "   You can manually add data through your application."
    }
} else {
    Write-Host "❌ Database schema deployment failed!" -ForegroundColor Red
    Write-Host "   Please check your DATABASE_URL environment variable in Vercel."
    Write-Host "   Make sure it matches: postgresql://postgres.ljlypwsaskcjgxolvplc:PhoRentOnly@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
}
