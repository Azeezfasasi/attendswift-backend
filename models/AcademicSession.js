const mongoose = require("mongoose");

const AcademicSessionSchema = new mongoose.Schema({
  academicSession: {
    type: String,
    required: true,
    unique: true, // Ensure each session is unique (e.g., "2024/2025")
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  terms: [
    { type: String, required: true }
  ],
    isCurrent: {
    type: Boolean,
    default: false, // Only one session should be current
  },
});

module.exports = mongoose.model("AcademicSession", AcademicSessionSchema);

