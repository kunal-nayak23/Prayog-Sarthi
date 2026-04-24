const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const NGO = require("./models/NGO");
const Volunteer = require("./models/Volunteer");

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Database ───────────────────────────────────────────────
connectDB();

// ── Static Files ───────────────────────────────────────────
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ════════════════════════════════════════════════════════════
//  API ROUTES
// ════════════════════════════════════════════════════════════

// ── 1. Register NGO ────────────────────────────────────────
app.post("/api/register-ngo", async (req, res) => {
  try {
    console.log("📥 NGO registration body:", req.body);
    const newNgo = new NGO(req.body);
    await newNgo.save();
    res.status(201).json({ success: true, message: "NGO registered successfully" });
  } catch (error) {
    console.error("❌ NGO registration error:", error);
    res.status(500).json({ success: false, message: "Registration failed", error: error.message });
  }
});

// ── 2. Register Volunteer ──────────────────────────────────
app.post("/api/register-volunteer", async (req, res) => {
  try {
    console.log("📥 Volunteer registration body:", req.body);
    const newVolunteer = new Volunteer(req.body);
    await newVolunteer.save();
    res.status(201).json({ success: true, message: "Volunteer registered successfully" });
  } catch (error) {
    console.error("❌ Volunteer registration error:", error);
    res.status(500).json({ success: false, message: "Registration failed", error: error.message });
  }
});

// ── 3. Get Profile (by email) ──────────────────────────────
app.get("/api/profile", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Check NGO first
    const ngo = await NGO.findOne({ email });
    if (ngo) {
      return res.json({ success: true, type: "ngo", data: ngo });
    }

    // Check Volunteer
    const volunteer = await Volunteer.findOne({ email });
    if (volunteer) {
      return res.json({ success: true, type: "volunteer", data: volunteer });
    }

    return res.status(404).json({ success: false, message: "Profile not found" });
  } catch (error) {
    console.error("❌ Profile fetch error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// ── 4. Get Matches ─────────────────────────────────────────
//    If user is NGO  → return matching Volunteers
//    If user is Volunteer → return matching NGOs
app.get("/api/matches", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Check if user is an NGO
    const ngo = await NGO.findOne({ email });
    if (ngo) {
      // Return volunteers that match the NGO's category
      const volunteers = await Volunteer.find().limit(20);
      return res.json({ success: true, type: "ngo", matches: volunteers });
    }

    // Check if user is a Volunteer
    const volunteer = await Volunteer.findOne({ email });
    if (volunteer) {
      // Return NGOs that are looking for volunteers
      const ngos = await NGO.find().limit(20);
      return res.json({ success: true, type: "volunteer", matches: ngos });
    }

    return res.status(404).json({ success: false, message: "User not found", matches: [] });
  } catch (error) {
    console.error("❌ Matches fetch error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// ── Server Start ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});