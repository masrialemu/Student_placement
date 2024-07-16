const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const CourseResult = require('../database/courseResult');
const StudentRegistration = require('../database/studentRegistration');

// Middleware to check if studentId exists
const checkStudentIdExists = async (req, res, next) => {
    const { studentId } = req.body;

    try {
        const existingStudent = await StudentRegistration.findOne({ studentId });
        if (!existingStudent) {
            return res.status(404).json({ message: 'Student ID not found' });
        }
        next(); // Continue to the next middleware or route handler
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new course result
router.post('/admin/course', auth, isAdmin, checkStudentIdExists, async (req, res) => {
    const { studentId, courses, category } = req.body;

    try {
        const courseResult = new CourseResult({ studentId, courses, category });
        courseResult.calculateTotalScore();
        await courseResult.save();
        res.status(201).json(courseResult);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a course result
router.put('/admin/course/:id', auth, isAdmin, checkStudentIdExists, async (req, res) => {
    const { courses, category } = req.body;

    try {
        const courseResult = await CourseResult.findById(req.params.id);
        if (!courseResult) {
            return res.status(404).json({ message: 'Course result not found' });
        }

        // Update course result fields
        courseResult.courses = courses || courseResult.courses;
        courseResult.category = category || courseResult.category;
        courseResult.calculateTotalScore();

        await courseResult.save();
        res.json(courseResult);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a course result
router.delete('/admin/course/:id', auth, isAdmin, async (req, res) => {
    try {
        const courseResult = await CourseResult.findByIdAndDelete(req.params.id);
        if (!courseResult) {
            return res.status(404).json({ message: 'Course result not found' });
        }
        res.json({ message: 'Course result deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a course result by student ID
router.get('/admin/course/student/:studentId', async (req, res) => {
    try {
        const courseResult = await CourseResult.findOne({ studentId: req.params.studentId });
        if (!courseResult) {
            return res.status(404).json({ message: 'Course result not found' });
        }
        res.json(courseResult);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
