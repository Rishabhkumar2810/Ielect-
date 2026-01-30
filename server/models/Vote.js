const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  voterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: "Election", required: true },
  nomineeId: { type: mongoose.Schema.Types.ObjectId, ref: "Nominee", required: true }
}, { timestamps: true });

voteSchema.index({ voterId: 1, electionId: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);
