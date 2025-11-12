const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const policyRoutes = require('./routes/policies');
const invoiceRoutes = require('./routes/invoices');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/admin', adminRoutes);

// Daily premium reminder cron job (use node-cron in production)
// For now, endpoint to trigger: POST /api/reminders/send-daily

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));