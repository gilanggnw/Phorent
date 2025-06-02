# Vercel Environment Variables Setup

## CRITICAL Environment Variables

### Database Configuration
```
DATABASE_URL = postgres://postgres.ljlypwsaskcjgxolvplc:sElIgtjsEEPfLMka@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require
```

### JWT Authentication
```
JWT_SECRET = your-strong-jwt-secret-key-here-generate-random-32-chars
```

### Application URLs
```
NEXT_PUBLIC_APP_URL = https://your-app-name.vercel.app
NEXTAUTH_URL = https://your-app-name.vercel.app
```

### Application Settings
```
COMMISSION_RATE = 0.05
```

## Optional Environment Variables (Configure Later)

### Cloudinary (for image uploads)
```
CLOUDINARY_CLOUD_NAME = your-cloud-name
CLOUDINARY_API_KEY = your-api-key
CLOUDINARY_API_SECRET = your-api-secret
```

### Stripe (for payments)
```
STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_SECRET_KEY = sk_test_...
STRIPE_WEBHOOK_SECRET = whsec_...
```

## Setup Instructions

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable above with the correct values
5. Redeploy your application

## Important Notes

- The `DATABASE_URL` must match exactly what's working locally
- Generate a strong random `JWT_SECRET` (32+ characters)
- Update the domain URLs to match your actual Vercel deployment URL
- Test the registration endpoint after deployment
