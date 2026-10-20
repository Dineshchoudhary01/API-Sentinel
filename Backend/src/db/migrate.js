import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function runSQL(filename) {
    try {
        const filePath = path.join(__dirname, filename);
        const sql = fs.readFileSync(filePath, 'utf-8');

        console.log(`Running ${filename}...`);
        await pool.query(sql);
        console.log(`${filename} executed successfully`);
    } catch (error) {
        console.error(`Error executing ${filename}:`, error.message);
        process.exit(1);
    }
}



const action = process.argv[2];
if (action === 'schema') {
    await runSQL('schema.sql');
} else if (action === 'seed') {
    await runSQL('seed.sql');
} else {

    await runSQL('schema.sql');
    await runSQL('seed.sql');
}
await pool.end();

