const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
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
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String, // e.g., "Tuition", "Transport", "Exam"
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Paid', 'Pending', 'Overdue'],
        default: 'Pending',
    },
    paymentDate: {
        type: Date,
    },
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
