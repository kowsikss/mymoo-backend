const mongoose = require("mongoose");

const reproductionSchema = new mongoose.Schema({

  // ✅ Changed from ObjectId to String — cowId is "Cow-1003" format
  cowId: {
    type: String,
    required: true,
  },

  // ✅ Changed from ObjectId to String — kosalaId comes from localStorage as string
  kosalaId: {
    type: String,
    required: true,
  },

  inseminationDate: { type: String, default: "" },
  strawDetails:     { type: String, default: "" },
  pregnancyDate:    { type: String, default: "" },
  pregnancyStatus:  { type: String, default: "" },
  lastCalvingDate:  { type: String, default: "" },
  gestationDate:    { type: String, default: "" },
  trialCount:       { type: Number, default: 0 },
  calvingTime:      { type: String, default: "" }, // ✅ String not Number ("Morning"/"06:00")
  parturitionDate:  { type: String, default: "" },
  calfStatus:       { type: String, default: "" },
  calfSex:          { type: String, default: "" },
  milkYield:        { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model("Reproduction", reproductionSchema);