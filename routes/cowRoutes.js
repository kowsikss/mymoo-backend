const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const Cow = require("../models/Cow");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/cows";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const isBase64Image = (value) =>
  typeof value === "string" && value.startsWith("data:image/");

const saveBase64Image = (value, prefix) => {
  if (!isBase64Image(value)) return null;
  const match = value.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) return null;
  const ext = match[1].split("/")[1];
  const buffer = Buffer.from(match[2], "base64");
  const filename = `${Date.now()}-${prefix}.${ext}`;
  const filepath = path.join("uploads/cows", filename);
  fs.writeFileSync(filepath, buffer);
  return `/uploads/cows/${filename}`;
};

module.exports = (io) => {

  // GET ALL COWS
  router.get("/", async (req, res) => {
    try {

      const cows = await Cow.find();

      res.json(cows);

    } catch (err) {

      res.status(500).json({
        error: err.message,
      });

    }
  });

  // GET COWS BY KOSALA
  router.get("/kosala/:kosalaId", async (req, res) => {

    try {

      const cows = await Cow.find({
        kosalaId: req.params.kosalaId,
      });

      res.json(cows);

    } catch (err) {

      res.status(500).json({
        error: err.message,
      });

    }

  });

  // GET SINGLE COW
  router.get("/:id", async (req, res) => {

    try {

      const cow = await Cow.findById(req.params.id);

      if (!cow) {
        return res.status(404).json({
          message: "Cow not found",
        });
      }

      res.json(cow);

    } catch (err) {

      res.status(500).json({
        error: err.message,
      });

    }

  });

  // ADD COW
  router.post("/", upload.any(), async (req, res) => {

      try {

        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        const {

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

          // ✅ R2 URLs or string fields
          front,
          side,
          back,
          insuranceCert,

        } = req.body;

        const files = Array.isArray(req.files) ? req.files : [];
        const publicUrlFromFile = (file) => (file ? `/uploads/cows/${file.filename}` : null);
        const findFile = (names) => files.find((file) =>
          names.some((name) => file.fieldname?.toLowerCase().includes(name))
        );

        const frontImageFile =
          publicUrlFromFile(findFile(["front", "image", "photo", "cow"])) ||
          saveBase64Image(req.body.front, "front") ||
          saveBase64Image(req.body.frontImage, "front");
        const sideImageFile =
          publicUrlFromFile(findFile(["side"])) ||
          saveBase64Image(req.body.side, "side") ||
          saveBase64Image(req.body.sideImage, "side");
        const backImageFile =
          publicUrlFromFile(findFile(["back"])) ||
          saveBase64Image(req.body.back, "back") ||
          saveBase64Image(req.body.backImage, "back");
        const insuranceCertFile =
          publicUrlFromFile(findFile(["insurance", "cert"])) ||
          saveBase64Image(req.body.insuranceCert, "insuranceCert");

      if (!kosalaId) {

        return res.status(400).json({
          message: "Kosala ID is required",
        });

      }

      // GENERATE COW ID

      const lastCow =
        await Cow.findOne().sort({
          createdAt: -1,
        });

      let newId = 1001;

      if (lastCow?.cowId) {

        const lastNumber =
          parseInt(lastCow.cowId.split("-")[1]);

        if (!isNaN(lastNumber)) {
          newId = lastNumber + 1;
        }

      }

      // CREATE NEW COW

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

        // ✅ SAVE uploaded files or fallback to provided URLs
        frontImage: frontImageFile || front || null,
        sideImage: sideImageFile || side || null,
        backImage: backImageFile || back || null,
        insuranceCert: insuranceCertFile || insuranceCert || null,

      });

      await newCow.save();

      io.emit("cowAdded", {

        kosalaId,

        cowId: newCow.cowId,

      });

      res.status(201).json(newCow);

    } catch (err) {

      console.error(
        "❌ Error saving cow:",
        err
      );

      res.status(500).json({
        error: err.message,
      });

    }

  });

  // UPDATE COW
  router.put("/:id", upload.any(), async (req, res) => {

      try {
        const files = Array.isArray(req.files) ? req.files : [];
        const publicUrlFromFile = (file) => (file ? `/uploads/cows/${file.filename}` : null);
        const findFile = (names) => files.find((file) =>
          names.some((name) => file.fieldname?.toLowerCase().includes(name))
        );

        const updateData = {
          ...req.body,
          frontImage:
            publicUrlFromFile(findFile(["front", "image", "photo", "cow"])) ||
            saveBase64Image(req.body.front, "front") ||
            saveBase64Image(req.body.frontImage, "front") ||
            req.body.front ||
            req.body.frontImage ||
            undefined,
          sideImage:
            publicUrlFromFile(findFile(["side"])) ||
            saveBase64Image(req.body.side, "side") ||
            saveBase64Image(req.body.sideImage, "side") ||
            req.body.side ||
            req.body.sideImage ||
            undefined,
          backImage:
            publicUrlFromFile(findFile(["back"])) ||
            saveBase64Image(req.body.back, "back") ||
            saveBase64Image(req.body.backImage, "back") ||
            req.body.back ||
            req.body.backImage ||
            undefined,
          insuranceCert:
            publicUrlFromFile(findFile(["insurance", "cert"])) ||
            saveBase64Image(req.body.insuranceCert, "insuranceCert") ||
            req.body.insuranceCert ||
            undefined,
        };

        const updated = await Cow.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );

      if (!updated) {

        return res.status(404).json({
          message: "Cow not found",
        });

      }

      res.json(updated);

    } catch (err) {

      res.status(500).json({
        error: err.message,
      });

    }

  });

  // DELETE COW
  router.delete("/:id", async (req, res) => {

    try {

      const deleted =
        await Cow.findByIdAndDelete(
          req.params.id
        );

      if (!deleted) {

        return res.status(404).json({
          message: "Cow not found",
        });

      }

      res.json({
        message:
          "Cow deleted successfully",
      });

    } catch (err) {

      res.status(500).json({
        error: err.message,
      });

    }

  });

  return router;
};