const express = require('express');
const router = express.Router();
const { createStudent, getStudents } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, authorize('admin', 'teacher'), getStudents)
    .post(protect, authorize('admin'), createStudent);

module.exports = router;
