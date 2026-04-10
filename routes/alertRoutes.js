const express = require("express");
const router = express.Router();
const CattleInfo = require("../models/CattleInfo");
const Inventory  = require("../models/Inventory");

function daysDiff(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  return Math.floor((today - date) / (1000 * 60 * 60 * 24));
}

router.get("/kosala/:kosalaId", async (req, res) => {
  try {
    const { kosalaId } = req.params;
    const alerts = [];

    // ── Cattle alerts ─────────────────────────────────────────
    const cattleRecords = await CattleInfo.find({ kosalaId });

    cattleRecords.forEach((rec) => {

      // Alert 1: Check for Pregnancy (61+ days from insemination)
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

      // Alert 2: Calving Alert (3rd month from last calving)
      if (rec.lastCalvingDate) {
        const days = daysDiff(rec.lastCalvingDate);
        if (days >= 90 && days <= 97) {
          alerts.push({
            type: "calving_alert",
            level: "info",
            cowId: rec.cowId,
            message: `Calving Alert — Cow ${rec.cowId} is in the 3rd month since last calving (${days} days ago).`,
            days,
          });
        }
      }

      // Alert 3: Gestation Alert
      if (rec.inseminationDate) {
        const days = daysDiff(rec.inseminationDate);
        if (days >= 61 && days < 220) {
          alerts.push({
            type: "gestation_alert",
            level: "info",
            cowId: rec.cowId,
            message: `Gestation Alert — Cow ${rec.cowId} is ${days} days into gestation (61–220 day window).`,
            days,
          });
        }
        if (days >= 220) {
          alerts.push({
            type: "gestation_due",
            level: "danger",
            cowId: rec.cowId,
            message: `Gestation Due — Cow ${rec.cowId} has completed ${days} days since insemination. Delivery expected soon!`,
            days,
          });
        }
      }
    });

    // ── Inventory alerts ──────────────────────────────────────
    const inventoryRecords = await Inventory.find({ kosalaId });

    // Group latest totals per type
    const totalFeedBags  = inventoryRecords
      .filter((r) => r.type === "feed")
      .reduce((sum, r) => sum + (Number(r.gunnyBags) || 0), 0);

    const totalSemenStraws = inventoryRecords
      .filter((r) => r.type === "semen")
      .reduce((sum, r) => sum + (Number(r.strawCount) || 0), 0);

    // ✅ Alert 4: Feed stock below 100 bags
    if (totalFeedBags > 0 && totalFeedBags < 100) {
      alerts.push({
        type: "feed_low",
        level: "warning",
        cowId: "Inventory",
        message: `Low Feed Stock — Only ${totalFeedBags} gunny bags remaining in inventory. Please restock (minimum 100 bags recommended).`,
        days: 0,
      });
    }

    // ✅ Alert 5: Semen straw below 20
    if (totalSemenStraws > 0 && totalSemenStraws < 20) {
      alerts.push({
        type: "semen_low",
        level: "danger",
        cowId: "Inventory",
        message: `Low Semen Straw Stock — Only ${totalSemenStraws} straws remaining. Please restock (minimum 20 straws recommended).`,
        days: 0,
      });
    }

    res.json(alerts);
  } catch (err) {
    console.error("Error fetching alerts:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;