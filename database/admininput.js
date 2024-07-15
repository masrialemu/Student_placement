const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
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
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    guardianName: {
        type: String,
        required: true
    },
    guardianContactNumber: {
        type: String,
        required: true
    },
    emergencyContactNumber: {
        type: String,
        required: true
    },
    schoolOrUniversityName: {
        type: String,
        required: true
    },
    gradeOrClass: {
        type: String,
        required: true
    },
    academicYear: {
        type: Number,
        required: true
    },
    entranceExamResults: {
        type: Number,
        required: true
    }
});

const Student = mongoose.model('admininput', studentSchema);

module.exports = Student;
