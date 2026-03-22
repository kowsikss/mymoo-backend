const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");

// GET ALL
router.get("/", async (req, res) => {
  try {
    const records = await Inventory.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET BY KOSALA ID
router.get("/kosala/:kosalaId", async (req, res) => {
  try {
    const records = await Inventory.find({ kosalaId: req.params.kosalaId }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const record = new Inventory(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    console.error("Error saving inventory:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;