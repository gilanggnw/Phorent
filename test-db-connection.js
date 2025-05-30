const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://postgres.ljlypwsaskcjgxolvplc:PhoRentOnly@db.ljlypwsaskcjgxolvplc.supabase.co:5432/postgres"
      }
    }
  });

  try {
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();
