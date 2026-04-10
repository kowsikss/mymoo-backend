const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name:            { type: String, required: true },
    mobile:          { type: String, required: true },
    specialization:  { type: String, required: true },
    email:           { type: String, required: true },
    nearbyHospital:  { type: String, required: true },
    hospitalPincode: { type: Number, required: true },
    resetToken:        { type: String, default: null },
    resetTokenExpiry:  { type: Date,   default: null },

    // ✅ FIXED: String not ObjectId — kosalaId comes as string from frontend
    kosalaId: { type: String, required: true },

    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);