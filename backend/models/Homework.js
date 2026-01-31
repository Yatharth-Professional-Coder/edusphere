const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
    section: {
        type: String, // Optional, if homework is section-specific
    },
    subject: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Homework', homeworkSchema);
