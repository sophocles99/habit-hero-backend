const bcrypt = require("bcrypt");
const { User, validateUser } = require("../../models/user.model");

const register = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res.status(409).send({ error: "Email already in use" });
  }

  user = new User({ email, password });
  try {
    await user.hashPassword();
    await user.save();
    const { accessToken, refreshToken } = user.generateTokens();
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).send({ message: "New user registered", accessToken });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = register;
