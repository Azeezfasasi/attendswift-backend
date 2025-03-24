const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  section: { type: String, required: true },
  grade: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Subject", SubjectSchema);
