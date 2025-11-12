const express = require('express');
const db = require('../config/db');
const { auth } = require('../middleware/auth');
const smsService = require('../services/smsService');
const router = express.Router();

router.use(auth);

// Create policy
router.post('/', async (req, res) => {
  const { client_id, policy_number, type, premium, start_date, end_date } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO policies (client_id, policy_number, type, premium, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
      [client_id, policy_number, type, premium, start_date, end_date]
    );
    // Generate cert placeholder (in prod, use PDF lib to generate cert)
    const certUrl = `/certs/${result.insertId}.pdf`; // Placeholder
    await db.execute('UPDATE policies SET certificate_url=? WHERE id=?', [certUrl, result.insertId]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get policies for client
router.get('/client/:clientId', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM policies WHERE client_id=?', [req.params.clientId]);
  res.json(rows);
});

// Send premium reminder (daily trigger)
router.post('/reminders', async (req, res) => {
  // In prod, cron job queries due premiums and sends SMS
  const { client_id } = req.body;
  const [policies] = await db.execute('SELECT * FROM policies WHERE client_id=? AND end_date > CURDATE()', [client_id]);
  for (let policy of policies) {
    await smsService.sendPremiumReminder(policy.phone || (await db.execute('SELECT phone FROM clients WHERE id=?', [client_id]))[0][0].phone, policy);
  }
  res.json({ message: 'Reminders sent' });
});

module.exports = router;