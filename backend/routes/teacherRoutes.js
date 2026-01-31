const express = require('express');
const router = express.Router();
const { createTeacher, getTeachers } = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getTeachers)
    .post(protect, authorize('admin'), createTeacher);

module.exports = router;
