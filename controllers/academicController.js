const AcademicSession = require("../models/AcademicSession");
const mongoose = require("mongoose");

// // Create a new academic session
// exports.createSession = async (req, res) => {
//   try {
//     const { AcademicSession, startDate, endDate, terms, isCurrent } = req.body;

//     // If isCurrent is true, ensure no other session is marked current
//     if (isCurrent) {
//       await AcademicSession.updateMany({}, { isCurrent: false });
//     }

//     const newSession = await AcademicSession.create({
//       AcademicSession,
//       startDate,
//       endDate,
//       terms,
//       isCurrent,
//     });

//     res.status(201).json({ message: "Session created successfully", newSession });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get all academic sessions
// exports.getAllSessions = async (req, res) => {
//   try {
//     const sessions = await AcademicSession.find().sort({ startDate: -1 });
//     res.status(200).json(sessions);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get the current academic session
// exports.getCurrentSession = async (req, res) => {
//   try {
//     const currentSession = await AcademicSession.findOne({ isCurrent: true });
//     if (!currentSession) {
//       return res.status(404).json({ message: "No current session found" });
//     }
//     res.status(200).json(currentSession);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update an academic session
// exports.updateSession = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { isCurrent, ...updates } = req.body;

//     // If isCurrent is true, ensure no other session is marked current
//     if (isCurrent) {
//       await AcademicSession.updateMany({}, { isCurrent: false });
//     }

//     const updatedSession = await AcademicSession.findByIdAndUpdate(
//       id,
//       { $set: { ...updates, isCurrent } },
//       { new: true }
//     );

//     if (!updatedSession) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     res.status(200).json({ message: "Session updated successfully", updatedSession });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete an academic session
// exports.deleteSession = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedSession = await AcademicSession.findByIdAndDelete(id);

//     if (!deletedSession) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     res.status(200).json({ message: "Session deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// Create a new academic session
exports.createSession = async (req, res) => {
    try {
      const { academicSession, startDate, endDate, terms, isCurrent } = req.body;
  
      // Ensure only one session is marked as current
      if (isCurrent) {
        await AcademicSession.updateMany({ isCurrent: true }, { $set: { isCurrent: false } });
      }
  
      const newSession = await AcademicSession.create({
        academicSession,
        startDate,
        endDate,
        terms,
        isCurrent,
      });
  
      res.status(201).json({ message: "Session created successfully", newSession });
    } catch (error) {
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
  exports.updateSession = async (req, res) => {
    try {
      const { id } = req.params;
      const { isCurrent, ...updates } = req.body;
  
      if (isCurrent) {
        await AcademicSession.updateMany({ isCurrent: true }, { $set: { isCurrent: false } });
      }
  
      const updatedSession = await AcademicSession.findByIdAndUpdate(
        id,
        { $set: { ...updates, isCurrent } },
        { new: true }
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