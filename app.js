const cors = require("cors");
const express = require("express");
const apiRouter = require("./routes/api.route");
const userRouter = require("./routes/user.route");
const app = express();
require("./db/connection");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use("/user", userRouter);

app.all("*", (req, res) => {
  res.status(404).send({ errorMessage: "Sorry, that page does not exist" });
});

module.exports = app;
