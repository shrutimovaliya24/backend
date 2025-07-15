const jwt = require("jsonwebtoken");

const PUBLIC_KEY = process.env.EVENTS_PUBLIC_KEY;

exports.handleEvent = (req, res) => {
  const { token, type } = req.body;
  if (!token || !type) {
    return res.status(400).send("Missing token or type");
  }

  try {
    const payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });
    if (!payload.data) throw new Error("No data field");
    const event = JSON.parse(payload.data);

    switch (event.eventType) {
      case "AppInstalled":
        console.log("AppInstalled:", event.instanceId, event.data);
        break;
      default:
        console.warn("Unhandled eventType:", event.eventType);
    }

    return res.send("Event processed");
  } catch (err) {
    console.error("Event processing error:", err.message);
    return res.status(400).send(`Invalid event token: ${err.message}`);
  }
};
