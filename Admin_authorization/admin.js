const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../database/adminauth');

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log('Attempting login for username:', username);

        // Check if username exists
        const user = await User.findOne({ username });

        if (!user) {
            console.log('User with username not found:', username);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Incorrect password provided for username:', username);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                fullName: user.fullName,
                isAdmin: user.isAdmin
            }
        };

        jwt.sign(payload, 'root', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            console.log('User logged in successfully:', username);
            res.json({ token });
        });
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).send('Server Error');
    }
});


// Signup route
router.post('/signup', async (req, res) => {
    const { username, password, fullName } = req.body;

    try {
        // Check if username already exists
        let user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ msg: 'Username already exists' });
        }

        // Create new user
        user = new User({
            username,
            password,
            fullName,
            isAdmin: true // Assuming this is for admin signup
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                fullName: user.fullName,
                isAdmin: user.isAdmin
            }
        };

        jwt.sign(payload, 'root', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
