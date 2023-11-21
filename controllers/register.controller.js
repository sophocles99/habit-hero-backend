const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/user.model");

const registerUser = async (req, res) => {
  const error = validateUser(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  const { username, email, password } = req.body;
  let user = User.findOne({ username });
  if (user) {
    return res.status(400).send({ error: "Username already in use" });
  }
  user = User.findOne({ email });
  if (user) {
    return res.status(400).send({ error: "Email already in use" });
  }

  user = new User({ username, email, password });
  try {
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    const token = user.generateAuthToken();
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }

  res.send(`User ${username} registered`);
};

module.exports = registerUser;
