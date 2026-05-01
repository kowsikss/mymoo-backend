require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Breed = require("./models/Breed");
const kosalaAdminRoutes = require('./routes/kosalaAdminRoutes');
require("dotenv").config(); // ✅ must be at the very top
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
    console.log("Host:", mongoose.connection.host);
    console.log("DB Name:", mongoose.connection.name);

    // ✅ Seed AFTER mongoose connects
    await seedBreeds();

    // ✅ Create http server and io FIRST
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'https://mymoo-admin.up.railway.app',
        credentials: true
      }
    });

    io.on("connection", (socket) => {
      console.log("🟢 A user connected:", socket.id);
      socket.on("disconnect", () => {
        console.log("🔴 A user disconnected:", socket.id);
      });
    });

    /* =============================
       ROUTES (registered after io is ready)
    ============================= */
    app.use("/api/cows",          require("./routes/cowRoutes")(io)); // ✅ Pass io
    app.use("/api/deworming",     require("./routes/dewormRoutes"));
    app.use("/api/immunization",  require("./routes/immunizationRoutes"));
    app.use("/api/vaccination",   require("./routes/vaccinationRoutes"));
    app.use("/api/reproduction",  require("./routes/reproductionRoutes"));
    app.use("/api/profile",       require("./routes/profileRoutes"));
    app.use("/api/auth",          require("./routes/authRoutes"));
    app.use("/api/kosala",        require("./routes/kosalaRoutes"));
    app.use("/api/doctors",       require("./routes/doctorRoutes"));
    app.use("/api/doctor-auth",   require("./routes/doctorAuthRoutes"));
    app.use("/api/breeds",        require("./routes/breedRoutes"));
    app.use("/api/cattle",        require("./routes/cattleRoutes"));
    // Add this line with your other routes
app.use("/api/rescued", require("./routes/rescuedRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/kosala-admin", require("./routes/kosalaAdminRoutes"));
// Add this before your other routes

app.use('/api', kosalaAdminRoutes);
app.get('/api/admins', async (req, res) => {
  try {
    // If you have Admin model
    // const admins = await Admin.find().populate('kosalaId');
    
    // If you have User model with role
    const admins = await User.find({ role: 'admin' }).populate('kosalaId');
    
    res.json(admins);
  } catch (error) {
    console.error('Error in /api/admins:', error);
    res.status(500).json({ 
      message: 'Error fetching admins', 
      error: error.message 
    });
  }
});

app.use("/api/alerts", require("./routes/alertRoutes"));
    // ✅ Use server.listen (NOT app.listen) so Socket.IO works
    server.listen(process.env.PORT || 5000, () => {
      console.log("🚀 Server running on port " + (process.env.PORT || 5000));
    });

  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

startServer();

module.exports = app;