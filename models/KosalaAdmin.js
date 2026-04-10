const mongoose = require("mongoose");

const kosalaAdminSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    password: { type: String, required: true },
    kosalaId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("KosalaAdmin", kosalaAdminSchema);