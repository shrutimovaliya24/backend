const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // or express.text() if Wix sends plain text

app.post('/webhook', (req, res) => {
  console.log('Wix webhook received:', req.body);
  res.status(200).send('Webhook received!');
});

app.listen(3000, () => console.log('Server running on port 3000'));
