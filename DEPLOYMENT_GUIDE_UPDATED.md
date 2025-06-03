# 🚀 Updated Vercel Deployment Guide

## Environment Variables for Production

### Critical Variables (Required for Registration/Login to work)

```bash
# Database Connection
DATABASE_URL = postgres://postgres.ljlypwsaskcjgxolvplc:sElIgtjsEEPfLMka@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require

# JWT Authentication - GENERATE A STRONG SECRET
JWT_SECRET = your-strong-jwt-secret-minimum-32-characters-long

# Application URLs - UPDATE WITH YOUR ACTUAL VERCEL URL
NEXT_PUBLIC_APP_URL = https://your-app-name.vercel.app
NEXTAUTH_URL = https://your-app-name.vercel.app

# Application Settings
COMMISSION_RATE = 0.05
```

### Optional Variables (Configure Later)

```bash
# Image Upload Service
CLOUDINARY_CLOUD_NAME = your-cloud-name
CLOUDINARY_API_KEY = your-api-key
CLOUDINARY_API_SECRET = your-api-secret

# Payment Processing
STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_SECRET_KEY = sk_live_...
STRIPE_WEBHOOK_SECRET = whsec_...
```

## Deployment Steps

### 1. Set Environment Variables in Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add each variable from the "Critical Variables" section above
5. **Important**: Generate a strong `JWT_SECRET` (32+ random characters)

### 2. Deploy Your Application

```bash
# Push your latest changes
git add .
git commit -m "Environment variables cleanup and deployment prep"
git push

# Or deploy directly with Vercel CLI
vercel --prod
```

### 3. Test the Deployment

After deployment, test the registration endpoint:

```bash
# Update the test script with your Vercel URL
node scripts/test-registration.js
```

## Important Notes

- ✅ **Database**: Already configured and migrated with Prisma
- ✅ **Authentication**: JWT-based system ready for production
- ✅ **Build Process**: Includes `prisma generate` in build step
- ⚠️ **JWT_SECRET**: Must be different between development and production
- ⚠️ **URLs**: Update all URLs to match your actual Vercel deployment

## Troubleshooting

### If Registration Still Returns 500 Error

1. Check Vercel Function Logs for specific error messages
2. Verify `JWT_SECRET` is properly set in Vercel dashboard
3. Ensure `DATABASE_URL` is accessible from Vercel's servers
4. Check that Prisma schema is properly generated during build

### Database Connection Issues

If you see database connection errors, verify:

- Database URL format is correct
- Database allows connections from Vercel's IP ranges
- SSL mode is properly configured (`sslmode=require`)

## Status

✅ **Local Development**: Working perfectly  
✅ **Build Process**: Passing TypeScript/ESLint checks  
✅ **Environment**: Cleaned up and standardized  
🔄 **Production**: Ready for deployment with proper environment variables
