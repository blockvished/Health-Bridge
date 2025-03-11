import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('Attempting to connect with:', process.env.DATABASE_URL);
    const sql = postgres(process.env.DATABASE_URL, { max: 1 });

    // Test query
    const result = await sql`SELECT current_timestamp`;
    console.log('Connection successful!');
    console.log('Current timestamp:', result[0].current_timestamp);

    await sql.end();
  } catch (error) {
    console.error('Database connection error:', error);
    console.error('Error details:', error.message);
  }
}

testConnection();
