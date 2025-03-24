const User = require("../models/User");
const mongoose = require("mongoose");
const Subject = require("../models/Subject");

// Fetch Subjects based on grade and section
const getSubjects = async (req, res) => {
    try {
      const { name, grade, section, description } = req.query;  

      if (!grade || !section) {
        return res.status(400).json({ error: "Grade and section are required" });
      }
  
      // Perform case-insensitive search
      const subjects = await Subject.find({
        grade: { $regex: new RegExp(`^${grade}$`, "i") }, 
        section: { $regex: new RegExp(`^${section}$`, "i") },
        name: { $regex: new RegExp(`^${name || ""}`, "i") },
        description: { $regex: new RegExp(`^${description || ""}`, "i") },
      });
  
      res.status(200).json(subjects);
    } catch (error) {
      console.error("❌ Error fetching subjects:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  
// 2. Add New Subject
const addSubject = async (req, res) => {
  try {
    const { name, grade, section, description } = req.body;

    const newSubject = new Subject({
      name,
      grade,
      section,
      description,
    });

    await newSubject.save();
    res.status(201).json({ message: "Subject added successfully", newSubject });
  } catch (error) {
    console.error("Error in addSubject:", error);
    res.status(500).json({ error: "Error adding subject" });
  }
};  

// 3. Delete Subject
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    await Subject.findByIdAndDelete(id);
    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting subject' });
  }
};

// 4. Edit Subject
const editSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, class: className, section, teacherId } = req.body;

    // Ensure teacher exists
    if (teacherId) {
      const teacher = await User.findById(teacherId);
      if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { name, class: className, section, teacher: teacherId },
      { new: true }
    );
    res.status(200).json({ message: 'Subject updated successfully', subject: updatedSubject });
  } catch (error) {
    res.status(500).json({ error: 'Error updating subject' });
  }
};

module.exports = { getSubjects, addSubject, deleteSubject, editSubject };