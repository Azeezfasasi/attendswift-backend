const mongoose = require("mongoose");
const Student = require("./models/Student");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yourDatabaseName", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Function to generate a unique 9-digit number
const generateUniqueId = async () => {
    let uniqueId;
    let isUnique = false;

    while (!isUnique) {
        uniqueId = Math.floor(100000000 + Math.random() * 900000000); // Generate a 9-digit number
        const existingStudent = await Student.findOne({ uniqueId });
        if (!existingStudent) {
            isUnique = true;
        }
    }

    return uniqueId;
};

// Function to update students without a uniqueId
const updateStudents = async () => {
    try {
        const studentsWithoutId = await Student.find({ uniqueId: { $exists: false } });

        for (let student of studentsWithoutId) {
            student.uniqueId = await generateUniqueId();
            await student.save();
            console.log(`Updated student ${student.name} with uniqueId: ${student.uniqueId}`);
        }

        console.log("✅ All students updated successfully.");
        mongoose.disconnect();
    } catch (error) {
        console.error("Error updating students:", error);
        mongoose.disconnect();
    }
};

// Run the update function
updateStudents();
