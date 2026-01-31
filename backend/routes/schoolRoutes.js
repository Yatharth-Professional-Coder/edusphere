const express = require('express');
const router = express.Router();
const { createSchool, getSchools } = require('../controllers/schoolController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, authorize('superadmin'), getSchools)
    .post(protect, authorize('superadmin'), createSchool);

module.exports = router;
