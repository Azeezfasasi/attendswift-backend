const express = require("express");
const router = express.Router();
const { createSession, getAllSessions, getCurrentSession, createTerm, getTermsBySession, getCurrentTerm } = require("../controllers/academicController");

// Create a new academic session
router.post("/create", createSession);
router.get("/all", getAllSessions);
router.get("/current", getCurrentSession);
router.post("/create", createTerm);
router.get("/:sessionId", getTermsBySession);
router.get("/current", getCurrentTerm);

module.exports = router;
