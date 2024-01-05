const express = require("express");
const apiRouter = express.Router();
const authenticate = require("../middleware/authenticate");
const { getHabitsByUserId } = require("../controllers/habit.controller");

const endpoints = require("../endpoints.json");

apiRouter.get("/habits", authenticate, getHabitsByUserId);
apiRouter.get("/", (req, res) => res.send({ endpoints }));

module.exports = apiRouter;
