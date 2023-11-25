const express = require("express");
const habitRouter = express.Router();
const auth = require("../middleware/auth");
const { getHabitsByUserId } = require("../controllers/habit.controller");

habitRouter.get("/", auth, getHabitsByUserId);

module.exports = habitRouter;
