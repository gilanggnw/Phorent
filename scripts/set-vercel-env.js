#!/usr/bin/env node

/**
 * Script to set up Vercel environment variables for the PhoRent application
 * This ensures the 500 error on registration is fixed by setting the correct JWT_SECRET
 */

console.log('🔧 Vercel Environment Variables Setup for PhoRent')
console.log('================================================')

// Required environment variables for the application to work
const requiredEnvVars = [
  {
    key: 'DATABASE_URL',
    value: 'postgres://postgres.ljlypwsaskcjgxolvplc:sElIgtjsEEPfLMka@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x',
    description: 'Database connection string'
  },
  {
    key: 'JWT_SECRET',
    value: 'u2FBWnCQIg0qQ2sfoUKRggeSUKDvsD99hM3aA5Ta1dAG8YgBsd9okZQfw2qrLisAlwXAN949MOOHTCKgI+M16g==',
    description: 'JWT secret (using SUPABASE_JWT_SECRET value from local env)'
  },
  {
    key: 'SUPABASE_JWT_SECRET',
    value: 'u2FBWnCQIg0qQ2sfoUKRggeSUKDvsD99hM3aA5Ta1dAG8YgBsd9okZQfw2qrLisAlwXAN949MOOHTCKgI+M16g==',
    description: 'Supabase JWT secret (keeping for compatibility)'
  }
]

console.log('\n📝 Environment variables that need to be set in Vercel:')
console.log('You can set these via:')
console.log('1. Vercel Dashboard > Project Settings > Environment Variables')
console.log('2. Or use the Vercel CLI: vercel env add <KEY>\n')

requiredEnvVars.forEach((envVar, index) => {
  console.log(`${index + 1}. ${envVar.key}`)
  console.log(`   Description: ${envVar.description}`)
  console.log(`   Value: ${envVar.value}`)
  console.log(`   CLI Command: vercel env add ${envVar.key}`)
  console.log('')
})

console.log('🚀 After setting these variables in Vercel:')
console.log('1. Redeploy your application: vercel --prod')
console.log('2. Test the registration endpoint on your live site')
console.log('\n✨ This should fix the 500 Internal Server Error on registration!')
