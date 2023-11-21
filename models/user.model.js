const Joi = require("joi");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
