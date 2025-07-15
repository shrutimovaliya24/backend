const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.handleGoogleSignIn = async (req, res) => {
  const token = typeof req.body === "string" ? req.body.trim() : req.body.token;

  if (!token) {
    return res.status(400).send("Missing Google ID token");
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const appJwt = jwt.sign(
      { sub: payload.sub, email: payload.email, name: payload.name },
      process.env.APP_JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log("Loaded secret:", process.env.APP_JWT_SECRET);
    console.log("Generated JWT token:", appJwt);

    return res.json({ message: "OK", token: appJwt });
  } catch (err) {
    console.error("Google token verify failed:", err.message);
    return res.status(401).send("Invalid Google ID token");
  }
};
