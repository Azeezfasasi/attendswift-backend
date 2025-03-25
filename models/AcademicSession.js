const mongoose = require("mongoose");

const AcademicSessionSchema = new mongoose.Schema({
      academicSession: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      startDate: {
        type: Date,
        required: true,
        validate: {
          validator: function (value) {
            return this.endDate ? value < this.endDate : true;
          },
          message: "Start date must be before end date.",
        },
      },
      endDate: {
        type: Date,
        required: true,
      },
      terms: {
        type: [String],
        required: true,
        validate: {
          validator: function (value) {
            return value.length > 0 && new Set(value).size === value.length;
          },
          message: "Terms must be unique and not empty.",
        },
      },
      isCurrent: {
        type: Boolean,
        default: false, // Ensure only one is set in the controller
      },
      });

module.exports = mongoose.model("AcademicSession", AcademicSessionSchema);

