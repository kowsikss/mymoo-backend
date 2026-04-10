const express = require("express");
const router  = express.Router();
const KosalaAdmin = require("../models/KosalaAdmin");

// GET ALL
router.get("/", async (req, res) => {
  try {
    const admins = await KosalaAdmin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET BY KOSALA ID
router.get("/kosala/:kosalaId", async (req, res) => {
  try {
    const admin = await KosalaAdmin.findOne({ kosalaId: req.params.kosalaId });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const { name, password, kosalaId } = req.body;
    if (!name || !password || !kosalaId) {
      return res.status(400).json({ message: "All fields required" });
    }
    const admin = await KosalaAdmin.create({ name, password, kosalaId });
    res.status(201).json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { name, password, kosalaId } = req.body;
    if (!name || !password || !kosalaId) {
      return res.status(400).json({ message: "All fields required" });
    }
    const admin = await KosalaAdmin.findOne({ name, password, kosalaId });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await KosalaAdmin.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;