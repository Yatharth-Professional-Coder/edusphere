const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('teacher', 'admin', 'parent'), (req, res) => {
    res.json({ message: 'Get attendance records' });
});

module.exports = router;
