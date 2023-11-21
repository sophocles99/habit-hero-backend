const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 60,
  },
});

userSchema.methods.generateAccessToken = function () {
  jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });
};

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().alphanum.min(5).max(20).required(),
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(8).max(60).required(),
  });
  return schema.validate(user);
};

module.exports = { User, validateUser };
