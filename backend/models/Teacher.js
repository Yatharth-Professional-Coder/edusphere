const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
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
    subjects: [{
        type: String,
        required: true,
    }],
    classes: [{
        type: String, // e.g., "10A", "9B"
        required: true,
    }],
    qualification: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
