const express = require("express");
const router = express.Router();
const {
  createSession,
  getAllSessions,
  getCurrentSession,
  updateSession,
  deleteSession,
  setCurrentSession,
} = require("../controllers/academicController");

// /api/academicsessions
router.post("/", createSession);
router.get("/", getAllSessions);
router.get("/current", getCurrentSession);
router.put("/:id", updateSession);
router.delete("/:id", deleteSession);
router.patch("/:id/setCurrent", setCurrentSession);

module.exports = router;
