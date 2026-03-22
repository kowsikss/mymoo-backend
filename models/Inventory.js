const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    kosalaId:     { type: String, required: true },
    type:         { type: String, enum: ["feed", "medicine", "semen"], required: true },
    date:         { type: String, required: true },

    // Feed fields
    feedType:     { type: String },
    gunnyBags:    { type: Number },
    weightPerBag: { type: Number },
    supplier:     { type: String },

    // Medicine fields
    medicineName: { type: String },
    drugName:     { type: String },
    quantity:     { type: Number },
    unit:         { type: String },

    // Semen fields
    breedName:    { type: String },
    strawCount:   { type: Number },
    batchNumber:  { type: String },

    // Shared
    expiryDate:   { type: String },
    notes:        { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);