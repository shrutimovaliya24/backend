const express = require("express");
const { handleGoogleSignIn } = require("../controller/authController");
const router = express.Router();

router.post("/google", handleGoogleSignIn);

module.exports = router;
