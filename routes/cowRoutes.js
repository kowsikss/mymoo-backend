const express = require("express");
const router = express.Router();
const Cow = require("../models/Cow");
const multer = require("multer");
const path = require("path");

/* =========================
   MULTER CONFIG
========================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* =========================
   EXPORT WITH IO
========================= */

module.exports = (io) => {

  /* =========================
     GET ALL COWS
  ========================= */
  router.get("/", async (req, res) => {
    try {
      const cows = await Cow.find();
      res.json(cows);
    } catch (err) {
      console.error("Error fetching cows:", err);
      res.status(500).json({ error: err.message });
    }
  });

  /* =========================
     GET COWS BY KOSALA ID
  ========================= */
  router.get("/kosala/:kosalaId", async (req, res) => {
    try {
      const cows = await Cow.find({ kosalaId: req.params.kosalaId });
      res.json(cows);
    } catch (err) {
      console.error("Error fetching cows by kosalaId:", err);
      res.status(500).json({ error: err.message });
    }
  });

  /* =========================
     GET SINGLE COW BY ID
  ========================= */
  router.get("/:id", async (req, res) => {
    try {
      const cow = await Cow.findById(req.params.id);
      if (!cow) return res.status(404).json({ message: "Cow not found" });
      res.json(cow);
    } catch (err) {
      console.error("Error fetching cow:", err);
      res.status(500).json({ error: err.message });
    }
  });

  /* =========================
     CREATE COW (ADMIN ONLY)
  ========================= */
  router.post(
    "/",
    upload.fields([
      { name: "front", maxCount: 1 },
      { name: "side", maxCount: 1 },
      { name: "back", maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        const { kosalaId, type, breed, age, weight, registrationDate } = req.body;

        if (!kosalaId) {
          return res.status(400).json({ message: "Kosala ID is required" });
        }

        // Generate Cow ID
        const lastCow = await Cow.findOne().sort({ createdAt: -1 });
        let newId = 1001;
        if (lastCow && lastCow.cowId) {
          const lastNumber = parseInt(lastCow.cowId.split("-")[1]);
          if (!isNaN(lastNumber)) newId = lastNumber + 1;
        }

        const newCow = new Cow({
          cowId: `Cow-${newId}`,
          kosalaId,         // ✅ No duplicate
          type,
          breed,
          age,
          weight,
          registrationDate,
          frontImage: req.files?.front?.[0]?.filename || null,
          sideImage: req.files?.side?.[0]?.filename || null,
          backImage: req.files?.back?.[0]?.filename || null,
        });

        await newCow.save();

        // ✅ io is now in scope
        io.emit("cowAdded", { kosalaId, cowId: newCow.cowId });

        res.status(201).json(newCow);

      } catch (err) {
        console.error("❌ Error saving cow:", err);
        res.status(500).json({ error: err.message });
      }
    }
  );

  /* =========================
     UPDATE COW
  ========================= */
  router.put("/:id", async (req, res) => {
    try {
      const updated = await Cow.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: "Cow not found" });
      res.json(updated);
    } catch (err) {
      console.error("Error updating cow:", err);
      res.status(500).json({ error: err.message });
    }
  });

  /* =========================
     DELETE COW
  ========================= */
  router.delete("/:id", async (req, res) => {
    try {
      const deleted = await Cow.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Cow not found" });
      res.json({ message: "Cow deleted successfully" });
    } catch (err) {
      console.error("Error deleting cow:", err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};