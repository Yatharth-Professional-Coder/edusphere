const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('teacher', 'student', 'parent'), (req, res) => {
    res.json({ message: 'Get homework' });
});

module.exports = router;
