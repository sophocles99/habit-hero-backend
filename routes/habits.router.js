const express = require("express");
const habitsRouter = express.Router();
const { getHabitsByUserId } = require("../controllers/habits.controller");

habitsRouter.get("/", getHabitsByUserId);

module.exports = habitsRouter;
