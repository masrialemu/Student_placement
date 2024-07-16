const express = require('express');
const router = express.Router();
const StudentSelection = require('../database/selectuniversity');
const StudentRegistration = require('../database/studentRegistration');

// PUT endpoint for admin to update student selection
router.put('/update-selection/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const { department, universities } = req.body;

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

        // Find student's selection
        let studentSelection = await StudentSelection.findOne({ registration: registeredStudent._id });

        // If no existing selection, create a new one
        if (!studentSelection) {
            studentSelection = new StudentSelection({
                studentId,
                department,
                selections: universities.map(university => ({ university })),
                registration: registeredStudent._id
            });
        } else {
            // Update existing selection
            studentSelection.department = department;
            studentSelection.selections = universities.map(university => ({ university }));
        }

        // Save updated selection to database
        await studentSelection.save();

        res.status(200).json({ message: 'Selection updated successfully', selection: studentSelection });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the selection' });
    }
});

module.exports = router;
