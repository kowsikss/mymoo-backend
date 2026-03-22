const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  username: String,
  address: String,
  city: String,
  gender: String,
  email: String,
});

module.exports = mongoose.model("Profile", profileSchema);