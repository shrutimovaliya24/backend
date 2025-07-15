const express = require("express");
const router = express.Router();
const { handleWebhook } = require("../controller/webhookController");

router.post('/', (req, res) => {
    res.json({ message: 'Webhook received!' });
  });
  

module.exports = router;
