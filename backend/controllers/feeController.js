const Fee = require('../models/Fee');
const Student = require('../models/Student');

// @desc    Create a new fee record
// @route   POST /api/fees
// @access  Private (Admin only)
const createFee = async (req, res) => {
    const { studentId, amount, type, dueDate } = req.body;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const fee = await Fee.create({
            school: req.user.schoolId,
            student: studentId,
            amount,
            type,
            dueDate,
            status: 'Pending',
        });

        res.status(201).json(fee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get fees
// @route   GET /api/fees
// @access  Private (Admin, Parent, Student)
const getFees = async (req, res) => {
    try {
        let query = { school: req.user.schoolId };

        // If student/parent, only show their own fees
        if (req.user.role === 'student') {
            // Find student profile for this user
            const student = await Student.findOne({ user: req.user._id });
            if (student) {
                query.student = student._id;
            } else {
                return res.status(404).json({ message: 'Student profile not found' });
            }
        }
        // TODO: Handle parent logic (needs linking parent to student)

        const fees = await Fee.find(query)
            .populate({
                path: 'student',
                populate: { path: 'user', select: 'name email' }
            });

        res.json(fees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update fee status (e.g. mark as paid)
// @route   PUT /api/fees/:id/pay
// @access  Private (Admin only)
const updateFeeStatus = async (req, res) => {
    try {
        const fee = await Fee.findById(req.params.id);

        if (!fee) {
            return res.status(404).json({ message: 'Fee not found' });
        }

        fee.status = 'Paid';
        fee.paymentDate = Date.now();
        await fee.save();

        res.json(fee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createFee,
    getFees,
    updateFeeStatus
};
