# Vercel Postgres Setup Guide

## Step 1: Create Vercel Postgres Database

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com and sign in
   - Go to your project or create a new one

2. **Create Database**
   - Click on the "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose a name (e.g., "phorent-db")
   - Select your preferred region
   - Click "Create"

3. **Get Connection String**
   - After creation, click on your database
   - Go to "Settings" tab
   - Copy the "DATABASE_URL" connection string
   - It will look like: `postgresql://username:password@host:port/database`

## Step 2: Update Environment Variables

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Click "Environment Variables"
   - Add: `DATABASE_URL` with your Postgres connection string

2. **For Local Development:**
   - Update your `.env.local` file with the same DATABASE_URL

## Step 3: Run Database Migration

```bash
# After updating DATABASE_URL, run:
npx prisma db push
```

This will create all your tables in the PostgreSQL database.

## Benefits:
- ✅ Fully integrated with Vercel
- ✅ Automatic backups
- ✅ No additional setup required
- ✅ Scales automatically
