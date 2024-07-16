// routes/adminread.js

const express = require('express');
const router = express.Router();
const Admin = require('../database/adminauth');

// GET all admins
router.get('/', async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET admin by id
router.get('/:id', getAdmin, (req, res) => {
    res.json(res.admin);
});

// Middleware function to get admin by id
async function getAdmin(req, res, next) {
    let admin;
    try {
        admin = await Admin.findById(req.params.id);
        if (admin == null) {
            return res.status(404).json({ message: 'Cannot find admin' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.admin = admin;
    next();
}

module.exports = router;
