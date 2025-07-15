const express = require("express");
const { handleEvent } = require("../controller/eventController");
const router = express.Router();

router.post("/", handleEvent);

module.exports = router;
