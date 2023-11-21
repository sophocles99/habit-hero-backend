const express = require("express");
const authenticate = require("../controllers/authenticate.controller");
const authenticateRouter = express.Router();

authenticateRouter.post("/", authenticate);

module.exports = authenticateRouter;