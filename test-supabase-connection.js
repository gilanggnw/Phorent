const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Testing Supabase PostgreSQL connection...')
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
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
