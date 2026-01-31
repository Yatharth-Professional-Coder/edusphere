const School = require('../models/School');
const User = require('../models/User');

// @desc    Create a new school
// @route   POST /api/schools
// @access  Private (SuperAdmin only)
const createSchool = async (req, res) => {
    const { name, address, adminName, adminEmail, adminPassword, subscriptionPlan } = req.body;

    try {
        // 1. Validate input
        if (!name || !adminName || !adminEmail || !adminPassword) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // 2. Check if school already exists
        const schoolExists = await School.findOne({ name });
        if (schoolExists) {
            return res.status(400).json({ message: 'School with this name already exists' });
        }

        // 3. Check if admin email already exists (User model)
        const userExists = await User.findOne({ email: adminEmail });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // 4. Create the User (School Admin) first
        // We need the ID for the school, but the user needs the school ID.
        // Strategy: Create User first with null schoolId, then update it.

        const schoolAdmin = await User.create({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
        });

        // 5. Create the School
        const school = await School.create({
            name,
            address,
            adminId: schoolAdmin._id,
            subscriptionPlan: subscriptionPlan || 'free',
        });

        // 6. Update User with schoolId
        schoolAdmin.schoolId = school._id;
        await schoolAdmin.save();

        res.status(201).json({
            message: 'School and Admin created successfully',
            school,
            admin: {
                id: schoolAdmin._id,
                name: schoolAdmin.name,
                email: schoolAdmin.email,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all schools
// @route   GET /api/schools
// @access  Private (SuperAdmin only)
const getSchools = async (req, res) => {
    try {
        const schools = await School.find().populate('adminId', 'name email');
        res.json(schools);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createSchool,
    getSchools,
};
