const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const app = express();

app.use(cors());
app.use(express.json());

// 👇 YAHAN ADD KARO
app.use("/api/transactions", require("./routes/transactions"));

app.get("/", (req, res) => {
  res.json({
    message: "SpendWise backend is running successfully!"
  });
});

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT DATABASE() AS db");

    res.json({
      status: "OK",
      database: rows[0].db,
      connected: true
    });
  } catch (error) {
    console.error("Database connection error:", error.message);
    res.status(500).json({
      status: "ERROR",
      message: "Database connection failed. Check backend configuration."
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("SpendWise backend running on port 5000");
});