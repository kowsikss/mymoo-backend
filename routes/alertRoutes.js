const express = require("express");
const router = express.Router();
const CattleInfo = require("../models/CattleInfo");

// Helper: days difference from a date to today
function daysDiff(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const diff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  return diff;
}

// GET /api/alerts/kosala/:kosalaId
router.get("/kosala/:kosalaId", async (req, res) => {
  try {
    const records = await CattleInfo.find({
      kosalaId: req.params.kosalaId,
    });

    const alerts = [];

    records.forEach((rec) => {

      // ✅ ALERT 1: Check for Pregnancy
      // Trigger from 61st day after insemination
      // Repeat daily until pregnancyStatus is confirmed "Yes"
      if (rec.inseminationDate && rec.pregnancyStatus !== "Yes") {
        const days = daysDiff(rec.inseminationDate);
        if (days >= 61) {
          alerts.push({
            type: "pregnancy_check",
            level: "warning",
            cowId: rec.cowId,
            message: `Check for Pregnancy — Cow ${rec.cowId} was inseminated ${days} days ago. Please confirm pregnancy status.`,
            days,
          });
        }
      }

      // ✅ ALERT 2: Calving Alert
      // Trigger once at 3rd month (90 days) from last calving date
      if (rec.lastCalvingDate) {
        const days = daysDiff(rec.lastCalvingDate);
        if (days >= 90 && days <= 97) { // 7 day window so it doesn't miss
          alerts.push({
            type: "calving_alert",
            level: "info",
            cowId: rec.cowId,
            message: `Calving Alert — Cow ${rec.cowId} is in the 3rd month since last calving (${days} days ago).`,
            days,
          });
        }
      }

      // ✅ ALERT 3: Gestation Alert
      // From insemination date — alert at 61 days
      // Then again after 220 days
      if (rec.inseminationDate) {
        const days = daysDiff(rec.inseminationDate);

        if (days >= 61 && days < 220) {
          alerts.push({
            type: "gestation_alert",
            level: "info",
            cowId: rec.cowId,
            message: `Gestation Alert — Cow ${rec.cowId} is ${days} days into gestation (61-220 day window).`,
            days,
          });
        }

        if (days >= 220) {
          alerts.push({
            type: "gestation_due",
            level: "danger",
            cowId: rec.cowId,
            message: `Gestation Due Alert — Cow ${rec.cowId} has completed ${days} days since insemination. Delivery expected soon!`,
            days,
          });
        }
      }

    });

    res.json(alerts);
  } catch (err) {
    console.error("Error fetching alerts:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;