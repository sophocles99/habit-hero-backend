const express = require("express");
const auth = require("../controllers/auth.controller");
const authRouter = express.Router();

authRouter.post("/", auth);

module.exports = authRouter;