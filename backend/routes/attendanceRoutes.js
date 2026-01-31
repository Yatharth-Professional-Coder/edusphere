const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

const { markAttendance, getAttendance, getStudentAttendance } = require('../controllers/attendanceController');

router.post('/', protect, authorize('teacher', 'admin'), markAttendance);
router.get('/', protect, authorize('teacher', 'admin', 'parent'), getAttendance);
router.get('/student/:studentId', protect, authorize('student', 'parent', 'admin'), getStudentAttendance);

module.exports = router;
