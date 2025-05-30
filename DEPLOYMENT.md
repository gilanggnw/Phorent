# 🚀 PhoRent Deployment Guide

## Quick Deployment Checklist

### ✅ Pre-Deployment Setup

1. **Database Setup (Required)**
   - [ ] Set up PostgreSQL database (Vercel Postgres, Supabase, or Railway)
   - [ ] Update `DATABASE_URL` in environment variables
   - [ ] Run database migrations

2. **Environment Variables (Required)**
   - [ ] Generate secure `NEXTAUTH_SECRET` and `JWT_SECRET`
   - [ ] Set up Cloudinary account and get API keys
   - [ ] Configure Stripe account (optional for MVP)
   - [ ] Update `NEXTAUTH_URL` to production domain

3. **Code Preparation**
   - [ ] Test build locally with `npm run build`
   - [ ] Commit all changes to Git
   - [ ] Push to GitHub repository

### 🗄️ Database Options

#### Option 1: Vercel Postgres (Recommended)
```bash
# In Vercel dashboard:
# 1. Go to Storage tab
# 2. Create new Postgres database
# 3. Copy connection string to DATABASE_URL
```

#### Option 2: Supabase (Free tier available)
```bash
# 1. Create account at supabase.com
# 2. Create new project
# 3. Go to Settings > Database
# 4. Copy connection string (use connection pooling)
```

#### Option 3: Railway
```bash
# 1. Create account at railway.app
# 2. Create new PostgreSQL service
# 3. Copy connection string
```

### 🔑 Environment Variables for Production

Set these in Vercel dashboard under Settings > Environment Variables:

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-32-character-random-string"
NEXTAUTH_URL="https://your-app.vercel.app"
JWT_SECRET="your-32-character-random-string"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Stripe (Optional)
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

### 🚀 Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect GitHub repository to Vercel
   - Add environment variables
   - Deploy automatically triggers

3. **Run Database Migration**
   ```bash
   # In Vercel dashboard, go to Functions tab
   # Or run locally with production DATABASE_URL:
   npx prisma db push
   ```

### 🧪 Testing Deployment

1. Visit your deployed app
2. Test user registration
3. Test artwork upload (requires Cloudinary setup)
4. Check database connections

### 🔧 Troubleshooting

**Build Fails:**
- Check all environment variables are set
- Ensure DATABASE_URL is valid PostgreSQL connection
- Run `npm run build` locally first

**Database Connection Issues:**
- Verify DATABASE_URL format
- Check database server is accessible
- Run `npx prisma db push` to create tables

**Image Upload Fails:**
- Verify Cloudinary credentials
- Check API key permissions

### 📝 Development vs Production

**Development (Current):**
- SQLite database
- Local file storage
- Test API keys

**Production (Target):**
- PostgreSQL database
- Cloudinary image storage
- Production API keys
- HTTPS required for auth

### 🔄 Migration Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (no migration files)
npx prisma db push

# Create and run migrations (alternative)
npx prisma migrate dev --name init

# Reset database (development only)
npx prisma db push --force-reset
```

### 🎯 Next Steps After Deployment

1. **Add Database Seeding**
   - Create sample artworks for demo
   - Set up admin user

2. **Performance Optimization**
   - Add image optimization
   - Implement caching
   - Add error monitoring

3. **Additional Features**
   - Email notifications
   - Payment processing
   - Advanced search

### ⚠️ Important Notes

- Vercel serverless functions have 10-second timeout
- Large file uploads may need different storage strategy
- Database connections should use connection pooling
- Environment variables are case-sensitive
