#!/bin/bash

# Post-Deployment Database Setup Script
# Run this after deploying to Vercel

echo "🗄️  Setting up database schema..."

# Deploy Prisma schema to Supabase
npx prisma db push

if [ $? -eq 0 ]; then
    echo "✅ Database schema deployed successfully!"
    
    echo "🌱 Seeding database with sample data..."
    npm run db:seed
    
    if [ $? -eq 0 ]; then
        echo "✅ Database seeded successfully!"
        echo ""
        echo "🎉 Your PhoRent application is fully deployed and ready!"
        echo "📱 You can now browse artworks, register users, and post artwork for rent."
        echo ""
        echo "🔗 Next steps:"
        echo "   1. Visit your deployed application"
        echo "   2. Create a user account"
        echo "   3. Post some artwork for rent"
        echo "   4. Test the browse functionality"
    else
        echo "⚠️  Database seeding failed, but schema is deployed."
        echo "   You can manually add data through your application."
    fi
else
    echo "❌ Database schema deployment failed!"
    echo "   Please check your DATABASE_URL environment variable in Vercel."
    echo "   Make sure it matches: postgresql://postgres.ljlypwsaskcjgxolvplc:PhoRentOnly@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
fi
