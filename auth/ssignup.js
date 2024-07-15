// routes/student.js

const express = require('express');
const router = express.Router();
const StudentRegistration = require('../database/studentRegistration.js');
const AdminInput = require('../database/admininput');

// Student Registration
router.post('/register', async (req, res) => {
    try {
        const { studentId, emailAddress, password } = req.body;

        // Check if the studentId exists in AdminInput
        const adminAssignedStudent = await AdminInput.findOne({ studentId });
        if (!adminAssignedStudent) {
            return res.status(400).json({ message: 'Invalid studentId provided' });
        }

        // Create new student registration record
        const newStudentRegistration = new StudentRegistration({ studentId, emailAddress, password });
        await newStudentRegistration.save();

        res.status(201).json(newStudentRegistration);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Student Login
router.post('/login', async (req, res) => {
    try {
        const { emailAddress, password } = req.body;

        // Find the student by emailAddress and password
        const student = await StudentRegistration.findOne({ emailAddress, password });
        if (!student) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', student });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
