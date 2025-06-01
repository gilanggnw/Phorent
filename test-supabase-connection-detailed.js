require('dotenv').config({ path: '.env.local' })

console.log('Environment variables:')
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set')

if (process.env.DATABASE_URL) {
  // Mask the password for security
  const maskedUrl = process.env.DATABASE_URL.replace(/:([^:]+)@/, ':****@')
  console.log('Masked DATABASE_URL:', maskedUrl)
}

const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    console.log('\nTesting Supabase PostgreSQL connection...')
    await prisma.$connect()
    console.log('✅ Successfully connected to Supabase PostgreSQL!')
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT version()`
    console.log('Database version:', result[0])
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    if (error.code) {
      console.error('Error code:', error.code)
    }
    if (error.meta) {
      console.error('Error meta:', error.meta)
    }
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
