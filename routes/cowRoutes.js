const express = require("express");
const router = express.Router();

const Cow = require("../models/Cow");

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
  router.post("/", async (req, res) => {

    try {

      console.log("BODY:", req.body);

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

        // ✅ R2 URLs
        front,
        side,
        back,
        insuranceCert,

      } = req.body;

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

        // ✅ SAVE R2 URLS
        frontImage: front || null,
        sideImage: side || null,
        backImage: back || null,

        insuranceCert: insuranceCert || null,

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
  router.put("/:id", async (req, res) => {

    try {

      const updated =
        await Cow.findByIdAndUpdate(
          req.params.id,
          req.body,
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