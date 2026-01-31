const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
    },
    className: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    rollNumber: {
        type: String,
        required: true,
    },
    // Add other student-specific fields here (e.g., dob, guardian info)
}, { timestamps: true });

// Compound index to ensure unique roll number per class in a school
studentSchema.index({ school: 1, className: 1, section: 1, rollNumber: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);
