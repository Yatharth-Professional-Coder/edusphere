const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// @desc    Mark attendance for a class
// @route   POST /api/attendance
// @access  Teacher, Admin
const markAttendance = async (req, res) => {
    const { date, className, section, records } = req.body;
    const schoolId = req.user.schoolId;

    try {
        // Check if attendance already exists for this day/class/section
        const existingAttendance = await Attendance.findOne({
            schoolId,
            date: new Date(date),
            className,
            section,
        });

        if (existingAttendance) {
            // Update existing record
            existingAttendance.records = records;
            const updatedAttendance = await existingAttendance.save();
            return res.json(updatedAttendance);
        }

        // Create new attendance
        const attendance = new Attendance({
            schoolId,
            date: new Date(date),
            className,
            section,
            records,
        });

        const createdAttendance = await attendance.save();
        res.status(201).json(createdAttendance);
    } catch (error) {
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
        const query = { schoolId };
        if (date) query.date = new Date(date);
        if (className) query.className = className;
        if (section) query.section = section;

        const attendance = await Attendance.findOne(query).populate('records.studentId', 'user');

        if (!attendance) {
            // Return 404 but with info so frontend can handle "not marked yet"
            return res.status(404).json({ message: 'Attendance not marked for this date' });
        }

        // We need to populate the user details inside the student reference
        // The previous populate might not go deep enough depending on structure
        // records.studentId is a Student document. Student has 'user' field ref User.
        // .populate({ path: 'records.studentId', populate: { path: 'user', select: 'name email' } })

        const populatedAttendance = await Attendance.findOne(query)
            .populate({
                path: 'records.studentId',
                populate: {
                    path: 'user',
                    select: 'name rollNumber'
                }
            });

        res.json(populatedAttendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get attendance for a specific student (for Student/Parent view)
// @route   GET /api/attendance/student/:studentId
// @access  Student, Parent, Admin
const getStudentAttendance = async (req, res) => {
    // If student, can only view own. If parent, their child. If admin, any.
    // For simplicity, we trust the ID passed if authorized role.
    const schoolId = req.user.schoolId;
    const { studentId } = req.params;

    try {
        const attendanceRecords = await Attendance.find({
            schoolId,
            'records.studentId': studentId
        }).select('date records');

        // Filter out just the record for this student
        const studentRecords = attendanceRecords.map(doc => {
            const record = doc.records.find(r => r.studentId.toString() === studentId);
            return {
                date: doc.date,
                status: record ? record.status : 'Unknown', // Should always be found if querying correctly
                _id: doc._id
            };
        });

        res.json(studentRecords);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { markAttendance, getAttendance, getStudentAttendance };
