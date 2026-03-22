const express = require("express");
const router = express.Router();
const CattleInfo = require("../models/CattleInfo");

// GET ALL
router.get("/", async (req, res) => {
  try {
    const data = await CattleInfo.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET BY KOSALA ID
router.get("/kosala/:id", async (req, res) => {
  try {
    const data = await CattleInfo.find({
      kosalaId: req.params.id,
    }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE BY ID
router.get("/:id", async (req, res) => {
  try {
    const data = await CattleInfo.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Record not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    console.log("Cattle info POST body:", req.body);
    const data = new CattleInfo(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (err) {
    console.error("Error saving cattle info:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await CattleInfo.findByIdAndUpdate(
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

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await CattleInfo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;