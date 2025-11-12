const express = require('express');
const db = require('../config/db');
const { auth } = require('../middleware/auth');
const smsService = require('../services/smsService');
const router = express.Router();

router.use(auth);

// Create client + send welcome SMS
router.post('/', async (req, res) => {
  const { name, phone, email, address } = req.body;
  try {
    const [result] = await db.execute('INSERT INTO clients (name, phone, email, address) VALUES (?, ?, ?, ?)', [name, phone, email, address]);
    await smsService.sendWelcomeSMS(phone, name); // Automated welcome
    res.status(201).json({ id: result.insertId, message: 'Client created and welcomed' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all clients
router.get('/', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM clients');
  res.json(rows);
});

// Update client
router.put('/:id', async (req, res) => {
  const { name, phone, email, address } = req.body;
  await db.execute('UPDATE clients SET name=?, phone=?, email=?, address=? WHERE id=?', [name, phone, email, address, req.params.id]);
  res.json({ message: 'Client updated' });
});

module.exports = router;