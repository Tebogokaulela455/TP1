// Payment API Placeholder (e.g., for PayFast/Stripe)
const PAYMENT_API_KEY = process.env.PAYMENT_API_KEY || null; // Add your key here later
const isFreeMode = !PAYMENT_API_KEY; // Free until API is added

// SMS API Placeholder (e.g., Twilio)
const SMS_API_KEY = process.env.SMS_API_KEY || null;
const SMS_SERVICE_URL = process.env.SMS_SERVICE_URL || null; // e.g., 'https://api.twilio.com'

module.exports = { PAYMENT_API_KEY, isFreeMode, SMS_API_KEY, SMS_SERVICE_URL };