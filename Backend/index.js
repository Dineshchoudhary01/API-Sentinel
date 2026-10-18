import 'dotenv/config';
import express from 'express';
import { query, connectDB } from './src/config/db.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/health', async (req, res) => {
    try {
        const result = await query('SELECT now() AS time, current_database() AS db');
        res.json({ status: 'ok', ...result.rows[0] });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.listen(port, async () => {
    console.log(` Server listening on port ${port}`);
    try {
        await connectDB();
    } catch (err) {
        console.error('Database initialization warning: Server started but DB is not reachable.');
    }
});
