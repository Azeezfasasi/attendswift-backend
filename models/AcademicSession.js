const mongoose = require("mongoose");

const AcademicSessionSchema = new mongoose.Schema({
  name: {
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
    {
      name: String, // e.g., "First Term"
      isCurrent: { type: Boolean, default: false },
    },
  ],
  isCurrent: {
    type: Boolean,
    default: false, // Only one session should be current
  },
});

module.exports = mongoose.model("AcademicSession", AcademicSessionSchema);

