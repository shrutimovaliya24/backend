const express = require("express");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.text());

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuf9Z+KcQwCIKWfhTOyfy
dLuKkKVSdXInUTLqU3juUX4Ulg7un1YhdHnpSZPKu/ztmLzz+fITQfKuiNCRB7S1
2X5paU0IvXRBhP0wHGoFpCuyjQTZb1UMON339GPpbVEVld/zDGdMpG29Z0yioqw7
dnjAkUKF02haObVGOWARr8z3FrBz+PRYkfLo7PlPYY0cFoQkqTM3raHe7CaSUUfK
KnzKCIVPrkGLix+r/gsXaBLqW9AraIf0MKN3HUrehcK78iQc/D2sJOiNhwCO2pod
ZM5arJc3JHHFWFF6N32E9Cg8E1DVyBLdf37qFVIkSkd6KjdzsS6yGHUp1m8NQjMZ
IwIDAQAB
-----END PUBLIC KEY-----`;

const GOOGLE_CLIENT_ID = "433398797157-i4d0scs7n5qvkut4q9ru7b7i3v2dsaj1.apps.googleusercontent.com";
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

app.post('/webhook', async (req, res) => {
  const token = req.body;
  let event, eventData;

  // Try to verify as Google ID token first
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // You can now use Google user info in payload
    console.log("Google user info:", payload);

    // Example: treat Google login as "AppInstalled" event
    event = {
      eventType: "AppInstalled",
      instanceId: payload.sub,
      data: JSON.stringify({ email: payload.email, name: payload.name }),
    };
    eventData = { email: payload.email, name: payload.name };

    // Handle your event here
    console.log(`AppInstalled event received with data:`, eventData);
    console.log(`App instance ID:`, event.instanceId);

    return res.status(200).send("Google user processed!");
  } catch (googleErr) {
    // Not a valid Google token, try as your own JWT
    try {
      const rawPayload = jwt.verify(token, PUBLIC_KEY);
      event = JSON.parse(rawPayload.data);
      eventData = JSON.parse(event.data);

      switch (event.eventType) {
        case "AppInstalled":
          console.log(`AppInstalled event received with data:`, eventData);
          console.log(`App instance ID:`, event.instanceId);
          // handle your event here
          break;
        default:
          console.log(`Received unknown event type: ${event.eventType}`);
          break;
      }

      return res.status(200).send("Custom JWT processed!");
    } catch (jwtErr) {
      console.error("Token verification failed:", jwtErr.message);
      return res.status(400).send(`Webhook error: ${jwtErr.message}`);
    }
  }
});

app.listen(3000, () => console.log("Server started on port 3000"));