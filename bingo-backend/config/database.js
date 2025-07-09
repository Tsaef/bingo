const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'bingo',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'bingo_db',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

module.exports = pool;