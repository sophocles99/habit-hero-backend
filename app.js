const cors = require("cors");
const express = require("express");
const authRouter = require("./routes/auth.route");
const registerRouter = require("./routes/register.route");
const app = express();
require("./db/connection");

app.use(cors());

app.use(express.json());

app.use("/auth", authRouter);
app.use("/register", registerRouter);

app.all("*", (req, res) => {
  res.status(404).send({ error: "Sorry, that page does not exist" });
});

module.exports = app;
