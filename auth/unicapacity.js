const express = require('express');
const router = express.Router();
const University = require('../database/university');
const UniversityCapacity = require('../database/universityCapacitySchema');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    // Replace this with your actual admin check logic
    const isAdminUser = true; // Example: Assuming user is admin for demonstration

    if (!isAdminUser) {
        return res.status(403).json({ error: 'Unauthorized access' });
    }

    next();
};

// POST endpoint to create university with initial capacity (Admin Only)
router.post('/post', async (req, res) => {
    const { name, capacity } = req.body;

    try {
        // Check if the university already exists
        let university = await University.findOne({ name });
        if (university) {
            return res.status(400).json({ error: 'University already exists' });
        }

        // Create new university
        university = new University({ name });
        await university.save();

        // Create university capacity entry
        const universityCapacity = new UniversityCapacity({
            university: university._id,
            capacity
        });
        await universityCapacity.save();

        res.status(201).json({ message: 'University and capacity created successfully', university, universityCapacity });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating university and capacity' });
    }
});

// GET endpoint to fetch all universities with capacities (Admin Only)
router.get('/get', isAdmin, async (req, res) => {
    try {
        const universities = await University.find();
        const universityCapacities = await UniversityCapacity.find().populate('university', 'name');
        
        // Combine university data with capacities
        const universitiesWithCapacities = universities.map(university => {
            const capacityEntry = universityCapacities.find(capacity => capacity.university._id.toString() === university._id.toString());
            return {
                _id: university._id,
                name: university.name,
                capacity: capacityEntry ? capacityEntry.capacity : 0
            };
        });

        res.status(200).json(universitiesWithCapacities);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching universities and capacities' });
    }
});

// PUT endpoint to update university capacity (Admin Only)
router.put('/update/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { capacity } = req.body;

    try {
        // Check if the university capacity entry exists
        let universityCapacity = await UniversityCapacity.findById(id);
        if (!universityCapacity) {
            return res.status(404).json({ error: 'University capacity entry not found' });
        }

        // Update capacity
        universityCapacity.capacity = capacity;
        await universityCapacity.save();

        res.status(200).json({ message: 'University capacity updated successfully', universityCapacity });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating university capacity' });
    }
});

// DELETE endpoint to delete university capacity entry (Admin Only)
router.delete('/delete/:id', isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the university capacity entry exists
        let universityCapacity = await UniversityCapacity.findById(id);
        if (!universityCapacity) {
            return res.status(404).json({ error: 'University capacity entry not found' });
        }

        // Delete capacity entry
        await universityCapacity.remove();

        res.status(200).json({ message: 'University capacity entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting university capacity entry' });
    }
});

module.exports = router;
