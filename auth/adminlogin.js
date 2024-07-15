const express = require('express');
const router = express.Router();
const User = require('../database/adminsignup');

// Login route
router.post('/alogin', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if username and password match a user
        let user = await User.findOne({ username, password });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Return a token or session as needed for authentication
        res.json({ msg: 'User logged in successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
