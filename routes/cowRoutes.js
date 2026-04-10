const express = require("express");
const router = express.Router();
const Cow = require("../models/Cow");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

module.exports = (io) => {

  router.get("/", async (req, res) => {
    try {
      const cows = await Cow.find();
      res.json(cows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/kosala/:kosalaId", async (req, res) => {
    try {
      const cows = await Cow.find({ kosalaId: req.params.kosalaId });
      res.json(cows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const cow = await Cow.findById(req.params.id);
      if (!cow) return res.status(404).json({ message: "Cow not found" });
      res.json(cow);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post(
    "/",
    upload.fields([
      { name: "front",         maxCount: 1 }, // ✅ already had these
      { name: "side",          maxCount: 1 },
      { name: "back",          maxCount: 1 },
      { name: "insuranceCert", maxCount: 1 }, // ✅ THIS was missing — caused the crash
    ]),
    async (req, res) => {
      try {
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        const {
          kosalaId, type, breed, age, ageUnit, weight,
          registrationDate, calfStatus, tagNumber,
          vaccinationDate, dewormingDate, insuranceStatus,
          healthStatus, monthlyAmountSpent, hasDisease,
          diseaseName, diseaseDate, treatmentDate,
          feedType, feedAmountKg,
        } = req.body;

        if (!kosalaId) {
          return res.status(400).json({ message: "Kosala ID is required" });
        }

        const lastCow = await Cow.findOne().sort({ createdAt: -1 });
        let newId = 1001;
        if (lastCow?.cowId) {
          const lastNumber = parseInt(lastCow.cowId.split("-")[1]);
          if (!isNaN(lastNumber)) newId = lastNumber + 1;
        }

        const newCow = new Cow({
          cowId: `Cow-${newId}`,
          kosalaId,
          type,
          breed,
          age,
          ageUnit,
          weight,
          registrationDate,
          calfStatus,
          tagNumber,
          vaccinationDate,
          dewormingDate,
          insuranceStatus,
          healthStatus,
          monthlyAmountSpent,
          hasDisease,
          diseaseName,
          diseaseDate,
          treatmentDate,
          feedType,
          feedAmountKg,
          frontImage:       req.files?.front?.[0]?.filename        || null,
          sideImage:        req.files?.side?.[0]?.filename         || null,
          backImage:        req.files?.back?.[0]?.filename         || null,
          insuranceCertFile: req.files?.insuranceCert?.[0]?.filename || null, // ✅ save it
        });

        await newCow.save();
        io.emit("cowAdded", { kosalaId, cowId: newCow.cowId });
        res.status(201).json(newCow);

      } catch (err) {
        console.error("❌ Error saving cow:", err);
        res.status(500).json({ error: err.message });
      }
    }
  );

  router.put("/:id", async (req, res) => {
    try {
      const updated = await Cow.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: "Cow not found" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const deleted = await Cow.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Cow not found" });
      res.json({ message: "Cow deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};