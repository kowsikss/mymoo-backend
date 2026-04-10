// const express = require("express");
// const router = express.Router();
// const Doctor = require("../models/Doctor");

// router.post("/login", async (req, res) => {
//   try {
//     const { name, email, password, kosalaId } = req.body;

//     console.log("Login attempt:", { name, email, kosalaId });

//     if (!name || !email || !password || !kosalaId) {
//       return res.status(400).json({
//         message: "Name, email, password and Gaushala are all required",
//       });
//     }

//     // ✅ Step 1: Find doctor by name + email + password
//     const doctor = await Doctor.findOne({
//       name,
//       email,
//       password,
//     });

//     console.log("Doctor found:", doctor);

//     if (!doctor) {
//       return res.status(400).json({
//         message: "Invalid credentials — check name, email and password",
//       });
//     }

//     // ✅ Step 2: Check kosalaId separately using string comparison
//     if (doctor.kosalaId.toString() !== kosalaId.toString()) {
//       return res.status(400).json({
//         message: "Wrong Gaushala selected for this doctor",
//       });
//     }

//     res.json(doctor);
//   } catch (err) {
//     console.error("Login error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;
// const express = require("express");
// const router = express.Router();
// const Doctor = require("../models/Doctor");
// const crypto     = require("crypto");      // ✅ built-in Node, no install needed
// const sendResetEmail = require("../utils/sendEmail");
// /* =========================
//    POST /forgot-password
//    Doctor enters email → gets reset link
// ========================= */
// router.post("/forgot-password", async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const doctor = await Doctor.findOne({ email });

//     // Always return success — don't reveal if email exists or not
//     if (!doctor) {
//       return res.json({ message: "If this email is registered, a reset link has been sent." });
//     }

//     // Generate a secure random token
//     const token  = crypto.randomBytes(32).toString("hex");
//     const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

//     doctor.resetToken       = token;
//     doctor.resetTokenExpiry = expiry;
//     await doctor.save();

//     // ✅ Change this to your frontend URL in production
//     const resetLink = `http://localhost:5173/reset-password/${token}`;

//     await sendResetEmail(doctor.email, resetLink);

//     res.json({ message: "If this email is registered, a reset link has been sent." });

//   } catch (err) {
//     console.error("Forgot password error:", err);
//     res.status(500).json({ message: "Something went wrong. Please try again." });
//   }
// });

// /* =========================
//    POST /reset-password/:token
//    Doctor submits new password
// ========================= */
// router.post("/reset-password/:token", async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { password } = req.body;

//     if (!password || password.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }

//     const doctor = await Doctor.findOne({
//       resetToken:       token,
//       resetTokenExpiry: { $gt: new Date() }, // token must not be expired
//     });

//     if (!doctor) {
//       return res.status(400).json({ message: "Reset link is invalid or has expired." });
//     }

//     // Hash and save new password
//     const hashed = await bcrypt.hash(password, 10);
//     doctor.password          = hashed;
//     doctor.resetToken        = null; // ✅ clear token after use
//     doctor.resetTokenExpiry  = null;
//     await doctor.save();

//     res.json({ message: "Password reset successfully! You can now log in." });

//   } catch (err) {
//     console.error("Reset password error:", err);
//     res.status(500).json({ message: "Something went wrong. Please try again." });
//   }
// });

// // ── Existing login route ──────────────────────────────────────
// router.post("/login", async (req, res) => {
//   try {
//     const { name, email, password, kosalaId } = req.body;

//     if (!name || !email || !password || !kosalaId) {
//       return res.status(400).json({
//         message: "Name, email, password and Gaushala are all required",
//       });
//     }

//     const doctor = await Doctor.findOne({ name, email, password });

//     if (!doctor) {
//       return res.status(400).json({
//         message: "Invalid credentials — check name, email and password",
//       });
//     }

//     if (doctor.kosalaId.toString() !== kosalaId.toString()) {
//       return res.status(400).json({
//         message: "Wrong Gaushala selected for this doctor",
//       });
//     }

//     res.json(doctor);
//   } catch (err) {
//     console.error("Login error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// });

// // ── Step 1: Verify doctor identity ───────────────────────────
// router.post("/verify-identity", async (req, res) => {
//   try {
//     const { name, email } = req.body;

//     if (!name || !email) {
//       return res.status(400).json({ message: "Name and email are required" });
//     }

//     const doctor = await Doctor.findOne({ name, email });

