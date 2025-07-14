const express = require("express");
const cors = require("cors");
const webhookRoute = require("./routes/webhook");

const app = express();

app.use(cors({
  origin: "https://fronted-git-main-shrutimovaliya24-gmailcoms-projects.vercel.app"
}));

app.use(express.text());

app.use("/", webhookRoute);

app.listen(3000, () => console.log("Server running"));
