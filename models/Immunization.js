const mongoose = require("mongoose");

const immunizationSchema = new mongoose.Schema(
  {
    cowId: String,
    date: String,
    drug: String,
    dosage: String,
    description: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Immunization", immunizationSchema);