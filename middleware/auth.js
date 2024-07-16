// middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../database/adminauth');

const auth = async (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'root'); // Replace 'root' with your secret key
        req.user = decoded.user;

        // Check if the user still exists in the database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ msg: 'User does not exist' });
        }

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ msg: 'Access denied: Admins only' });
    }
    next();
};

module.exports = { auth, isAdmin };
