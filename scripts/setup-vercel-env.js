#!/usr/bin/env node

/**
 * Vercel Environment Variables Setup Script
 * This script helps you add the required environment variables to Vercel
 */

console.log('🚀 Vercel Environment Variables Setup Guide');
console.log('='.repeat(50));
console.log();

console.log('You need to add these environment variables to your Vercel dashboard:');
console.log('Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables');
console.log();

const requiredEnvVars = [
  {
    name: 'DATABASE_URL',
    value: 'postgres://postgres.ljlypwsaskcjgxolvplc:sElIgtjsEEPfLMka@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require',
    description: 'PostgreSQL database connection string'
  },
  {
    name: 'JWT_SECRET',
    value: 'u2FBWnCQIg0qQ2sfoUKRggeSUKDvsD99hM3aA5Ta1dAG8YgBsd9okZQfw2qrLisAlwXAN949MOOHTCKgI+M16g==',
    description: 'JWT secret for token signing (CRITICAL)'
  },
  {
    name: 'NEXT_PUBLIC_APP_URL',
    value: 'https://phorent.vercel.app',
    description: 'Your Vercel app URL'
  },
  {
    name: 'NEXTAUTH_URL',
    value: 'https://phorent.vercel.app',
    description: 'NextAuth URL (same as app URL)'
  },
  {
    name: 'COMMISSION_RATE',
    value: '0.05',
    description: 'Application commission rate'
  }
];

console.log('📋 REQUIRED ENVIRONMENT VARIABLES:');
console.log();

requiredEnvVars.forEach((envVar, index) => {
  console.log(`${index + 1}. ${envVar.name}`);
  console.log(`   Description: ${envVar.description}`);
  console.log(`   Value: ${envVar.value}`);
  console.log();
});

console.log('⚠️  IMPORTANT NOTES:');
console.log('- Make sure to set these for the "Production" environment');
console.log('- After adding variables, redeploy your application');
console.log('- The JWT_SECRET is critical - without it you get 500 errors');
console.log('- Update the URLs to match your actual Vercel deployment URL');
console.log();

console.log('🔧 STEPS TO ADD VARIABLES:');
console.log('1. Go to https://vercel.com/dashboard');
console.log('2. Select your "phorent" project');
console.log('3. Go to Settings → Environment Variables');
console.log('4. Click "Add New" for each variable above');
console.log('5. Set Environment to "Production"');
console.log('6. Click "Save"');
console.log('7. Go to Deployments and click "Redeploy" on latest deployment');
console.log();

console.log('✅ After setup, test registration at: https://phorent.vercel.app');
