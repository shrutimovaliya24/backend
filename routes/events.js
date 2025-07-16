

const express = require("express");
const router = express.Router();
const { handleEvent } = require("../controller/eventController");


router.post('/', handleEvent);

module.exports = router;
