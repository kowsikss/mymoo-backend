const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, qualification, registrationNumber, phone, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const doctor = await Doctor.create({
    name,
    qualification,
    registrationNumber,
    phone,
    email,
    password: hashed,
  });

  res.json(doctor);
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const doctor = await Doctor.findOne({ email });
  if (!doctor) return res.status(400).json({ message: "Doctor not found" });

  const isMatch = await bcrypt.compare(password, doctor.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: doctor._id, role: doctor.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, doctor });
});

module.exports = router;