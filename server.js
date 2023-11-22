const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const authRouter = require("./routes/auth.route");
const registerRouter = require("./routes/register.route");
const app = express();
const PORT = 3000;

mongoose
  .connect("mongodb://localhost/habit-hero")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(cors());

app.use(express.json());

app.use("/auth", authRouter);
app.use("/register", registerRouter);

app.all("*", (req, res) => {
  res.status(404).send("Sorry, that page does not exist");
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
