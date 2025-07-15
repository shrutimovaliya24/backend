require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRouter = require("./routes/auth");
const eventsRouter = require("./routes/events");

const app = express();

// 1) Only allow your frontend origin:
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    methods: ["POST"],
  })
);

// 2) Parse both JSON and raw text:
app.use(express.json());
app.use(express.text({ type: "text/plain" }));

// 3) Mount routes:
app.use("/auth", authRouter);
app.use("/events", eventsRouter);

// 4) Global error handler (optional):
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal server error");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
