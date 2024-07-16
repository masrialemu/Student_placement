const express = require('express');
const router = express.Router();
const Student = require('../database/studentpersonalinfo');
const { auth, isAdmin } = require('../middleware/auth');

// Create a new student record
router.post('/admin/studentinfo', auth, isAdmin, async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all students
router.get('/admin/studentinfo', auth,isAdmin, async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single student by ID
router.get('/student/studentinfo/studentid', async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: 'Student ID is required' });
        }

        // Find the student by studentId
        const student = await Student.findOne({ studentId: id });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a student record
router.put('/admin/studentinfo/:id', auth, isAdmin, async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a student record
router.delete('/admin/studentinfo/:id', auth, isAdmin, async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
