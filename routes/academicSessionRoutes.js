// const express = require("express");
// const router = express.Router();
// const { createSession, getAllSessions, getCurrentSession, createTerm, getTermsBySession, getCurrentTerm } = require("../controllers/academicController");

// // Create a new academic session
// router.post("/session/create", createSession); 
// router.get("/session/all", getAllSessions);
// router.get("/session/current", getCurrentSession);
// router.post("/term/create", createTerm);
// router.get("/term/:sessionId", getTermsBySession); 
// router.get("/term/current", getCurrentTerm);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createSession,
  getAllSessions,
  getCurrentSession,
  updateSession,
  deleteSession,
} = require("../controllers/academicController");

router.post("/", createSession);
router.get("/", getAllSessions);
router.get("/current", getCurrentSession);
router.put("/:id", updateSession);
router.delete("/:id", deleteSession);

module.exports = router;
