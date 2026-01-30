const mongoose = require("mongoose");

const voteRefSchema = new mongoose.Schema({
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: "Election" },
  nomineeId: { type: mongoose.Schema.Types.ObjectId, ref: "Nominee" }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "voter"], default: "voter" },
  votes: [voteRefSchema]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
