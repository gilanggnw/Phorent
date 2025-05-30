# Build script for Vercel deployment
echo "🔄 Installing dependencies..."
npm install

echo "🔄 Generating Prisma client..."
npx prisma generate

echo "🔄 Running database migrations..."
npx prisma db push

echo "✅ Build preparation complete!"
