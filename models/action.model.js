const Joi = require("jsonwebtoken");
const mongoose = require("mongoose");

const actionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  isDone: { type: Boolean, required: true },
  value: { type: Number },
  unit: { type: String, minlength: 3, maxlength: 20 },
});

const Action = mongoose.model("Action", actionSchema);

const validateAction = (action) => {
  const schema = new Joi.object({
    date: Joi.date().less("now").required(),
    isDone: Joi.boolean().required(),
    value: Joi.number().min(0),
    unit: Joi.string().min(3).max(20),
  });
  return schema.validate(action);
};

module.exports = { Action, actionSchema, validateAction };
