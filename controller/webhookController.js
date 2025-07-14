const jwt = require("jsonwebtoken");
const googleClient = require("../config/googleClient");

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuf9Z+KcQwCIKWfhTOyfy
dLuKkKVSdXInUTLqU3juUX4Ulg7un1YhdHnpSZPKu/ztmLzz+fITQfKuiNCRB7S1
2X5paU0IvXRBhP0wHGoFpCuyjQTZb1UMON339GPpbVEVld/zDGdMpG29Z0yioqw7
dnjAkUKF02haObVGOWARr8z3FrBz+PRYkfLo7PlPYY0cFoQkqTM3raHe7CaSUUfK
KnzKCIVPrkGLix+r/gsXaBLqW9AraIf0MKN3HUrehcK78iQc/D2sJOiNhwCO2pod
ZM5arJc3JHHFWFF6N32E9Cg8E1DVyBLdf37qFVIkSkd6KjdzsS6yGHUp1m8NQjMZ
IwIDAQAB
-----END PUBLIC KEY-----`;

exports.handleWebhook = async (req, res) => {
  const token = req.body;
  let event, eventData;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    console.log("Google user info:", payload);

    event = {
      eventType: "AppInstalled",
      instanceId: payload.sub,
      data: JSON.stringify({ email: payload.email, name: payload.name }),
    };
    eventData = { email: payload.email, name: payload.name };

    console.log(`AppInstalled event received with data:`, eventData);
    console.log(`App instance ID:`, event.instanceId);

    return res.status(200).send("Google user processed!");
  } catch (googleErr) {
    try {
      const rawPayload = jwt.verify(token, PUBLIC_KEY);
      event = JSON.parse(rawPayload.data);
      eventData = JSON.parse(event.data);

      switch (event.eventType) {
        case "AppInstalled":
          console.log(`AppInstalled event received with data:`, eventData);
          console.log(`App instance ID:`, event.instanceId);
          break;
        default:
          console.log(`Unknown event type: ${event.eventType}`);
          break;
      }

      return res.status(200).send("Custom JWT processed!");
    } catch (jwtErr) {
      console.error("Token verification failed:", jwtErr.message);
      return res.status(400).send(`Webhook error: ${jwtErr.message}`);
    }
  }
};
