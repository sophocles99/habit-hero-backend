const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/user.model");

const registerUser = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  const { username, email, password } = req.body;
  let user = await User.findOne({ username });
  if (user) {
    console.log(user)
    return res.status(400).send({ error: "Username already in use" });
  }
  user = await User.findOne({ email });
  if (user) {
    return res.status(400).send({ error: "Email already in use" });
  }

  user = new User({ username, email, password });
  try {
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    // send access and refresh tokens for newly-registered user
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.send({message: `User ${username} registered`, accessToken });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = registerUser;
