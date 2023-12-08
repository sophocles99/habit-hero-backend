const { User } = require("../models/user.model");

const getHabitsByUserId = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  if (!user) {
    return res.status(404).send({ errorMessage: "User with that id not found" });
  }
  res.send({ habits: user.habits });
};

module.exports = { getHabitsByUserId };
