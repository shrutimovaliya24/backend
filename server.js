const express = require("express");
const cors = require("cors");
require("dotenv").config();

const webhookRoute = require("./routes/webhook");

const app = express();

app.use(cors());
app.use(express.text()); // Needed to receive plain text token

app.use("/", webhookRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
