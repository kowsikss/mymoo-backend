const express = require("express");
const router  = express.Router();
const Doctor  = require("../models/Doctor");
const KosalaAdmin = require("../models/KosalaAdmin");

/* =========================
   GET /profile
   Returns current logged-in user's data
========================= */
router.get("/", async (req, res) => {
  try {
    const role = req.query.role;
    const id   = req.query.id;

    if (!role || !id) {
      return res.status(400).json({ message: "role and id are required" });
    }

    let user;
    if (role === "doctor") {
      user = await Doctor.findById(id).select("-password");
    } else if (role === "kosala-admin") {
      user = await KosalaAdmin.findById(id).select("-password");
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   PUT /profile
   Updates the actual Doctor or KosalaAdmin document
========================= */
router.put("/", async (req, res) => {
  try {
    const { role, id, name, email, mobile } = req.body;

    if (!role || !id) {
      return res.status(400).json({ message: "role and id are required" });
    }

    let updated;
    if (role === "doctor") {
      updated = await Doctor.findByIdAndUpdate(
        id,
        { name, email, mobile },
        { new: true }
      ).select("-password");
    } else if (role === "kosala-admin") {
      updated = await KosalaAdmin.findByIdAndUpdate(
        id,
        { name, email, mobile },
        { new: true }
      ).select("-password");
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json(updated);
  } catch (err) {
    console.error("Update profile error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;