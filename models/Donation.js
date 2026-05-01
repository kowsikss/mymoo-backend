const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    kosalaId:    { type: String, required: true },
    kosalaName:  { type: String, required: true },
    donorName:   { type: String, required: true },
    donorEmail:  { type: String, required: true },
    donorPhone:  { type: String, required: true },
    amount:      { type: Number, required: true },
    message:     { type: String, default: "" },
    paymentId:   { type: String, default: "MANUAL" },
    status:      { type: String, default: "completed" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);