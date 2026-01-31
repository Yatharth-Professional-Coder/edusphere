const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// @desc    Mark attendance for a class
// @route   POST /api/attendance
// @access  Teacher, Admin
const markAttendance = async (req, res) => {
    const { date, className, section, records } = req.body; // Frontend sends className, we map to 'class'
    const schoolId = req.user.schoolId;

    try {
        // Check if attendance already exists for this day/class/section
        // We need to match the date range for the entire day
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const existingAttendance = await Attendance.findOne({
            school: schoolId,
            date: {
                $gte: startDate,
                $lt: endDate
            },
            class: className,
            section,
        });

        if (existingAttendance) {
            // Update existing record
            existingAttendance.records = records.map(r => ({
                student: r.studentId,
                status: r.status
            }));
            const updatedAttendance = await existingAttendance.save();
            return res.json(updatedAttendance);
        }

        // Create new attendance
        const attendance = new Attendance({
            school: schoolId,
            date: startDate,
            class: className,
            section,
            records: records.map(r => ({
                student: r.studentId,
                status: r.status
            })),
        });

        const createdAttendance = await attendance.save();
        res.status(201).json(createdAttendance);
    } catch (error) {
        console.error("Mark Attendance Error:", error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get attendance for a specific class and date
// @route   GET /api/attendance
// @access  Teacher, Admin
const getAttendance = async (req, res) => {
    const { date, className, section } = req.query;
    const schoolId = req.user.schoolId;

    try {
        const query = { school: schoolId };

        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            query.date = { $gte: startDate, $lt: endDate };
        }

        if (className) query.class = className;
        if (section) query.section = section;

        const attendance = await Attendance.findOne(query)
            .populate({
                path: 'records.student',
                select: 'name rollNumber user', // Select fields from Student model
                populate: {
                    path: 'user', // Populate User details from Student model
                    select: 'name email'
                }
            });

        if (!attendance) {
            return res.status(404).json({ message: 'Attendance not marked for this date' });
        }

        // Transform for frontend
        const formattedRecords = attendance.records.map(r => ({
            studentId: r.student._id,
            name: r.student.user ? r.student.user.name : 'Unknown',
            rollNumber: r.student.rollNumber,
            status: r.status,
            _id: r._id
        }));

        res.json({
            ...attendance.toObject(),
            records: formattedRecords
        });
    } catch (error) {
        console.error("Get Attendance Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get attendance for a specific student (for Student/Parent view)
// @route   GET /api/attendance/student/:studentId
// @access  Student, Parent, Admin
const getStudentAttendance = async (req, res) => {
    const schoolId = req.user.schoolId;
    const { studentId } = req.params;

    try {
        const attendanceRecords = await Attendance.find({
            school: schoolId,
            'records.student': studentId
        }).sort({ date: -1 });

        // Filter out just the record for this student
        const studentRecords = attendanceRecords.map(doc => {
            const record = doc.records.find(r => r.student.toString() === studentId);
            return {
                date: doc.date,
                status: record ? record.status : 'Unknown',
                className: doc.class,
                _id: doc._id
            };
        });

        res.json(studentRecords);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { markAttendance, getAttendance, getStudentAttendance };
