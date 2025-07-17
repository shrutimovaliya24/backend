const jwt = require("jsonwebtoken");
const Events = require('../models/events');
const PUBLIC_KEY = process.env.EVENTS_PUBLIC_KEY;

exports.handleEvent = (req, res) => {
  const { token, type } = req.body;
  if (!token || !type) {
    return res.status(400).send("Missing token or type");
  }

  try {
    const payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });
    if (!payload.data) throw new Error("No data field");
    
    const event = typeof payload.data === "string" ? JSON.parse(payload.data) : payload.data;
    const eventData = typeof event.data === "string" ? JSON.parse(event.data) : event.data;

    switch (event.eventType) {
      case "AppInstalled":
        Events.create(event.eventType, event.instanceId, eventData, (err, results) => {
          if (err) {
            console.error('Error inserting event into DB:', err);
            return res.status(500).send('Database error');
          }
          console.log('Event inserted with ID:', results.insertId);
          return res.status(200).send("Event processed and stored");
        });
        return;
      default: 
        console.warn("Unhandled eventType:", event.eventType);
    }

    return res.send("Event processed");
  } catch (err) {
    console.error("Event processing error:", err.message);
    return res.status(400).send(`Invalid event token: ${err.message}`);
  }
};
