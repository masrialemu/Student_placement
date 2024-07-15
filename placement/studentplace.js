const express = require('express');
const router = express.Router();
const StudentSelection = require('../database/university');
const StudentRegistration = require('../database/studentRegistration');

// POST endpoint for student to select universities
router.post('/selectuniversity', async (req, res) => {
    const { studentId, department, universities } = req.body;

    // Validate input
    if (!studentId || !department || !universities || !Array.isArray(universities)) {
        return res.status(400).json({ error: 'Invalid request format or missing required fields' });
    }

    try {
        // Check if the student is registered
        const registeredStudent = await StudentRegistration.findOne({ studentId });
        if (!registeredStudent) {
            return res.status(404).json({ error: 'Student not registered' });
        }

        // Check if the student has already made a selection
        const existingSelection = await StudentSelection.findOne({ registration: registeredStudent._id });
        if (existingSelection) {
            return res.status(400).json({ error: 'Student has already made a selection' });
        }

        // Create new selection
        const newSelection = new StudentSelection({
            studentId,
            department,
            selections: universities.map(university => ({ university })),
            registration: registeredStudent._id
        });

        // Save to database
        await newSelection.save();

        res.status(201).json({ message: 'Selection saved successfully', selection: newSelection });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while saving the selection' });
    }
});

// GET endpoint for student to retrieve their selection
router.get('/get-selection/:studentId', async (req, res) => {
    const { studentId } = req.params;

    try {
        // Check if the student is registered
        const registeredStudent = await StudentRegistration.findOne({ studentId });
        if (!registeredStudent) {
            return res.status(404).json({ error: 'Student not registered' });
        }

        // Find student's selection
        const studentSelection = await StudentSelection.findOne({ registration: registeredStudent._id });

        if (!studentSelection) {
            return res.status(404).json({ error: 'Student selection not found' });
        }

        res.status(200).json({ selection: studentSelection });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the selection' });
    }
});

module.exports = router;
