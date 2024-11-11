const express = require('express');
const pool = require('./db'); // Import the database pool

const app = express();
const port = 3000;

// Route to retrieve all users
app.get('/', async (req, res) => {
    try {
        // Query to get all data from the users table
        const result = await pool.query('SELECT * FROM users');
        
        // Log the data to the console
        console.log(result.rows);

        // Send the data as the response (optional, for testing purposes)
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
