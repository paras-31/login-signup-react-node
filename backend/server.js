const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());
// app.use(cors());

// Allow requests from the frontend
app.use(cors({
    origin: ['http://localhost:80','http://frontend-container:80'], // or 'http://<frontend-container>'
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));


app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`Request to ${req.path} took ${duration}ms`);
  });
  next();
});


// MySQL setup
const pool = mysql.createPool({
  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD, // example: rG3Jn873UL9niwW12iaw
  // database: process.env.DB_NAME,
  // port: process.env.DB_PORT || 3306,
  host: "database-1.c18u66sw8gmt.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "Paras12345", // example: rG3Jn873UL9niwW12iaw
  database: "users",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    await pool.execute(query, [username, hashedPassword]);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await pool.execute(query, [username]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error logging in' });
  }
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Backend server is running on port 5000');
});
