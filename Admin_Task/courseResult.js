const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const CourseResult = require('../database/courseResult');

// Create a new course result
router.post('/', auth, isAdmin, async (req, res) => {
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
router.put('/:id', auth, isAdmin, async (req, res) => {
    const { courses, category } = req.body;

    try {
        const courseResult = await CourseResult.findById(req.params.id);
        if (!courseResult) {
            return res.status(404).json({ message: 'Course result not found' });
        }

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
router.delete('/:id', auth, isAdmin, async (req, res) => {
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
router.get('/student/:studentId', auth, async (req, res) => {
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

// Get all course results
router.get('/', auth, async (req, res) => {
    try {
        const courseResults = await CourseResult.find();
        res.json(courseResults);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
