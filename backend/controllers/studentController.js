const User = require('../models/User');
const Student = require('../models/Student');

// @desc    Register a new student
// @route   POST /api/students
// @access  Private (Admin only)
const createStudent = async (req, res) => {
    const { name, email, password, className, section, rollNumber } = req.body;

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
            role: 'student',
            schoolId: req.user.schoolId,
        });

        // 3. Create Student Profile
        if (user) {
            const student = await Student.create({
                user: user._id,
                school: req.user.schoolId,
                className,
                section,
                rollNumber,
            });

            res.status(201).json({
                message: 'Student created successfully',
                student: {
                    ...student._doc,
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

// @desc    Get all students for the logged-in admin's school
// @route   GET /api/students
// @access  Private (Admin, Teacher)
const getStudents = async (req, res) => {
    try {
        const students = await Student.find({ school: req.user.schoolId })
            .populate('user', 'name email');
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createStudent,
    getStudents,
};
