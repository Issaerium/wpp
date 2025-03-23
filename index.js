require('dotenv').config();
const wppconnect = require('@wppconnect-team/wppconnect');
const express = require('express');

const app = express();
app.use(express.json());

wppconnect.create({
  session: 'whatsapp-bot',
  catchQR: (base64Qr) => {
    console.log('Scan this QR code to connect:', base64Qr);
  },
  statusFind: (status) => {
    console.log('Session Status:', status);
  },
})
.then(client => {
  console.log('Connected to WhatsApp!');

  client.onMessage(async message => {
    if (message.body.toLowerCase() === 'hi') {
      await client.sendText(message.from, 'Hello! How can I assist you?');
    }
  });

  app.post('/send', async (req, res) => {
    const { number, message } = req.body;
    if (!number || !message) {
      return res.status(400).json({ error: 'Number and message are required' });
    }
    await client.sendText(`${number}@c.us`, message);
    res.json({ status: 'Message sent!' });
  });
})
.catch(error => console.error('Error starting bot:', error));

app.get('/', (req, res) => {
  res.send('WhatsApp Bot is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
});