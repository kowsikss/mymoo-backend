const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");


// GET profile
router.get("/", async (req, res) => {
  let profile = await Profile.findOne();

  if (!profile) {
    profile = await Profile.create({
      username: "Admin",
      address: "",
      city: "",
      gender: "",
      email: ""
    });
  }

  res.json(profile);
});


// UPDATE profile
router.put("/", async (req, res) => {
  let profile = await Profile.findOne();

  if (!profile) {
    profile = new Profile(req.body);
  } else {
    Object.assign(profile, req.body);
  }

  await profile.save();
  res.json(profile);
});

module.exports = router;