const mongoose = require("mongoose");

const nomineeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  party: { type: String, required: true },
  bio: { type: String, default: "" },
  photo: { type: String, default: "" },
  approved: { type: Boolean, default: false },
  votes: { type: Number, default: 0 },
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: "Election", default: null }
}, { timestamps: true });

module.exports = mongoose.model("Nominee", nomineeSchema);
