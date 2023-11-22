const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/user.model");

const auth = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({ error: "Invalid email or password" });
  }
  
  try {
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).send({ error: "Invalid email or password" });
    }
    const { accessToken, refreshToken } = user.generateTokens();
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.send({ message: "User authenticated", accessToken });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = auth;
