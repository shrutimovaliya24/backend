const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAszLIxUngan7ql2Zp6L9n
ORLzBLdn/jpaLwb8UYUftl6lVeXYcpK1VSmuTb3tFGTW1DnKLg63cRtPk5ynw4bE
/6W8JXqXP1D9UThdNRTbge8FpJqRcQBP3xDmTcdwTw/nw/tgqArFBn4UBQgwSi3C
YrifLeKv3aa+5UZAHGLVcTXdb7Tej0CeKg0G/C64MHqCMoTgx0QBqoTthXDId7Jp
JcUii9ZPHi739FQBDmqKunfBbgWEULHLSVD/bbrxEh51rnSsUX4r/tJVuByrq+wt
hL72V8jKEqHNMRgVdIpCA7SA1GM1TEOnsn+/Fg0QBFOLKrCkScpHCbLneO1pWKtr
WQIDAQAB
-----END PUBLIC KEY-----
`;

app.post('/webhook', express.text(), (request, response) => {
  let event;
  let eventData;

  try {
    const rawPayload = jwt.verify(request.body, PUBLIC_KEY);
    event = JSON.parse(rawPayload.data);
    eventData = JSON.parse(event.data);
  } catch (err) {
    console.error(err);
    response.status(400).send(`Webhook error: ${err.message}`);
    return;
  }

  switch (event.eventType) {
    case "AppInstalled":
      console.log(`AppInstalled event received with data:`, eventData);
      console.log(`App instance ID:`, event.instanceId);

      // Example: Log installation to a file
      const fs = require('fs');
      const logEntry = `App installed at ${new Date().toISOString()} with instanceId: ${event.instanceId}\n`;
      fs.appendFileSync('installations.log', logEntry);

      // You can add more actions here, such as sending an email or saving to a database

      break;
    default:
      console.log(`Received unknown event type: ${event.eventType}`);
      break;
  }

  response.status(200).send();
});

app.get('/webhook', (req, res) => {
  res.send('This is the webhook endpoint. Use POST to send data.');
});

app.get('/', (req, res) => {
  res.send('Server is running !');
});

app.listen(3000, () => console.log('Server started on port 3000'));
