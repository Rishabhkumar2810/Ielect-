const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const Nominee = require("../models/Nominee");
const Election = require("../models/Election");

router.get("/health", (req, res) => res.json({ status: "OK", message: "Nominee routes loaded" }));

router.get("/", protect, admin, async (req, res) => {
  try {
    const nominees = await Nominee.find();
    res.json(nominees);
  } catch (e) {
    res.status(500).json({ message: "Error fetching nominees", error: e.message });
  }
});

router.post("/assign", protect, admin, async (req, res) => {
  try {
    const { nomineeId, electionId } = req.body;

    if (!nomineeId || !electionId) {
      return res.status(400).json({ message: "Nominee ID and Election ID are required" });
    }

    const nominee = await Nominee.findById(nomineeId);
    const election = await Election.findById(electionId);

    if (!nominee || !election)
      return res.status(404).json({ message: "Nominee or Election not found" });

    nominee.electionId = electionId;
    await nominee.save();

    if (!election.nominees.includes(nomineeId)) {
      election.nominees.push(nomineeId);
      await election.save();
    }

    res.json({ message: "Nominee assigned successfully!" });
  } catch (e) {
    res.status(500).json({ message: "Error assigning nominee", error: e.message });
  }
});


router.post("/remove", protect, admin, async (req, res) => {
  try {
    const { nomineeId, electionId } = req.body;
    const election = await Election.findById(electionId);
    const nominee = await Nominee.findById(nomineeId);
    if (!election || !nominee) return res.status(404).json({ message: "Election or Nominee not found" });

    nominee.electionId = null;
    await nominee.save();

    election.nominees = election.nominees.filter(n => n.toString() !== nomineeId);
    await election.save();

    res.json({ message: "Nominee removed successfully!" });
  } catch (e) {
    res.status(500).json({ message: "Error removing nominee", error: e.message });
  }
});

module.exports = router;
