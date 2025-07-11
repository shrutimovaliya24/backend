const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const app = express();

const PUBLIC_KEY = fs.readFileSync('public.key', 'utf8');
app.use(express.json()); 

app.get('/webhook', (req, res) => {
  res.send('This is the webhook endpoint. Use POST to send data.');
});

app.post('/webhook', (request, response) => {
  console.log('Request body:', request.body);
  const token = request.body.token;
  if (!token) {
    return response.status(400).send('Webhook error: jwt must be provided');
  }
  try {
    const rawPayload = jwt.verify(token, PUBLIC_KEY);
    const event = JSON.parse(rawPayload.data);
    const eventData = JSON.parse(event.data);
    console.log('Event:', event);
    console.log('Event Data:', eventData);
    response.status(200).send('Webhook received!');
  } catch (err) {
    response.status(400).send(`Webhook error: ${err.message}`);
  }
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(3000, () => console.log('Server started on port 3000'));
