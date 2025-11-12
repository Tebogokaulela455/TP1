const { SMS_API_KEY, SMS_SERVICE_URL } = require('../config/apiConfig');
const axios = require('axios'); // npm install axios if needed

const sendWelcomeSMS = async (phone, name) => {
  const message = `Welcome to Lesedi, ${name}! Your policy admin is set up.`;
  if (SMS_API_KEY) {
    // Add your SMS API call, e.g., Twilio
    // await axios.post(`${SMS_SERVICE_URL}/Messages.json`, { To: phone, Body: message }, { auth: { username: 'AC...', password: SMS_API_KEY } });
    console.log(`SMS sent (prod): ${message} to ${phone}`);
  } else {
    console.log(`SMS placeholder: ${message} to ${phone}`);
  }
};

const sendPremiumReminder = async (phone, policy) => {
  const message = `Reminder: Premium of R${policy.premium} due for policy ${policy.policy_number}.`;
  // Similar to above
  console.log(`Reminder placeholder: ${message} to ${phone}`);
};

const sendPaymentSMS = async (phone, name, amount, invoiceNumber) => {
  const message = `Payment due: R${amount} for ${name}. Invoice: ${invoiceNumber}.`;
  // Similar
  console.log(`Payment SMS placeholder: ${message} to ${phone}`);
};

module.exports = { sendWelcomeSMS, sendPremiumReminder, sendPaymentSMS };