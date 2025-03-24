const express = require("express");
const router = express.Router();
const { getSubjects, addSubject, deleteSubject, editSubject } = require("../controllers/subjectController");

// /api/subjects
router.get('/', getSubjects);
router.post('/', addSubject);    
router.delete('/:id', deleteSubject);      
router.put('/:id', editSubject);          

module.exports = router;
