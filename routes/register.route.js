const express = require("express");
const registerUser = require("../controllers/register.controller");
const registerRouter = express.Router();

registerRouter.post("/", registerUser);

module.exports = registerRouter;