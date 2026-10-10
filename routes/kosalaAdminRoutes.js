// routes/kosalaAdminRoutes.js
const express = require("express");
const router  = express.Router();
const KosalaAdmin = require("../models/KosalaAdmin");
const { hashPassword, verifyPassword } = require("../utils/password");

// ── GET ALL ───────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const admins = await KosalaAdmin.find().select("-password");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET BY KOSALA ID ──────────────────────────────────────────
router.get("/kosala/:kosalaId", async (req, res) => {
  try {
    const admin = await KosalaAdmin.findOne({ kosalaId: req.params.kosalaId }).select("-password");
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CREATE ────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { name, password, kosalaId } = req.body;
    if (!name || !password || !kosalaId) {
      return res.status(400).json({ message: "All fields required" });
    }
    const admin = await KosalaAdmin.create({ name, password: await hashPassword(password), kosalaId });
    const adminData = admin.toObject();
    delete adminData.password;
    res.status(201).json(adminData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── LOGIN ─────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { name, adminName, password, kosalaId } = req.body;
    const adminNameValue = name || adminName;

    if (!adminNameValue || !password || !kosalaId) {
      return res.status(400).json({ message: "Admin name, password, and gaushala are required" });
    }

    // Find admin
    const admin = await KosalaAdmin.findOne({
      name: adminNameValue,
      kosalaId: kosalaId,
    });

    if (!admin) {
      console.log("❌ No admin found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("✅ Admin found:", admin.name);

    const isMatch = await verifyPassword(password, admin.password);

    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("✅ Login successful");

    res.json({
      _id:      admin._id,
      name:     admin.name,
      email:    admin.email,
      kosalaId: admin.kosalaId,
      role:     admin.role || "kosala-admin",
    });

  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE ────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    await KosalaAdmin.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;