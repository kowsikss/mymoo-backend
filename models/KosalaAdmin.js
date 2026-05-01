// models/KosalaAdmin.js
const mongoose = require("mongoose");

const kosalaAdminSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, default: null },   // ✅ added — needed for login
    password: { type: String, required: true },
    kosalaId: { type: String, required: true },
    role:     { type: String, default: "kosala-admin" }, // ✅ added
  },
  { timestamps: true }
);

module.exports = mongoose.model("KosalaAdmin", kosalaAdminSchema);