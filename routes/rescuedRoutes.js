const express = require("express");

const router = express.Router();

const RescuedAnimal = require("../models/RescuedAnimal");

// ==========================
// GET ALL
// ==========================

router.get("/", async (req, res) => {

  try {

    const records =
      await RescuedAnimal.find();

    res.json(records);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }

});

// ==========================
// GET BY KOSALA ID
// ==========================

router.get(
  "/kosala/:kosalaId",
  async (req, res) => {

    try {

      const records =
        await RescuedAnimal.find({

          kosalaId:
            req.params.kosalaId,

        });

      res.json(records);

    } catch (err) {

      res.status(500).json({
        error: err.message,
      });

    }

  }
);

// ==========================
// GET SINGLE RECORD
// ==========================

router.get("/:id", async (req, res) => {

  try {

    const record =
      await RescuedAnimal.findById(
        req.params.id
      );

    if (!record) {

      return res
        .status(404)
        .json({
          message:
            "Record not found",
        });

    }

    res.json(record);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }

});

// ==========================
// CREATE
// ==========================

router.post("/", async (req, res) => {

  try {

    console.log(
      "BODY:",
      req.body
    );

    const newRecord =
      new RescuedAnimal({

        kosalaId:
          req.body.kosalaId,

        dateOfRescued:
          req.body.dateOfRescued,

        sex:
          req.body.sex,

        breed:
          req.body.breed,

        age:
          req.body.age,

        ownerName:
          req.body.ownerName,

        ownerAddress:
          req.body.ownerAddress,

        ownerMobile:
          req.body.ownerMobile,

        ownerAadhar:
          req.body.ownerAadhar,

        reasonOfAdoption:
          req.body.reasonOfAdoption,

        tagNumber:
          req.body.tagNumber,

        // ✅ R2 IMAGE URL
        animalPhoto:
          req.body.animalPhoto ||
          null,

      });

    await newRecord.save();

    res.status(201).json(
      newRecord
    );

  } catch (err) {

    console.error(
      "Error saving rescued animal:",
      err
    );

    res.status(500).json({
      error: err.message,
    });

  }

});

// ==========================
// UPDATE
// ==========================

router.put("/:id", async (req, res) => {

  try {

    const updated =
      await RescuedAnimal.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    if (!updated) {

      return res
        .status(404)
        .json({
          message:
            "Record not found",
        });

    }

    res.json(updated);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }

});

// ==========================
// DELETE
// ==========================

router.delete("/:id", async (req, res) => {

  try {

    await RescuedAnimal.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Record deleted successfully",
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }

});

module.exports = router;