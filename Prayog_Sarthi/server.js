const express = require("express");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db");
const NGO = require("./models/NGO");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// 🔽 PASTE HERE (AFTER app initialization)
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🔽 your existing routes (keep them below or above)
app.post("/api/register-ngo", async (req, res) => {
  try {
    console.log(req.body); // 👈 add this for debugging

    // Example save
    const newNgo = new NGO(req.body);
    await newNgo.save();

    res.status(201).json({ message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});

// 🔽 server start (keep at bottom)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});