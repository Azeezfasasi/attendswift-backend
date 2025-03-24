const AcademicSession = require("../models/AcademicSession.js");
const mongoose = require("mongoose");
const Subject = require("../models/Subject");

// Create a new academic session
const createSession = async (req, res) => {
  try {
    const { year, isCurrent } = req.body;

    // Ensure only one session is current
    if (isCurrent) {
      await AcademicSession.updateMany({}, { isCurrent: false });
    }

    const session = new AcademicSession({ year, isCurrent });
    await session.save();

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: "Failed to create session" });
  }
};

// Get all academic sessions
const getAllSessions = async (req, res) => {
  try {
    const sessions = await AcademicSession.find();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching sessions" });
  }
};

// Get current academic session
const getCurrentSession = async (req, res) => {
  try {
    const session = await AcademicSession.findOne({ isCurrent: true });
    if (!session) return res.status(404).json({ error: "No active session" });

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: "Error fetching current session" });
  }
};

// Create a new term
const createTerm = async (req, res) => {
    try {
      const { name, sessionId, isCurrent } = req.body;
  
      const session = await AcademicSession.findById(sessionId);
      if (!session) return res.status(404).json({ error: "Session not found" });
  
      // Ensure only one current term per session
      if (isCurrent) {
        await Term.updateMany({ session: sessionId }, { isCurrent: false });
      }
  
      const term = new Term({ name, session: sessionId, isCurrent });
      await term.save();
  
      res.status(201).json(term);
    } catch (error) {
      res.status(500).json({ error: "Failed to create term" });
    }
  };
  
  // Get all terms for a session
const getTermsBySession = async (req, res) => {
    try {
      const { sessionId } = req.params;
      const terms = await Term.find({ session: sessionId }).populate("session");
      res.status(200).json(terms);
    } catch (error) {
      res.status(500).json({ error: "Error fetching terms" });
    }
  };
  
  // Get current term
const getCurrentTerm = async (req, res) => {
    try {
      const term = await Term.findOne({ isCurrent: true }).populate("session");
      if (!term) return res.status(404).json({ error: "No active term" });
  
      res.status(200).json(term);
    } catch (error) {
      res.status(500).json({ error: "Error fetching current term" });
    }
  };

  const seedAcademicSession = async () => {
    try {
      await AcademicSession.create({
        name: "2024/2025",
        startDate: new Date("2024-09-01"),
        endDate: new Date("2025-07-15"),
        terms: [
          { name: "First Term", isCurrent: true },
          { name: "Second Term", isCurrent: false },
          { name: "Third Term", isCurrent: false },
        ],
        isCurrent: true,
      });
      console.log("Academic session seeded successfully");
    } catch (error) {
      console.error("Error seeding session:", error);
    }
  };
  
//   seedAcademicSession();

module.exports = { createSession, getAllSessions, getCurrentSession, createTerm, getTermsBySession, getCurrentTerm, seedAcademicSession };