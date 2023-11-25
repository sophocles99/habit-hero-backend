const express = require("express");
const habitRouter = express.Router();
const { getHabitsByUserId } = require("../controllers/habit.controller");

habitRouter.get("/", getHabitsByUserId);

module.exports = habitRouter;
