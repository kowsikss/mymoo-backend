const express = require("express");
const router = express.Router();
const Gaushala = require("../models/Gaushala");
const Doctor = require("../models/Doctor");
const Cow = require("../models/Cow");
const multer = require("multer");
const path = require("path");

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* =========================
   GET /full — All Gaushalas with doctor + cow count
========================= */
router.get("/full", async (req, res) => {
  try {
    const kosalas = await Gaushala.find();

    const result = await Promise.all(
      kosalas.map(async (k) => {
        const doctor = await Doctor.findOne({ kosalaId: k._id });

        // ✅ Count cows using both ObjectId and string format
        const totalCows = await Cow.countDocuments({
          $or: [
            { kosalaId: k._id },
            { kosalaId: k._id.toString() },
          ],
        });

        return {
          ...k._doc,
          doctor,
          totalCows,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("Error fetching full kosala list:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET / — All Gaushalas
========================= */
router.get("/", async (req, res) => {
  try {
    const gaushalas = await Gaushala.find();
    res.json(gaushalas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ✅ GET /:id — Single Gaushala by ID (WAS MISSING)
   Needed by AdminKosalaDashboard to show name
========================= */
router.get("/:id", async (req, res) => {
  try {
    const gaushala = await Gaushala.findById(req.params.id);
    if (!gaushala)
      return res.status(404).json({ message: "Gaushala not found" });
    res.json(gaushala);
  } catch (err) {
    console.error("Error fetching gaushala by id:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   POST / — Add Gaushala
========================= */
router.post("/", upload.single("certificate"), async (req, res) => {
  try {
    const gaushala = await Gaushala.create({
      ...req.body,
      certificateFile: req.file ? req.file.filename : null,
    });
    res.json(gaushala);
  } catch (err) {
    console.error("Error creating gaushala:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   DELETE /:id — Delete Gaushala
========================= */
router.delete("/:id", async (req, res) => {
  try {
    await Gaushala.findByIdAndDelete(req.params.id);
    res.json({ message: "Gaushala deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;