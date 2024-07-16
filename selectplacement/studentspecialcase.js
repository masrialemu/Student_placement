const express = require('express');
const router = express.Router();
const multer = require('multer'); // For handling file uploads
const path = require('path');
const StudentSpecialCase = require('../database/studentSpecialCase');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Directory where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// POST endpoint for uploading student special case
router.post('/special-case', upload.single('file'), async (req, res) => {
    try {
        const { studentId, description } = req.body;
        const fileType = req.file.mimetype.startsWith('image') ? 'image' : req.file.mimetype === 'application/pdf' ? 'pdf' : 'other';
        const fileUrl = req.file.path; // Assuming the file path is stored

        const newSpecialCase = new StudentSpecialCase({
            studentId,
            description,
            fileType,
            fileUrl
        });

        await newSpecialCase.save();

        res.status(201).json({ message: 'Special case details saved successfully', specialCase: newSpecialCase });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET endpoint to fetch all student special cases
router.get('/special-cases', async (req, res) => {
    try {
        const specialCases = await StudentSpecialCase.find().sort({ createdAt: -1 }); // Sort by creation date, descending
        res.status(200).json(specialCases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
