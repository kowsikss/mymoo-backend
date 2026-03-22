const express = require("express");
const router = express.Router();
const Reproduction = require("../models/Reproduction");

// GET ALL
router.get("/", async (req, res) => {
  try {
    const data = await Reproduction.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("Error fetching reproduction records:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET BY KOSALA ID
router.get("/kosala/:id", async (req, res) => {
  try {
    const data = await Reproduction.find({ kosalaId: req.params.id });
    res.json(data);
  } catch (err) {
    console.error("Error fetching by kosalaId:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE BY ID
router.get("/:id", async (req, res) => {
  try {
    const data = await Reproduction.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Record not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    console.log("Reproduction POST body:", req.body); // debug
    const data = new Reproduction(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (err) {
    console.error("Error saving reproduction:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Reproduction.findByIdAndUpdate(
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
    await Reproduction.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;