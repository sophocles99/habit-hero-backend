const Joi = require("joi");
const mongoose = require("mongoose");
const { actionSchema } = require("./action.model");

const habitSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, maxlength: 20, required: true },
  type: { type: String, enum: ["positive", "negative", "value"] },
  actions: [actionSchema],
});

const Habit = mongoose.model("Habit", habitSchema);

const validateHabit = (habit) => {
  const schema = new Joi.object({
    name: Joi.string().min(3).max(20).required(),
    type: Joi.string().valid("positive", "negative", "value").required(),
  });
};

module.exports = { Habit, habitSchema, validateHabit };
