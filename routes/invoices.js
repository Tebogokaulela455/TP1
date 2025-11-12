const express = require('express');
const db = require('../config/db');
const { auth } = require('../middleware/auth');
const smsService = require('../services/smsService');
const { isFreeMode } = require('../config/apiConfig');
const router = express.Router();

router.use(auth);

// Generate invoice for cash funeral or premium
router.post('/', async (req, res) => {
  const { client_id, policy_id, amount, type } = req.body;
  const invoiceNumber = `INV-${Date.now()}`;
  try {
    const [result] = await db.execute(
      'INSERT INTO invoices (client_id, policy_id, amount, type, invoice_number) VALUES (?, ?, ?, ?, ?)',
      [client_id, policy_id, amount, type, invoiceNumber]
    );
    // Send payment SMS
    const [client] = await db.execute('SELECT phone, name FROM clients WHERE id=?', [client_id]);
    await smsService.sendPaymentSMS(client[0].phone, client[0].name, amount, invoiceNumber);
    // Payment placeholder
    if (!isFreeMode) {
      // Add your payment API call here, e.g., stripe.charges.create(...)
      console.log('Processing payment with API...');
    } else {
      // Mark as paid for free mode
      await db.execute('UPDATE invoices SET status="paid" WHERE id=?', [result.insertId]);
    }
    res.status(201).json({ id: result.insertId, invoice_number: invoiceNumber });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get invoices
router.get('/', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM invoices ORDER BY created_at DESC');
  res.json(rows);
});

module.exports = router;