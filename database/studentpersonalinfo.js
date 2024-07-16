const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true,
        minlength: 9 // Ensure studentId is at least 9 characters long
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    schoolcode: {
        type: String,
        required: true,
        minlength: 9 // Ensure schoolcode is at least 9 characters long
    },
    emergencyContactNumber: {
        type: String,
        required: true
    },
    schoolOrUniversityName: {
        type: String,
        required: true
    },
    academicYear: {
        type: Number,
        required: true
    }
});

const Student = mongoose.model('studentinfo', studentSchema);

module.exports = Student;
