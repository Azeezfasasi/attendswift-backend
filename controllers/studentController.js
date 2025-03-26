const Student = require("../models/Student");

// 1️⃣ Add a new student
const { v4: uuidv4 } = require("uuid"); // Import UUID

// Function to generate a unique 9-digit number
const generateUniqueId = async () => {
    let uniqueId;
    let isUnique = false;

    while (!isUnique) {
        uniqueId = Math.floor(100000000 + Math.random() * 900000000); // 9-digit number
        const existingStudent = await Student.findOne({ uniqueId });
        if (!existingStudent) {
            isUnique = true;
        }
    }
    
    return uniqueId;
};

// Function to generate a unique 9-digit number
exports.addStudent = async (req, res) => {
    try {
        const { name, email, grade, gender, section, age } = req.body;
        
        // Generate a unique ID
        const uniqueId = await generateUniqueId();

        const student = await Student.create({
            uniqueId,
            name,
            email,
            grade,
            section,
            age,
            gender,
            attendance: [],
            absences: []
        });

        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// 2️⃣ Edit student details
exports.editStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const updates = req.body;
        const student = await Student.findByIdAndUpdate(studentId, updates, { new: true });
        if (!student) return res.status(404).json({ error: "Student not found" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3️⃣ Mark student attendance
exports.markAttendance = async (req, res) => {
    try {
        const attendanceData = req.body.attendance; // Get data from request body

        // Process attendanceData to update student attendance
        for (const item of attendanceData) {
            const student = await Student.findById(item.studentId); 
            if (student) {
                student.attendance.push({ 
                    date: new Date(),  // Use Date object for dates
                    status: item.status.toLowerCase()  // Ensure lowercase status
                });
                await student.save();
            }
        }

        res.status(200).json({ message: "Attendance marked successfully" });

    } catch (err) {
        console.error("Error in markAttendance:", err); // Log the error for debugging
        res.status(500).json({ error: err.message });
    }
};

exports.filterStudents = async (req, res) => {
    try {
        console.log("Query parameters:", req.query);
        const { grade, section, date } = req.query; // Use 'grade' instead of 'studentClass'
        const query = {};

        if (grade) query.grade = grade;
        if (section) query.section = section;

        console.log("MongoDB Query:", query);

        let students = await Student.find(query);
        // console.log("Students found (before date filter):", students);

        if (date) {
            const filterDate = new Date(date);
            console.log("Filter date:", filterDate);

            students = students.filter(student => { // Reassign students here
                return student.attendance.some(att => {
                    const attDate = new Date(att.date);
                    console.log("Attendance date:", attDate);
                    return (
                        attDate.getFullYear() === filterDate.getFullYear() &&
                        attDate.getMonth() === filterDate.getMonth() &&
                        attDate.getDate() === filterDate.getDate()
                    );
                });
            });
            console.log("Filtered students (after date filter):", students);
            return res.json(students);
        }

        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5️⃣ View past and current attendance records
exports.getAttendanceRecords = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ error: "Student not found" });

        res.json(student.attendance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 6️⃣ Student submits an absence application
exports.submitAbsenceRequest = async (req, res) => {
    try {
        const { studentId, reason } = req.body;
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ error: "Student not found" });

        student.absences.push({ date: new Date().toISOString().split("T")[0], reason, status: "pending" });
        await student.save();

        res.json({ message: "Absence request submitted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 7️⃣ Approve or reject an absence application
exports.updateAbsenceRequest = async (req, res) => {
    try {
        const { studentId } = req.params; // Get studentId from URL parameters
        const { absenceId, status } = req.body; // Add absenceId and status
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ error: "Student not found" });

        const absence = student.absences.id(absenceId); // Find absence by ID
        if (!absence) return res.status(404).json({ error: "Absence request not found" });

        absence.status = status; // Update status (approved or rejected)
        await student.save();

        res.json({ message: "Absence request updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 8️⃣ View all absence records (for all students)
exports.getAllAbsenceRequests = async (req, res) => {
    try {
        const allAbsences = await Student.find({}, 'name grade section absences');
        // Extract and flatten the absences array
        const flattenedAbsences = allAbsences.reduce((acc, student) => {
            return acc.concat(student.absences.map(absence => ({
                ...absence.toObject(),
                studentId: student._id,
                studentName: student.name,
                studentGrade: student.grade,
                studentSection: student.section
            })));
        }, []); // Initialize acc as an empty array here
        res.json(flattenedAbsences);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 7️⃣ View absence records
exports.viewAbsences = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ error: "Student not found" });

        res.json(student.absences);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 8️⃣ View student details
exports.getStudentDetails = async (req, res) => {
    try {
        const { uniqueID } = req.params; // Get unique ID from URL parameters
        const student = await Student.findOne({ uniqueID }); // Search by unique ID
        if (!student) return res.status(404).json({ error: "Student not found" });

        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 9️⃣ Get attendance by date
exports.getAttendanceByDate = async (req, res) => {
    try {
      const { date } = req.query;
      if (!date) {
        return res.status(400).json({ error: "Date is required" });
      }
  
      const filterDate = new Date(date);
      filterDate.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
  
      const nextDay = new Date(filterDate);
      nextDay.setDate(filterDate.getDate() + 1);
  
      const students = await Student.find({
        "attendance.date": {
          $gte: filterDate,
          $lt: nextDay
        }
      }, 'attendance name status'); // include status here
  
      //  Send the actual fetched data
      res.json(students);
  
    } catch (err) {
      console.error("Error in getAttendanceByDate:", err);
      res.status(500).json({ error: err.message });
    }
  };

// 9️⃣ Promote students to the next grade
exports.promoteStudents = async (req, res) => {
    try {
        const gradeOrder = ["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"];

        // Find students eligible for promotion
        const students = await Student.find({ promotionStatus: { $ne: "Promoted" } });

        for (const student of students) {
            const currentGradeIndex = gradeOrder.indexOf(student.grade);

            // If student is in a valid grade and not in the final grade
            if (currentGradeIndex !== -1 && currentGradeIndex < gradeOrder.length - 1) {
                student.grade = gradeOrder[currentGradeIndex + 1];
                student.promotionStatus = "Promoted";
            } else {
                student.promotionStatus = "Not eligible"; // Already in the final grade
            }

            await student.save();
        }

        res.status(200).json({ message: "Students promoted successfully!" });
    } catch (err) {
        console.error("Error promoting students:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Bulk update promotion status
exports.updatePromotionStatus = async (req, res) => {
    try {
      const { promotions } = req.body;
  
      // Loop through and update each student's promotionStatus
      const updates = promotions.map((item) =>
        Student.findByIdAndUpdate(item.studentId, { promotionStatus: item.status })
      );
  
      await Promise.all(updates);
  
      res.status(200).json({ message: "Promotion status updated successfully!" });
    } catch (error) {
      console.error("Error updating promotion status:", error);
      res.status(500).json({ message: "Error updating promotion status" });
    }
  };
  
