// models/GaushalaRequest.js
const mongoose = require("mongoose");

const gaushalaRequestSchema = new mongoose.Schema(
  {
    kosalaName:         { type: String, required: true },
    location:           { type: String, required: true },  // stores "address" from frontend
    pincode:            { type: String, required: true },
    registrationNumber: { type: String, default: null },
    contactNumber:      { type: String, default: null },
    certificateFile:    { type: String, default: null },
    email:              { type: String, required: true },
    adminName:          { type: String, required: true },
    password:           { type: String, required: true },
    status:             { type: String, default: "pending" }, // pending / approved / rejected
    lat:                { type: Number, default: null },
    lon:                { type: Number, default: null },
    approvedAt:         { type: Date,   default: null },
    rejectedAt:         { type: Date,   default: null },
    rejectedReason:     { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GaushalaRequest", gaushalaRequestSchema);