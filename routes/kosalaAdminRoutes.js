// routes/kosalaAdminRoutes.js
const express = require("express");
const bcrypt  = require("bcryptjs");
const router  = express.Router();
const KosalaAdmin = require("../models/KosalaAdmin");

// ── GET ALL ───────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const admins = await KosalaAdmin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET BY KOSALA ID ──────────────────────────────────────────
router.get("/kosala/:kosalaId", async (req, res) => {
  try {
    const admin = await KosalaAdmin.findOne({ kosalaId: req.params.kosalaId });
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
    const admin = await KosalaAdmin.create({ name, password, kosalaId });
    res.status(201).json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── LOGIN ─────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { name, adminName, password, kosalaId } = req.body;
    const adminNameValue = name || adminName;

    console.log("🔐 Login attempt:", {
      adminName: adminNameValue,
      kosalaId,
      passwordLength: password?.length,
    });

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

    // Check password — handle BOTH plaintext (old) and bcrypt (new)
    let isMatch = false;

    // Try bcrypt first (for new accounts)
    try {
      isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        console.log("✅ Bcrypt password match (new account)");
      }
    } catch (err) {
      // bcrypt.compare fails on plaintext passwords — that's fine
    }

    // If bcrypt fails, try direct comparison (for old plaintext accounts)
    if (!isMatch && password === admin.password) {
      isMatch = true;
      console.log("✅ Plaintext password match (old account) — CONSIDER MIGRATING TO BCRYPT");
    }

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