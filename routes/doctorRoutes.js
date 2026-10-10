const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const { hashPassword } = require("../utils/password");

// GET ALL DOCTORS
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password").sort({ createdAt: -1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE DOCTOR BY ID
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-password");
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

    const doctor = await Doctor.create({
      ...req.body,
      password: await hashPassword(password),
    });
    const doctorData = doctor.toObject();
    delete doctorData.password;
    res.status(201).json(doctorData);
  } catch (err) {
    console.error("Error creating doctor:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE DOCTOR
router.put("/:id", async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) updates.password = await hashPassword(updates.password);

    const updated = await Doctor.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select("-password");
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