import pool from './db.js';

const result = async function runQuery() {
    try {
        const res = await pool.query(
            'SELECT * FROM region'
        );
        console.log(res.rows);
    } catch (err) {
        console.error(err);
    }
    finally {
        await pool.end();
    }
}

result();