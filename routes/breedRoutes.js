const express = require("express");
const router = express.Router();
const Breed = require("../models/Breed");

router.post("/", async (req, res) => {
  const breed = await Breed.create(req.body);
  res.json(breed);
});

router.get("/", async (req, res) => {
  const breeds = await Breed.find();
  res.json(breeds);
});

module.exports = router;