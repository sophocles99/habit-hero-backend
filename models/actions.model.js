const Joi = require("jsonwebtoken");
const mongoose = require("mongoose");

const actionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  isDone: { type: Boolean, required: true },
});

// Don't define Action model - avoids creating separate empty collection
// const Action = mongoose.model("Action", actionSchema);

const validateAction = (action) => {
  const schema = new Joi.object({
    date: Joi.date().less("now").required(),
    isDone: Joi.boolean().required(),
  });
  return schema.validate(action);
};

// module.exports = { Action, actionSchema, validateAction };
module.exports = { actionSchema, validateAction };
