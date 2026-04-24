const express = require("express");
const path = require("path");

const app = express();

// 🔽 PASTE HERE (AFTER app initialization)
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🔽 your existing routes (keep them below or above)
app.post("/api/register-ngo", (req, res) => {
  // your logic
});

// 🔽 server start (keep at bottom)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});