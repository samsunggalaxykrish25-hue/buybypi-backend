const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PI_API_KEY = process.env.PI_API_KEY || 'ivunr6opfa1frialjn8bmfo48n6wdo3mbkqlyyzsm6xgy7i6cecmcnirnjp3zckn';
const PI_API_URL = 'https://api.minepi.com';

// ── Health check ──
app.get('/', (req, res) => {
  res.json({ status: 'BuyByPi backend running ✅' });
});

// ── Approve Payment ──
app.post('/approve', async (req, res) => {
  const { paymentId } = req.body;
  console.log('Approving payment:', paymentId);
  try {
    const response = await axios.post(
      `${PI_API_URL}/v2/payments/${paymentId}/approve`,
      {},
      { headers: { Authorization: `Key ${PI_API_KEY}` } }
    );
    console.log('Payment approved ✅', response.data);
    res.json({ success: true, payment: response.data });
  } catch (error) {
    console.error('Approval error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

// ── Complete Payment ──
app.post('/complete', async (req, res) => {
  const { paymentId, txid } = req.body;
  console.log('Completing payment:', paymentId, 'txid:', txid);
  try {
    const response = await axios.post(
      `${PI_API_URL}/v2/payments/${paymentId}/complete`,
      { txid },
      { headers: { Authorization: `Key ${PI_API_KEY}` } }
    );
    console.log('Payment completed ✅', response.data);
    res.json({ success: true, payment: response.data });
  } catch (error) {
    console.error('Completion error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

// ── Verify User Token ──
app.post('/verify-user', async (req, res) => {
  const { accessToken } = req.body;
  try {
    const response = await axios.get(
      `${PI_API_URL}/v2/me`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    res.json({ success: true, user: response.data });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BuyByPi backend running on port ${PORT}`);
});
