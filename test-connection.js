const { Client } = require('pg');

const connectionString = "postgresql://postgres.ljlypwsaskcjgxolvplc:PhoRentOnly@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require";

async function testConnection() {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    console.log('Attempting to connect to Supabase...');
    await client.connect();
    console.log('✅ Successfully connected to Supabase!');
    
    const result = await client.query('SELECT version()');
    console.log('Database version:', result.rows[0].version);
    
    await client.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
