const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync("private.key", "utf8");

const event = {
  eventType: "AppInstalled",
  data: JSON.stringify({
    siteId: "mysite123",
    userId: "user5678"
  }),
  instanceId: "abcde123"
};

const payload = {
  data: JSON.stringify(event)
};

const token = jwt.sign(payload, privateKey, { algorithm: "RS256" });

console.log("\n✅ JWT Generated:\n");
console.log(token);
