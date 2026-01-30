const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const Election = require("../models/Election");

router.post("/", protect, admin, async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    if (!title || !startDate || !endDate) return res.status(400).json({ message: "All required fields missing" });
    const election = await Election.create({ title, description, startDate, endDate });
    res.status(201).json({ message: "Election created successfully", election });
  } catch (e) {
    res.status(500).json({ message: "Error creating election", error: e.message });
  }
});

router.get("/", protect, admin, async (req, res) => {
  try {
    const elections = await Election.find().populate("nominees");
    res.json(elections);
  } catch (e) {
    res.status(500).json({ message: "Error fetching elections", error: e.message });
  }
});

router.get("/active", protect, async (req, res) => {
  try {
    const now = new Date();
    const elections = await Election.find({ startDate: { $lte: now }, endDate: { $gte: now } }).populate("nominees");
    res.json(elections);
  } catch (e) {
    res.status(500).json({ message: "Error fetching active elections", error: e.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id).populate("nominees");
    if (!election) return res.status(404).json({ message: "Election not found" });
    res.json(election);
  } catch (e) {
    res.status(500).json({ message: "Error fetching election", error: e.message });
  }
});

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).json({ message: "Election not found" });
    await election.deleteOne();
    res.json({ message: "Election deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: "Error deleting election", error: e.message });
  }
});

router.get("/health/check", (req, res) => {
  res.json({ status: "OK", message: "Election routes are running ✅", timestamp: new Date() });
});

module.exports = router;
