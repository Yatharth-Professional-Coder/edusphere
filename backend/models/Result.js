const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    examName: {
        type: String, // e.g., "Mid-Term", "Finals"
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
    subjects: [{
        name: { type: String, required: true },
        marksObtained: { type: Number, required: true },
        totalMarks: { type: Number, required: true },
        grade: { type: String },
    }],
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
