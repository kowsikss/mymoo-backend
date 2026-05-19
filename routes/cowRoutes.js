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
  router.post(
    "/",
    upload.fields([
      { name: "front", maxCount: 1 },
      { name: "side", maxCount: 1 },
      { name: "back", maxCount: 1 },
      { name: "insuranceCert", maxCount: 1 },
      { name: "frontImage", maxCount: 1 },
      { name: "sideImage", maxCount: 1 },
      { name: "backImage", maxCount: 1 },
    ]),
    async (req, res) => {

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

        const files = req.files || {};
        const uploadedPublicUrl = (field) => {
          const uploaded = files[field]?.[0];
          return uploaded ? `/uploads/cows/${uploaded.filename}` : null;
        };

        const frontImageFile = uploadedPublicUrl("front") || uploadedPublicUrl("frontImage");
        const sideImageFile = uploadedPublicUrl("side") || uploadedPublicUrl("sideImage");
        const backImageFile = uploadedPublicUrl("back") || uploadedPublicUrl("backImage");
        const insuranceCertFile = uploadedPublicUrl("insuranceCert");

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
  router.put(
    "/:id",
    upload.fields([
      { name: "front", maxCount: 1 },
      { name: "side", maxCount: 1 },
      { name: "back", maxCount: 1 },
      { name: "insuranceCert", maxCount: 1 },
      { name: "frontImage", maxCount: 1 },
      { name: "sideImage", maxCount: 1 },
      { name: "backImage", maxCount: 1 },
    ]),
    async (req, res) => {

      try {
        const files = req.files || {};
        const uploadedPublicUrl = (field) => {
          const uploaded = files[field]?.[0];
          return uploaded ? `/uploads/cows/${uploaded.filename}` : null;
        };

        const updateData = {
          ...req.body,
          frontImage:
            uploadedPublicUrl("front") ||
            uploadedPublicUrl("frontImage") ||
            req.body.front ||
            req.body.frontImage ||
            undefined,
          sideImage:
            uploadedPublicUrl("side") ||
            uploadedPublicUrl("sideImage") ||
            req.body.side ||
            req.body.sideImage ||
            undefined,
          backImage:
            uploadedPublicUrl("back") ||
            uploadedPublicUrl("backImage") ||
            req.body.back ||
            req.body.backImage ||
            undefined,
          insuranceCert:
            uploadedPublicUrl("insuranceCert") ||
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