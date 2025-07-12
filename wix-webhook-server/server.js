const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;

const PUBLIC_KEY = fs.readFileSync("public.pem", "utf8");

app.post("/webhook", express.text(), (req, res) => {
  try {
    const decoded = jwt.verify(req.body, PUBLIC_KEY);
    const event = JSON.parse(decoded.data);
    const eventData = JSON.parse(event.data);

    console.log("✅ JWT verified!");
    console.log("Event Type:", event.eventType);
    console.log("Data:", eventData);

    res.status(200).send("Webhook received");
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    res.status(400).send(`Webhook error: ${err.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
