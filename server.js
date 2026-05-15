require("dotenv").config(); // ✅ Load env variables first

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const Breed = require("./models/Breed");
const kosalaAdminRoutes = require("./routes/kosalaAdminRoutes");

const gaushalaRequestRoutes = require("./routes/gaushalaRequestRoutes");
const donationRoutes = require("./routes/donationRoutes");

const app = express();

/* =============================
   MIDDLEWARE
============================= */
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://mymoo-admin.up.railway.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* =============================
   ROUTES (Basic)
============================= */
app.use("/api/gaushala-requests", gaushalaRequestRoutes);
app.use("/api/donations", donationRoutes);

/* =============================
   SEED BREEDS
============================= */
async function seedBreeds() {
  try {
    const count = await Breed.countDocuments();
    if (count === 0) {
      console.log("🌱 Seeding default breeds...");
      await Breed.insertMany([
        { name: "Gir" },
        { name: "Sahiwal" },
        { name: "Red Sindhi" },
        { name: "Tharparkar" },
        { name: "Ongole" },
        { name: "Kankrej" },
        { name: "Hariana" },
        { name: "Deoni" },
        {name:"Girolanda"},
        {name:"Kangeyam"},
        {name:"Cross breed"},
        {name:"Punganur"},
        {name:"Theni"},
        {name:"Malaimadu(thevarai)"},
      ]);
      console.log("✅ Breeds added successfully");
    } else {
      console.log("✔ Breeds already exist");
    }
  } catch (err) {
    console.error("❌ Error seeding breeds:", err);
  }
}

/* =============================
   START SERVER
============================= */
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    await seedBreeds();

    // ✅ Create HTTP server
    const server = http.createServer(app);

    // ✅ Setup Socket.IO
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("🟢 User connected:", socket.id);
      socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
      });
    });

    /* =============================
       MAIN ROUTES
    ============================= */
    app.use("/api/cows", require("./routes/cowRoutes")(io));
    app.use("/api/deworming", require("./routes/dewormRoutes"));
    app.use("/api/immunization", require("./routes/immunizationRoutes"));
    app.use("/api/vaccination", require("./routes/vaccinationRoutes"));
    app.use("/api/reproduction", require("./routes/reproductionRoutes"));
    app.use("/api/profile", require("./routes/profileRoutes"));
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/kosala", require("./routes/kosalaRoutes"));
    app.use("/api/doctors", require("./routes/doctorRoutes"));
    app.use("/api/doctor-auth", require("./routes/doctorAuthRoutes"));
    app.use("/api/breeds", require("./routes/breedRoutes"));
    app.use("/api/cattle", require("./routes/cattleRoutes"));
    app.use("/api/rescued", require("./routes/rescuedRoutes"));
    app.use("/api/inventory", require("./routes/inventoryRoutes"));
    app.use("/api/kosala-admin", require("./routes/kosalaAdminRoutes"));
    app.use("/api", kosalaAdminRoutes);

    app.use("/api/alerts", require("./routes/alertRoutes"));

    /* =============================
       HEALTH CHECK (IMPORTANT)
    ============================= */
    app.get("/", (req, res) => {
      res.send("🚀 MyMoo Backend is Running");
    });

    /* =============================
       START SERVER (CRITICAL FIX)
    ============================= */
    const PORT = process.env.PORT;

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

startServer();

module.exports = app;