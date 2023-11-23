const mongoose = require("mongoose");
const connection = mongoose.connection;
const { User } = require("../models/user.model");
const ENV = process.env.NODE_ENV || "development";
const data = require(`./data/data.${ENV}.json`);

const seed = async () => {
  try {
    if (!mongoose.connection.readyState){
      throw new Error('Must connect to database before running seed function')
    }
    await connection.collection("users").drop();
    await User.insertMany(data);
  } catch (error) {
    console.error(error);
  }
};

module.exports = seed;
