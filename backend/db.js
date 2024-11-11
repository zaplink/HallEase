// db.js
const { Pool } = require('pg');

// Set up the pool connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Export the pool for use in other files
module.exports = pool;
