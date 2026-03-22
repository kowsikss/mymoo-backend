const mongoose = require("mongoose");

const breedSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  type: String // cow or bull
},);

module.exports = mongoose.model("Breed", breedSchema);