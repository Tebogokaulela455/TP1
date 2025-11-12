const express = require('express');
const db = require('../config/db');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const router = express.Router();

// Register (pending approval)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPass = await hashPassword(password);
    await db.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPass]);
    res.status(201).json({ message: 'Registration successful. Awaiting admin approval.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0 || !await comparePassword(password, rows[0].password) || !rows[0].approved) {
      return res.status(401).json({ error: 'Invalid credentials or not approved' });
    }
    const token = generateToken(rows[0]);
    res.json({ token, user: rows[0] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;