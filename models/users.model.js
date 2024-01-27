const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { habitSchema } = require("./habits.model");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 6,
    maxlength: 254,
    required: true,
    unique: true,
  },
  password: { type: String, minlength: 8, maxlength: 60, required: true },
  name: { type: String, minlength: 2, maxlength: 20 },
  habits: [habitSchema],
});

userSchema.methods.hashPassword = async function () {
  this.password = await bcrypt.hash(this.password, 10);
};

userSchema.methods.generateTokens = function () {
  const accessToken = jwt.sign(
    { _id: this._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1m",
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

const validateEmail = (email) => {
  const schema = Joi.string().required().empty("").email().messages({
    "any.required": "Email is required",
    "any.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  });
  return schema.validate(email);
};

const validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().required().empty("").email().messages({
      "any.required": "Email is required",
      "any.empty": "Email is required",
      "string.email": "Email must be a valid email address",
    }),
    password: Joi.string()
      .required()
      .empty("")
      .min(8)
      .max(30)
      .pattern(/[a-z]+/)
      .message({
        "string.pattern.base":
          "Password must include at least one lowercase letter",
      })
      .pattern(/[A-Z]+/)
      .message({
        "string.pattern.base":
          "Password must include at least one uppercase letter",
      })
      .pattern(/[0-9]+/)
      .message({
        "string.pattern.base": "Password must include at least one digit",
      })
      .messages({
        "any.required": "Password is required",
        "any.empty": "Password is required",
        "string.min": "Password must be at least eight characters long",
        "string.max": "Password must not be more than 30 characters long",
      }),
    name: Joi.string()
      .min(2)
      .message("Name must be at least two characters long")
      .max(20)
      .message("Name must not be more than 20 characters long"),
  });
  return schema.validate(user);
};

module.exports = { User, validateEmail, validateUser };
