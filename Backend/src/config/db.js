import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
    console.error(' Warning: DATABASE_URL environment variable is missing.');
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
});

// Handle idle client errors so the application does not crash
pool.on('error', (err) => {
    console.error(' Unexpected error on idle PostgreSQL client:', err.message);
});

// Helper function to run queries
export const query = (text, params) => pool.query(text, params);

// Connection test helper function
export const connectDB = async () => {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT current_database() AS db');
        console.log(` PostgreSQL Connected to database: "${res.rows[0].db}"`);
        client.release();
    } catch (err) {
        console.error(' PostgreSQL Connection Failed:', err.message);
        throw err;
    }
};
