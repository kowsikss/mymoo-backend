// const mongoose = require("mongoose");

// const gaushalaSchema = new mongoose.Schema(
//   {
//     name: String,
//     address: String,
//     pincode: Number,
//     registrationNumber: String,
//     certificateFile: String,
//     contactNumber: String,
//     email: String,
//     doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Gaushala", gaushalaSchema);
const mongoose = require("mongoose");

const gaushalaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: Number, required: true },
    registrationNumber: { type: String, required: true },
    certificateFile: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    admin: { type: String, default: null }, 
    lat: { type: Number, default: null },
lon: { type: Number, default: null },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gaushala", gaushalaSchema);