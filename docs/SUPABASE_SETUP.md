# Supabase Setup Guide

## Step 1: Create Supabase Account

1. **Sign Up**
   - Go to https://supabase.com
   - Sign up with GitHub or email

2. **Create New Project**
   - Click "New Project"
   - Choose organization (create one if needed)
   - Enter project name: "phorent"
   - Enter database password (save this!)
   - Select region closest to you
   - Click "Create new project"

## Step 2: Get Database Connection String

1. **Go to Settings**
   - In your project dashboard, click "Settings" (gear icon)
   - Click "Database" in the left sidebar

2. **Copy Connection String**
   - Scroll down to "Connection string"
   - Select "URI" tab
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your actual password

## Step 3: Update Environment Variables

```bash
# Example Supabase connection string:
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

## Benefits:
- ✅ Free tier with 500MB storage
- ✅ Built-in authentication (optional)
- ✅ Real-time subscriptions
- ✅ Easy to use dashboard
