const mongoose = require('mongoose');

const universityCapacitySchema = new mongoose.Schema({
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true,
        default: 0
    }
});

const UniversityCapacity = mongoose.model('UniversityCapacity', universityCapacitySchema);

module.exports = UniversityCapacity;
