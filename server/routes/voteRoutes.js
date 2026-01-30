const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Vote = require("../models/Vote");
const Nominee = require("../models/Nominee");
const Election = require("../models/Election");
const mongoose = require("mongoose");

router.post("/", protect, async (req, res) => {
  try {
    const { nomineeId, electionId } = req.body;
    if (!nomineeId || !electionId) return res.status(400).json({ message: "Nominee and Election ID are required." });

    const election = await Election.findById(electionId).populate("nominees");
    if (!election) return res.status(404).json({ message: "Election not found." });

    const now = new Date();
    if (now < election.startDate || now > election.endDate) return res.status(400).json({ message: "Voting not active for this election." });

    const isNomineeInElection = election.nominees.some(n => n._id.toString() === nomineeId);
    if (!isNomineeInElection) return res.status(400).json({ message: "This nominee is not part of this election." });

    const existing = await Vote.findOne({ voterId: req.user._id, electionId });
    if (existing) return res.status(400).json({ message: "You have already voted in this election." });

    await Vote.create({ voterId: req.user._id, electionId, nomineeId });
    await Nominee.findByIdAndUpdate(nomineeId, { $inc: { votes: 1 } });

    res.status(201).json({ message: "Vote cast successfully!" });
  } catch (e) {
    console.error("Vote error:", e);
    res.status(500).json({ message: "Error casting vote", error: e.message });
  }
});

router.get("/results/:electionId", protect, async (req, res) => {
  try {
    const electionId = req.params.electionId;
    const results = await Vote.aggregate([
      { $match: { electionId: new mongoose.Types.ObjectId(electionId) } },
      { $group: { _id: "$nomineeId", votes: { $sum: 1 } } },
      { $lookup: { from: "nominees", localField: "_id", foreignField: "_id", as: "nominee" } },
      { $project: { nominee: 1, votes: 1 } }
    ]);
    res.json(results);
  } catch (e) {
    res.status(500).json({ message: "Error fetching results", error: e.message });
  }
});

module.exports = router;
