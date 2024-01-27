const bcrypt = require("bcrypt");
const { User, validateEmail, validateUser } = require("../models/users.model");

const checkEmail = async (req, res) => {
  const { email } = req.body;
  const { error } = validateEmail(email);
  if (error) {
    return res.status(400).send({ errorMessage: error.details[0].message });
  }
  let user = await User.findOne({ email });
  if (user) {
    return res
      .status(409)
      .send({ errorMessage: "Email address is already registered" });
  }
  return res.send({ message: "Email address is available" });
};

const register = async (req, res) => {
  const { email } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res
      .status(409)
      .send({ errorMessage: "Email address is already registered" });
  }

  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send({ errorMessage: error.details[0].message });
  }

  const { name, password } = req.body;
  user = new User({ email, name, password });

  try {
    await user.hashPassword();
    await user.save();
    res.status(201).send({ message: "New user registered" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ errorMessage: error.message });
  }
};

const login = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send({ errorMessage: error.details[0].message });
  }

  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({ errorMessage: "Invalid email or password" });
  }

  try {
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(400)
        .send({ errorMessage: "Invalid email or password" });
    }
    const { accessToken, refreshToken } = user.generateTokens();
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.send({ message: "User logged in", accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ errorMessage: error.message });
  }
};

module.exports = { checkEmail, register, login };
