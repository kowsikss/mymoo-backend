const express = require("express");
const router = express.Router();
const RescuedAnimal = require("../models/RescuedAnimal");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// GET ALL
router.get("/", async (req, res) => {
  try {
    const records = await RescuedAnimal.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET BY KOSALA ID
router.get("/kosala/:kosalaId", async (req, res) => {
  try {
    const records = await RescuedAnimal.find({
      kosalaId: req.params.kosalaId,
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post("/", upload.single("animalPhoto"), async (req, res) => {
  try {
    const newRecord = new RescuedAnimal({
      ...req.body,
      animalPhoto: req.file?.filename || null,
    });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    console.error("Error saving rescued animal:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await RescuedAnimal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Record not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add this route (GET single record by ID)
router.get("/:id", async (req, res) => {
  try {
    const record = await RescuedAnimal.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await RescuedAnimal.findByIdAndDelete(req.params.id);
    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;