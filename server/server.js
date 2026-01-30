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
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000", credentials: true }));
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
