const express = require("express");
const router = express.Router();
const Vaccination = require("../models/Vaccination");


// CREATE
router.post("/", async (req, res) => {
  const record = await Vaccination.create(req.body);
  res.json(record);
});

// READ
router.get("/", async (req, res) => {
  const records = await Vaccination.find();
  res.json(records);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const updated = await Vaccination.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Vaccination.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;