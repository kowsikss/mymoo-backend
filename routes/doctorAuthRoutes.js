const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

router.post("/login", async (req, res) => {
  try {
    const { name, email, password, kosalaId } = req.body;

    console.log("Login attempt:", { name, email, kosalaId });

    if (!name || !email || !password || !kosalaId) {
      return res.status(400).json({
        message: "Name, email, password and Gaushala are all required",
      });
    }

    // ✅ Step 1: Find doctor by name + email + password
    const doctor = await Doctor.findOne({
      name,
      email,
      password,
    });

    console.log("Doctor found:", doctor);

    if (!doctor) {
      return res.status(400).json({
        message: "Invalid credentials — check name, email and password",
      });
    }

    // ✅ Step 2: Check kosalaId separately using string comparison
    if (doctor.kosalaId.toString() !== kosalaId.toString()) {
      return res.status(400).json({
        message: "Wrong Gaushala selected for this doctor",
      });
    }

    res.json(doctor);
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;