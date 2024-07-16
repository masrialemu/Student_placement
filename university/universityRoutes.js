const express = require('express');
const router = express.Router();
const University = require('../database/universityCapacitySchema');

// POST - Insert multiple universities
router.post('/admin/universities', async (req, res) => {
  try {
    const universitiesData = req.body; // Assuming req.body is an array of universities

    // Insert all universities into the database
    const insertedUniversities = await University.insertMany(universitiesData);

    res.status(201).json(insertedUniversities);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET - Get all universities
router.get('/universities', async (req, res) => {
  try {
    const universities = await University.find();
    res.json(universities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT - Update a university
router.put('/universities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity } = req.body;

    const updatedUniversity = await University.findByIdAndUpdate(id, { name, capacity }, { new: true });

    if (!updatedUniversity) {
      return res.status(404).json({ message: 'University not found' });
    }

    res.json(updatedUniversity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Delete a university
router.delete('/universities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUniversity = await University.findByIdAndDelete(id);

    if (!deletedUniversity) {
      return res.status(404).json({ message: 'University not found' });
    }

    res.json({ message: 'Deleted university' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
