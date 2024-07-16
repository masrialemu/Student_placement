const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
});


const User = mongoose.model('Admin', userSchema);

module.exports = User;
