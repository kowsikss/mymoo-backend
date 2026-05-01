// routes/gaushalaRequestRoutes.js
const express  = require("express");
const multer   = require("multer");
const path     = require("path");
const fs       = require("fs");
const bcrypt   = require("bcryptjs");
const router   = express.Router();

const GaushalaRequest = require("../models/GaushalaRequest");
const Gaushala        = require("../models/Gaushala");
const KosalaAdmin     = require("../models/KosalaAdmin");

// ── Multer ────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/certificates";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ── POST /api/gaushala-requests ───────────────────────────────
router.post("/", upload.single("certificateFile"), async (req, res) => {
  try {
    const { kosalaName, address, pincode, registrationNumber,
            contactNumber, email, adminName, password, lat, lon } = req.body;

    if (!kosalaName || !address || !pincode || !email || !adminName || !password)
      return res.status(400).json({ message: "All required fields must be filled." });

    if (req.file) {
      const allowedExt = [".pdf", ".jpg", ".jpeg", ".png"];
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (!allowedExt.includes(ext)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Only PDF, JPG, PNG files are allowed." });
      }
    }

    await new GaushalaRequest({
      kosalaName,
      location:           address,
      pincode,
      registrationNumber: registrationNumber || null,
      contactNumber:      contactNumber      || null,
      email,
      adminName,
      password,
      certificateFile:    req.file ? req.file.path : null,
      lat:  lat  ? parseFloat(lat)  : null,
      lon:  lon  ? parseFloat(lon)  : null,
      status: "pending",
    }).save();

    res.status(201).json({ message: "Application submitted successfully." });
  } catch (err) {
    console.error("❌ POST error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/gaushala-requests ────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    res.json(await GaushalaRequest.find(filter).sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/gaushala-requests/:id/approve ────────────────────
router.put("/:id/approve", async (req, res) => {
  try {
    // STEP 1 — Find request
    const request = await GaushalaRequest.findById(req.params.id);
    if (!request)
      return res.status(404).json({ message: "Request not found." });
    if (request.status === "approved")
      return res.status(400).json({ message: "Already approved." });

    console.log("✅ STEP 1 — Request found:", request.kosalaName);

    // STEP 2 — Save Gaushala
    const gaushala = await new Gaushala({
      name:               request.kosalaName,
      address:            request.location          || "N/A",
      pincode:            Number(request.pincode)   || 0,
      registrationNumber: request.registrationNumber || "N/A",
      certificateFile:    request.certificateFile   || "N/A",
      contactNumber:      request.contactNumber     || "N/A",
      email:              request.email,
      lat:                request.lat || null,
      lon:                request.lon || null,
    }).save();

    console.log("✅ STEP 2 — Gaushala saved. ID:", gaushala._id);

    // STEP 3 — Save KosalaAdmin login account
    try {
      const hashedPassword = await bcrypt.hash(request.password, 10);
      const adminUser = await new KosalaAdmin({
        name:     request.adminName,
        email:    request.email,              // ✅ CRITICAL — needed for login
        password: hashedPassword,
        kosalaId: gaushala._id.toString(),
        role:     "kosala-admin",
      }).save();
      console.log("✅ STEP 3 — KosalaAdmin created. Email:", adminUser.email);
    } catch (adminErr) {
      console.error("⚠️  STEP 3 — KosalaAdmin failed:", adminErr.message);
      // Non-fatal — gaushala is already saved
    }

    // STEP 4 — Mark request approved
    request.status     = "approved";
    request.approvedAt = new Date();
    await request.save();
    console.log("✅ STEP 4 — Request marked approved.");

    res.json({ message: "Approved! Gaushala and admin created.", gaushalaId: gaushala._id });

  } catch (err) {
    console.error("❌ Approve error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/gaushala-requests/:id/reject ─────────────────────
router.put("/:id/reject", async (req, res) => {
  try {
    const request = await GaushalaRequest.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", rejectedAt: new Date(), rejectedReason: req.body.reason || null },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: "Request not found." });
    res.json({ message: "Rejected.", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;