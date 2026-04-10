// const mongoose = require("mongoose");

// const cowSchema = new mongoose.Schema(
//   {
//     cowId:              { type: String },
//     kosalaId:           { type: String, required: true },
//     type:               { type: String },         // cow / bull
//     breed:              { type: mongoose.Schema.Types.ObjectId, ref: "Breed" },

//     age:                { type: Number },
//     ageUnit:            { type: String, default: "years" }, // years / months
//     calfStatus:         { type: String },         // Bull Calf / Heifer
//     weight:             { type: Number },
//     tagNumber:          { type: String },          // RFID tag

//     registrationDate:   { type: String },

//     // Images
//     frontImage:         { type: String, default: null },
//     sideImage:          { type: String, default: null },
//     backImage:          { type: String, default: null },

//     // Health
//     healthStatus:       { type: String },         // Healthy/Under Treatment/Calved/Deceased
//     monthlyAmountSpent: { type: Number },
//     vaccinationDate:    { type: String },
//     dewormingDate:      { type: String },
//     treatmentDate:      { type: String },

//     // Disease
//     hasDisease:         { type: String },         // Yes / No
//     diseaseName:        { type: String },
//     diseaseDate:        { type: String },

//     // Insurance
//     insuranceStatus:    { type: String },         // Yes / No
//     insuranceCert:      { type: String, default: null },

//     // Feed
//     feedType:           { type: String },
//     feedAmountKg:       { type: Number },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Cow", cowSchema);
const mongoose = require("mongoose");

const cowSchema = new mongoose.Schema(
  {
    cowId:              { type: String },
    kosalaId:           { type: String, required: true },
    type:               { type: String },
    breed:              { type: mongoose.Schema.Types.ObjectId, ref: "Breed" },
    age:                { type: Number },
    ageUnit:            { type: String, default: "years" },
    calfStatus:         { type: String },
    weight:             { type: Number },
    tagNumber:          { type: String },
    registrationDate:   { type: String },
    frontImage:         { type: String, default: null },
    sideImage:          { type: String, default: null },
    backImage:          { type: String, default: null },
    healthStatus:       { type: String },
    monthlyAmountSpent: { type: Number },
    vaccinationDate:    { type: String },
    dewormingDate:      { type: String },
    treatmentDate:      { type: String },
    hasDisease:         { type: String },
    diseaseName:        { type: String },
    diseaseDate:        { type: String },
    insuranceStatus:    { type: String },
    insuranceCert:      { type: String, default: null },
    feedType:           { type: String },
    feedAmountKg:       { type: Number },
    // ✅ new fields for mortality tracking
    dateOfDeath:        { type: String, default: null },
    causeOfDeath:       { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cow", cowSchema);