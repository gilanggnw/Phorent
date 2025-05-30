#!/bin/bash
# Database Migration Script

echo "🔄 Starting database migration..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is not set"
    echo "Please set your PostgreSQL connection string first"
    exit 1
fi

echo "✅ DATABASE_URL is set"

# Generate Prisma Client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Push schema to database (creates tables)
echo "🔄 Creating database tables..."
npx prisma db push

# Optional: Seed database with sample data
echo "🔄 Would you like to seed the database with sample data? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "🌱 Seeding database..."
    npm run db:seed
fi

echo "🎉 Database migration completed!"
echo "Your PostgreSQL database is ready to use."
