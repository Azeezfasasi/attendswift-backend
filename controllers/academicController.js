const AcademicSession = require("../models/AcademicSession");
const mongoose = require("mongoose");

// Create a new academic session
// exports.createSession = async (req, res) => {
//     try {
//       console.log("Incoming data: ", req.body);
  
//       const { academicSession, startDate, endDate, terms, isCurrent } = req.body;
  
//       if (!academicSession || !startDate || !endDate || !terms) {
//         return res.status(400).json({ error: "Missing required fields" });
//       }
  
//       if (!Array.isArray(terms)) {
//         return res.status(400).json({ error: "Terms must be an array" });
//       }
  
//       if (isCurrent) {
//         await AcademicSession.updateMany({ isCurrent: true }, { $set: { isCurrent: false } });
//       }

//        // Check for duplicates before insertion
//         const existingSession = await AcademicSession.findOne({ academicSession });
//         if (existingSession) {
//         return res.status(409).json({ message: "Session already exists" });
//         }
  
//       const newSession = await AcademicSession.create({
//         academicSession,
//         startDate,
//         endDate,
//         terms,
//         isCurrent,
//       });
  
//       res.status(201).json({ message: "Session created successfully", newSession });
//     } catch (error) {
//       console.error("Error adding session: ", error);
//       res.status(500).json({ error: error.message });
//     }
//   };
exports.createSession = async (req, res) => {
    try {
      const { academicSession, startDate, endDate, terms, isCurrent } = req.body;
  
      if (!academicSession || !startDate || !endDate || !terms) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      if (!Array.isArray(terms)) {
        return res.status(400).json({ error: "Terms must be an array" });
      }
  
      if (new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ error: "Start date must be before end date" });
      }
  
      // Ensure no overlapping dates
      const overlappingSession = await AcademicSession.findOne({
        $or: [
          { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
        ],
      });
      if (overlappingSession) {
        return res.status(409).json({ error: "Session with overlapping dates exists" });
      }
  
      // Ensure only one isCurrent session
      if (isCurrent) {
        await AcademicSession.updateMany({ isCurrent: true }, { $set: { isCurrent: false } });
      }
  
      const newSession = await AcademicSession.create({
        academicSession,
        startDate,
        endDate,
        terms: terms.map((term) => term.trim()),
        isCurrent: isCurrent || false,
      });
  
      res.status(201).json({ message: "Session created successfully", newSession });
    } catch (error) {
      console.error("Error adding session: ", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get all academic sessions
  exports.getAllSessions = async (req, res) => {
    try {
      const sessions = await AcademicSession.find().sort({ startDate: -1 });
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get the current academic session
  exports.getCurrentSession = async (req, res) => {
    try {
      const currentSession = await AcademicSession.findOne({ isCurrent: true });
      if (!currentSession) {
        return res.status(404).json({ message: "No current session found" });
      }
      res.status(200).json(currentSession);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update an academic session
//   exports.updateSession = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { isCurrent, ...updates } = req.body;
  
//       if (isCurrent) {
//         await AcademicSession.updateMany({ isCurrent: true }, { $set: { isCurrent: false } });
//       }
  
//       const updatedSession = await AcademicSession.findByIdAndUpdate(
//         id,
//         { $set: { ...updates, isCurrent } },
//         { new: true }
//       );
  
//       if (!updatedSession) {
//         return res.status(404).json({ message: "Session not found" });
//       }
  
//       res.status(200).json({ message: "Session updated successfully", updatedSession });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };
exports.updateSession = async (req, res) => {
    try {
      const { id } = req.params;
      const { isCurrent, startDate, endDate, ...updates } = req.body;
  
      if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ error: "Start date must be before end date" });
      }
  
      if (isCurrent) {
        await AcademicSession.updateMany({ isCurrent: true }, { $set: { isCurrent: false } });
      }
  
      const updatedSession = await AcademicSession.findByIdAndUpdate(
        id,
        { $set: { ...updates, startDate, endDate, isCurrent } },
        { new: true, runValidators: true }
      );
  
      if (!updatedSession) {
        return res.status(404).json({ message: "Session not found" });
      }
  
      res.status(200).json({ message: "Session updated successfully", updatedSession });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };  
  
  // Delete an academic session
  exports.deleteSession = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedSession = await AcademicSession.findByIdAndDelete(id);
  
      if (!deletedSession) {
        return res.status(404).json({ message: "Session not found" });
      }
  
      res.status(200).json({ message: "Session deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Set a session as current
  exports.setCurrentSession = async (req, res) => {
    try {
      const { id } = req.params;
  
      await AcademicSession.updateMany({ isCurrent: true }, { $set: { isCurrent: false } });
      const updatedSession = await AcademicSession.findByIdAndUpdate(
        id,
        { isCurrent: true },
        { new: true }
      );
  
      if (!updatedSession) {
        return res.status(404).json({ message: "Session not found" });
      }
  
      res.status(200).json({ message: "Session set as current", updatedSession });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };