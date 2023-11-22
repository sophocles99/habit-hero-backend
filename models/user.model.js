const Joi = require("joi");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { habitSchema } = require("./habit.model");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    unique: true,
  },
  password: { type: String, minlength: 8, maxlength: 60, required: true },
  habits: { type: [habitSchema], default: [] },
});

userSchema.methods.generateTokens = function () {
  const accessToken = jwt.sign(
    { _id: this._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30s",
    }
  );
  const refreshToken = jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return { accessToken, refreshToken };
};

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(8).max(60).required(),
  });
  return schema.validate(user);
};

module.exports = { User, validateUser };
