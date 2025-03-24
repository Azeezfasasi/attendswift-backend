const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    uniqueId: { type: Number, unique: true, required: true }, // 9-digit unique ID
    name: String,
    email: String,
    grade: String,
    gender: String,
    section: String,
    age: { type: Number, required: true, min: 3, max: 100 },
    attendance: [
        {
            date: { type: Date, default: Date.now },
            status: { type: String, enum: ["present", "absent", "late"] }
        }
    ],
    absences: [
        {
            date: { type: Date, default: Date.now },
            reason: String,
            status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
        }
    ]
});

module.exports = mongoose.model("Student", StudentSchema);

