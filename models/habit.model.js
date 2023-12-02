const Joi = require("joi");
const mongoose = require("mongoose");
const { actionSchema } = require("./action.model");

const habitSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, maxlength: 20, required: true },
  description: { type: String, minlength: 3, maxlength: 50 },
  type: { type: String, enum: ["positive", "negative"] },
  actions: [actionSchema],
});

// Don't define Habit model - avoids creating separate empty collection
// const Habit = mongoose.model("Habit", habitSchema);

const validateHabit = (habit) => {
  const schema = new Joi.object({
    name: Joi.string().min(3).max(20).required(),
    description: Joi.string().min(3).max(50),
    type: Joi.string().valid("positive", "negative").required(),
  });
};

// module.exports = { Habit, habitSchema, validateHabit };
module.exports = { habitSchema, validateHabit };
