const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { OAuth2Client } = require('google-auth-library');
const app = express();

const PUBLIC_KEY = fs.readFileSync('public.key', 'utf8');
app.use(express.json()); 

const CLIENT_ID = '433398797157-i4d0scs7n5qvkut4q9ru7b7i3v2dsaj1.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

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

app.post('/webhook/google-auth', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // Do something with the user info in payload
    res.json({ status: 'success', user: payload });
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(3000, () => console.log('Server started on port 3000'));
