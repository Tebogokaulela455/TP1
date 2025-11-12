const express = require('express');
const db = require('../config/db');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

router.use(auth);
router.use(adminAuth);

// Get pending users
router.get('/pending-users', async (req, res) => {
  const [rows] = await db.execute('SELECT id, username, email FROM users WHERE approved=FALSE');
  res.json(rows);
});

// Approve user
router.put('/approve/:id', async (req, res) => {
  await db.execute('UPDATE users SET approved=TRUE WHERE id=?', [req.params.id]);
  res.json({ message: 'User approved' });
});

// Get all users
router.get('/users', async (req, res) => {
  const [rows] = await db.execute('SELECT id, username, email, role, approved FROM users');
  res.json(rows);
});

module.exports = router;