//     if (!doctor) {
//       return res.status(404).json({
//         message: "No doctor found with this name and email",
//       });
//     }

//     // ✅ Return doctorId so frontend can use it in step 2
//     res.json({ doctorId: doctor._id, message: "Identity verified" });

//   } catch (err) {
//     console.error("Verify identity error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// });

// // ── Step 2: Reset password ────────────────────────────────────
// router.post("/reset-password", async (req, res) => {
//   try {
//     const { doctorId, newPassword } = req.body;

//     if (!doctorId || !newPassword) {
//       return res.status(400).json({
//         message: "Doctor ID and new password are required",
//       });
//     }

//     if (newPassword.length < 6) {
//       return res.status(400).json({
//         message: "Password must be at least 6 characters",
//       });
//     }

//     const doctor = await Doctor.findByIdAndUpdate(
//       doctorId,
//       { password: newPassword },
//       { new: true }
//     );

//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }

//     res.json({ message: "Password updated successfully" });

//   } catch (err) {
//     console.error("Reset password error:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;

require("dotenv").config();
const express    = require("express");
const router     = express.Router();
const Doctor     = require("../models/Doctor");
const crypto     = require("crypto");
const nodemailer = require("nodemailer");

/* =========================
   EMAIL TRANSPORTER
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

/* =========================
   TEST EMAIL (temporary - remove after confirming email works)
========================= */
router.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from:    process.env.GMAIL_USER,
      to:      process.env.GMAIL_USER,
      subject: "Kosala Test Email",
      text:    "Nodemailer is working!",
    });
    res.json({ success: true, message: "Test email sent!" });
  } catch (err) {
    console.error("Test email error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   POST /login
========================= */
router.post("/login", async (req, res) => {
  try {
    const { name, email, password, kosalaId } = req.body;

    if (!name || !email || !password || !kosalaId) {
      return res.status(400).json({
        message: "Name, email, password and Gaushala are all required",
      });
    }

    const doctor = await Doctor.findOne({ name, email, password });

    if (!doctor) {
      return res.status(400).json({
        message: "Invalid credentials — check name, email and password",
      });
    }

    if (doctor.kosalaId.toString() !== kosalaId.toString()) {
      return res.status(400).json({
        message: "Wrong Gaushala selected for this doctor",
      });
    }

    res.json(doctor);
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   POST /verify-identity
   Step 1 — verify name + email → send reset email
========================= */
router.post("/verify-identity", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const doctor = await Doctor.findOne({ name, email });

    if (!doctor) {
      return res.status(404).json({
        message: "No doctor found with this name and email",
      });
    }

    // ✅ Generate secure token valid 15 minutes
    const token  = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    doctor.resetToken       = token;
    doctor.resetTokenExpiry = expiry;
    await doctor.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    // ✅ Send email
    await transporter.sendMail({
      from:    `"Kosala Support" <${process.env.GMAIL_USER}>`,
      to:      doctor.email,
      subject: "Password Reset — Kosala",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;
                    padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:#166534;">🐄 Kosala — Password Reset</h2>
          <p style="color:#374151;font-size:15px;">
            Hi <strong>${doctor.name}</strong>,<br/><br/>
            We received a request to reset your password.
            Click the button below — this link expires in <strong>15 minutes</strong>.
          </p>
          <a href="${resetLink}"
            style="display:inline-block;margin:24px 0;padding:12px 28px;
                   background:#166534;color:white;text-decoration:none;
                   border-radius:8px;font-size:15px;font-weight:bold;">
            Reset My Password
          </a>
          <p style="color:#6b7280;font-size:13px;">
            If you didn't request this, ignore this email.
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
          <p style="color:#9ca3af;font-size:12px;">Kosala Gaushala Management System</p>
        </div>
      `,
    });

    res.json({ message: "Reset link sent to your email" });

  } catch (err) {
    console.error("Verify identity error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   POST /reset-password/:token
   Step 2 — doctor clicks email link → sets new password
========================= */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token }       = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // ✅ Find doctor with valid non-expired token
    const doctor = await Doctor.findOne({
      resetToken:       token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!doctor) {
      return res.status(400).json({
        message: "Reset link is invalid or has expired",
      });
    }

    // ✅ Save plain password (matching your existing login which also uses plain passwords)
    doctor.password         = newPassword;
    doctor.resetToken       = null;
    doctor.resetTokenExpiry = null;
    await doctor.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;