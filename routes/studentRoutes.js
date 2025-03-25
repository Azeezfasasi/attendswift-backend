const express = require("express");
const router = express.Router();
const StudentController = require("../controllers/studentController");

router.post("/add", StudentController.addStudent);
router.put("/edit/:studentId", StudentController.editStudent);
router.post("/mark-attendance", StudentController.markAttendance);
router.get("/filter", StudentController.filterStudents);
router.get("/attendance/:studentId", StudentController.getAttendanceRecords);
router.post("/absence-request", StudentController.submitAbsenceRequest);
router.put("/absence-request/:studentId", StudentController.updateAbsenceRequest);
router.get("/absence-requests", StudentController.getAllAbsenceRequests);
router.get("/absences/:studentId", StudentController.viewAbsences);
router.get("/:studentId", StudentController.getStudentDetails);
router.get("/attendance", StudentController.getAttendanceByDate);
router.put("/promote", StudentController.promoteStudents);

module.exports = router;
