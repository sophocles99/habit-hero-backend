const cors = require("cors");
const express = require("express");
const apiRouter = require("./routes/api.router");
const app = express();
require("./db/connection");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ errorMessage: "Resource not found" });
});

module.exports = app;
