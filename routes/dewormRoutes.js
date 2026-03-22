const express = require("express");
const router = express.Router();
const Deworm = require("../models/Deworming");


// CREATE
router.post("/", async (req, res) => {
  const record = await Deworm.create(req.body);
  res.json(record);
});

// READ
router.get("/", async (req, res) => {
  const records = await Deworm.find();
  res.json(records);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const record = await Deworm.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(record);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Deworm.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
