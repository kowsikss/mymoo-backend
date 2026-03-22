const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// GET ALL DOCTORS
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE DOCTOR BY ID
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD DOCTOR
router.post("/", async (req, res) => {
  try {
    const {
      name,
      mobile,       // ✅ matches frontend
      specialization,
      email,
      nearbyHospital,
      hospitalPincode,
      kosalaId,
      password,
    } = req.body;

    // ✅ Validate using correct field names
    if (
      !name ||
      !mobile ||
      !specialization ||
      !email ||
      !nearbyHospital ||
      !hospitalPincode ||
      !kosalaId ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are mandatory",
        missing: {
          name: !name,
          mobile: !mobile,
          specialization: !specialization,
          email: !email,
          nearbyHospital: !nearbyHospital,
          hospitalPincode: !hospitalPincode,
          kosalaId: !kosalaId,
          password: !password,
        },
      });
    }

    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    console.error("Error creating doctor:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE DOCTOR
router.put("/:id", async (req, res) => {
  try {
    const updated = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Doctor not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE DOCTOR
router.delete("/:id", async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;