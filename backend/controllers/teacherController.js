const User = require('../models/User');
const Teacher = require('../models/Teacher');

// @desc    Register a new teacher
// @route   POST /api/teachers
// @access  Private (Admin only)
const createTeacher = async (req, res) => {
    const { name, email, password, subjects, classes, qualification } = req.body;

    try {
        // 1. Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Create User linked to the admin's school
        const user = await User.create({
            name,
            email,
            password,
            role: 'teacher',
            schoolId: req.user.schoolId, // Inherit from the Admin creating them
        });

        // 3. Create Teacher Profile
        if (user) {
            const teacher = await Teacher.create({
                user: user._id,
                school: req.user.schoolId,
                subjects,
                classes,
                qualification,
            });

            res.status(201).json({
                message: 'Teacher created successfully',
                teacher: {
                    ...teacher._doc,
                    name: user.name,
                    email: user.email,
                }
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all teachers for the logged-in admin's school
// @route   GET /api/teachers
// @access  Private (Admin, Teacher, Student, Parent)
const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find({ school: req.user.schoolId })
            .populate('user', 'name email');
        res.json(teachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createTeacher,
    getTeachers,
};
