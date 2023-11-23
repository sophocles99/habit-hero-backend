const mongoose = require("mongoose");
const connection = mongoose.connection;
const { User } = require("../models/user.model");
const ENV = process.env.NODE_ENV || "development";
const data = require(`./data/data.${ENV}.json`);

const seed = async () => {
  try {
    await connection.collection("users").drop();
    await User.insertMany(data);
  } catch (error) {
    console.error(error);
  }
};

module.exports = seed;
