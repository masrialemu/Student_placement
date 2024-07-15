const express = require('express');
const router = express.Router();
const User = require('../database/adminsignup');

// Signup route
router.post('/asignup', async (req, res) => {
    const { username, password, isAdmin, studentId } = req.body;

    try {
        // Check if username already exists
        let user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ msg: 'Username already exists' });
        }

        user = new User({
            username,
            password,
            isAdmin,
            studentId
        });

        // Save user to database
        await user.save();

        res.status(201).json({ msg: 'User created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
