const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    studentId: { type: String, unique: true }
});

const User = mongoose.model('admin1', userSchema);

module.exports = User;
