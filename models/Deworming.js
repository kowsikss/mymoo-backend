const mongoose = require("mongoose");

const dewormSchema = new mongoose.Schema(
  {
    cowId: String,
    date: String,
    drug: String,
    dosage: String,
    description: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deworming", dewormSchema);
