const express = require("express");
const router = express.Router();

// Create a new academic session
router.post("/create", async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;
    const session = new AcademicSession({ name, startDate, endDate });
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: "Error creating session", error });
  }
});

// Get all academic sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await AcademicSession.find();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sessions" });
  }
});

// Set current academic session
router.put("/set-current/:id", async (req, res) => {
  try {
    await AcademicSession.updateMany({}, { isCurrent: false }); // Reset all
    const session = await AcademicSession.findByIdAndUpdate(req.params.id, { isCurrent: true });
    res.status(200).json({ message: "Current session updated", session });
  } catch (error) {
    res.status(500).json({ message: "Error updating session" });
  }
});

// Add a term to a session
router.post("/:sessionId/term", async (req, res) => {
    try {
      const { name } = req.body;
      const session = await AcademicSession.findById(req.params.sessionId);
      session.terms.push({ name });
      await session.save();
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ message: "Error adding term", error });
    }
  });
  
  // Set the current term
  router.put("/:sessionId/set-current-term/:termId", async (req, res) => {
    try {
      const session = await AcademicSession.findById(req.params.sessionId);
      session.terms.forEach((term) => (term.isCurrent = false)); // Reset all
      const term = session.terms.id(req.params.termId);
      term.isCurrent = true;
      await session.save();
      res.status(200).json({ message: "Current term updated", term });
    } catch (error) {
      res.status(500).json({ message: "Error updating term", error });
    }
  });

  // Promote students to the next grade
router.put("/promote-students", async (req, res) => {
    try {
      const promotionMap = {
        "JSS 1": "JSS 2",
        "JSS 2": "JSS 3",
        "JSS 3": "SSS 1",
        "SSS 1": "SSS 2",
        "JSS 2": "SSS 3",
      };
  
      const students = await Student.find();
      for (const student of students) {
        if (promotionMap[student.currentGrade]) {
          student.currentGrade = promotionMap[student.currentGrade];
          student.promotionStatus = true;
          await student.save();
        }
      }
  
      res.status(200).json({ message: "Students promoted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Promotion failed", error });
    }
  });
  
  

module.exports = router;
