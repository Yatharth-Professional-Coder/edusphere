const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public (for initial setup), then Protected (Admin only)
const registerUser = async (req, res) => {
    const { name, email, password, role, schoolId } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
            schoolId: schoolId || null // Superadmin has no schoolId
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log(`Login attempt for: ${email}`);

    try {
        // Check for user email
        const user = await User.findOne({ email });
        console.log(`User found: ${user ? 'Yes' : 'No'}`);

        if (user && (await user.matchPassword(password))) {
            console.log('Password match success');
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId,
                token: generateToken(user.id),
            });
        } else {
            console.log('Password match failed or user not found');
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login Error Details:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
