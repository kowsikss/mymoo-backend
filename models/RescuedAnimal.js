const mongoose = require("mongoose");

const rescuedAnimalSchema = new mongoose.Schema(
  {
    kosalaId: { type: String, required: true },
    dateOfRescued: { type: String, required: true },
    sex: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    ownerName: { type: String, required: true },
    ownerAddress: { type: String, required: true },
    ownerMobile: { type: String, required: true },
    ownerAadhar: { type: String, required: true },
    animalPhoto: { type: String, default: null },
    reasonOfAdoption: { type: String, default: "" },
    tagNumber: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RescuedAnimal", rescuedAnimalSchema);