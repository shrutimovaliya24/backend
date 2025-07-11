const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('private.key', 'utf8');

const payload = {
  data: JSON.stringify({
    eventType: "AppInstalled",
    data: JSON.stringify({ foo: "bar" }),
    instanceId: "test-instance-123"
  })
};

const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
console.log(token);
