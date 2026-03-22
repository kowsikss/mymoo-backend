const mongoose = require("mongoose");

const cattleInfoSchema = new mongoose.Schema(
  {
    kosalaId:         { type: String, required: true },
    cowId:            { type: String, required: true },
    inseminationDate: { type: String, default: "" },
    strawDetails:     { type: String, default: "" },
    pregnancyDate:    { type: String, default: "" },
    pregnancyStatus:  { type: String, default: "" },
    lastCalvingDate:  { type: String, default: "" },
    gestationDate:    { type: String, default: "" },
    trialDate:        { type: String, default: "" },  // ✅ NEW
    trialCount:       { type: Number, default: 0 },
    calvingTime:      { type: Number, default: 0 },   // ✅ Now Number (1-10)
    parturitionDate:  { type: String, default: "" },
    calfStatus:       { type: String, default: "" },
    calfSex:          { type: String, default: "" },  // ✅ Cow Heifer / Bull Calf
    milkYield:        { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CattleInfo", cattleInfoSchema);