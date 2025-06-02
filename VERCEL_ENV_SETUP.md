Environment Variables to Add in Vercel Dashboard:

=== CRITICAL - Database & JWT ===
DATABASE_URL = postgres://postgres.ljlypwsaskcjgxolvplc:sElIgtjsEEPfLMka@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require

DIRECT_URL = postgres://postgres.ljlypwsaskcjgxolvplc:sElIgtjsEEPfLMka@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require

NEXT_PUBLIC_SUPABASE_URL = https://ljlypwsaskcjgxolvplc.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbHlwd3Nhc2tjamd4b2x2cGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDY4MjUsImV4cCI6MjA2NDE4MjgyNX0.BhvpnkcY-PeJnciXZY_JXrd1N_i8IpsueDiRJfvO_Yc

SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbHlwd3Nhc2tjamd4b2x2cGxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODYwNjgyNSwiZXhwIjoyMDY0MTgyODI1fQ.L7RVSgPz4-6Vr1Zr5zFJGiAUe_jOF1rqvr5eOQF2v2Y

=== Authentication ===
JWT_SECRET = phorent-jwt-secret-2024-production-key
NEXTAUTH_SECRET = phorent-nextauth-secret-2024-production
NEXTAUTH_URL = https://phorent.vercel.app

=== Application ===
NEXT_PUBLIC_APP_URL = https://phorent.vercel.app
COMMISSION_RATE = 0.05

=== Optional (Set Later) ===
CLOUDINARY_CLOUD_NAME = your-cloud-name
CLOUDINARY_API_KEY = your-api-key
CLOUDINARY_API_SECRET = your-api-secret
STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_SECRET_KEY = sk_test_...
STRIPE_WEBHOOK_SECRET = whsec_...
