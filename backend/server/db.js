import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

// pool은 DB 자체가 아니라 DB 연결을 확인하는 객체
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
});

export default pool;
