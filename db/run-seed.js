const mongoose = require("mongoose");
require("./connection");
const seed = require("./seed");

seed().then(() => {
  mongoose.connection.close();
});
