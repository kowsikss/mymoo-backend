const mongoose = require("mongoose");

const vaccinationSchema = new mongoose.Schema(
  {
    cowId: String,
    date: String,
    vaccine: String,
    dosage: String,
    description: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vaccination", vaccinationSchema);