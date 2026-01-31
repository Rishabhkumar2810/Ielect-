const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const electionRoutes = require("./routes/electionRoutes");
const nomineeRoutes = require("./routes/nomineeRoutes");
const voteRoutes = require("./routes/voteRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
const allowedOrigins = [
  "https://ielect-2.vercel.app",
  "https://ielect-z2yc-4esry12o7-rishabhs-projects-e69bd32b.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 🔥 THIS LINE FIXES PREFLIGHT
app.options("*", cors());

app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  const mongoose = require("mongoose");
  res.json({
    server: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    time: new Date().toISOString()
  });
});

app.use("/api/users", userRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/nominees", nomineeRoutes);
app.use("/api/vote", voteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
