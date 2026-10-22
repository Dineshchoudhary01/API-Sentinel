import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

async function runFile(filename) {
    const sql = fs.readFileSync(path.join(__dirname, filename), 'utf-8');
    console.log(`Running ${filename}...`);
    await pool.query(sql);
    console.log(`${filename} done`);
}

async function resetSchema() {
    console.log('Resetting public schema (all tables and data will be deleted)...');
    await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    console.log('Schema reset done');
}

const actions = {
    schema: () => runFile('schema.sql'),
    seed: () => runFile('seed.sql'),
    all: async () => {
        await runFile('schema.sql');
        await runFile('seed.sql');
    },
    reset: async () => {
        await resetSchema();
        await runFile('schema.sql');
        await runFile('seed.sql');
    },
};

const action = process.argv[2];

if (!actions[action]) {
    console.log('Usage: node src/db/migrate.js <schema|seed|all|reset>');
    process.exit(1);
}

if (isProduction && action !== 'schema') {
    console.error(`"${action}" is not allowed in production`);
    process.exit(1);
}

try {
    const { rows } = await pool.query('SELECT current_database() AS db');
    console.log(`Database: ${rows[0].db}`);
    await actions[action]();
} catch (err) {
    console.error('Migration failed:', err.message);
    process.exitCode = 1;
} finally {
    await pool.end();
}