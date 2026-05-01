const express  = require("express");
const router   = express.Router();
const Donation = require("../models/Donation");
const Gaushala = require("../models/Gaushala");

// GET /api/donations/gaushalas — public: all approved gaushalas for donation page
router.get("/gaushalas", async (req, res) => {
  try {
    const gaushalas = await Gaushala.find().select("name address pincode email");
    res.json(gaushalas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/donations — submit a donation
router.post("/", async (req, res) => {
  try {
    const { kosalaId, kosalaName, donorName, donorEmail, donorPhone, amount, message } = req.body;

    if (!kosalaId || !donorName || !donorEmail || !donorPhone || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (amount < 1) {
      return res.status(400).json({ message: "Minimum donation is ₹1" });
    }

    const donation = await Donation.create({
      kosalaId, kosalaName, donorName, donorEmail, donorPhone,
      amount: Number(amount), message,
    });

    res.status(201).json({ message: "Thank you for your donation!", donation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/donations — all donations (admin)
router.get("/", async (req, res) => {
  try {
    const { kosalaId } = req.query;
    const filter = kosalaId ? { kosalaId } : {};
    const donations = await Donation.find(filter).sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;