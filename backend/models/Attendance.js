const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    records: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late', 'Leave'],
            required: true,
        },
    }],
}, { timestamps: true });

// Ensure one attendance record per class per day
attendanceSchema.index({ school: 1, class: 1, section: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
