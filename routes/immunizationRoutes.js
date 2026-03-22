const express = require("express");
const router = express.Router();
const Immunization = require("../models/Immunization");


// CREATE
router.post("/", async (req, res) => {
  const record = await Immunization.create(req.body);
  res.json(record);
});

// READ
router.get("/", async (req, res) => {
  const records = await Immunization.find();
  res.json(records);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const updated = await Immunization.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Immunization.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;