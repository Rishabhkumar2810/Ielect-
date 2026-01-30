const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  nominees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Nominee" }]
}, { timestamps: true });

module.exports = mongoose.model("Election", electionSchema);
