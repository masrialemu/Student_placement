// studentRegistration.js

const mongoose = require('mongoose');

const studentRegistrationSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

const StudentRegistration = mongoose.model('StudentRegistration', studentRegistrationSchema);

module.exports = StudentRegistration;
