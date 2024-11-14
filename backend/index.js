const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors({ origin: "http://localhost:5173" })); // Enable CORS for React app's origin
app.use(express.json()); // Middleware that parses data as JSON objects
const port = 3000;

// Route to retrieve all users
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Collect user posting data
app.post("/usr", async (req, res) => {
  try {
    const { email, password } = req.body;

    // for debugging purpose
    console.log(email);
    console.log(password);

    // Query
    const checkResults = await pool.query(
      "SELECT type FROM users WHERE email = $1 AND pwd = $2",
      [email, password]
    );

    if (checkResults.rows.length > 0) {
      const userType = checkResults.rows[0].type;
      // send json data as a response
      res.json({ success: true, userType });
    } else {
      res.status(401).json({ success: false, message: "Invalid User" });
    }
  } catch (error) {
    console.error("Error receiving data:", error.message);
    res.status(500).send(error.message);
  }
});

// Get a specific field
// app.get("/login/:type", async (req, res) => {
//   try {
//     const { type } = req.params;
//     const userDetails = await pool.query(
//       "SELECT * FROM users WHERE type = $1",
//       [type]
//     );
//     res.json(userDetails.rows);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server Error");
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
