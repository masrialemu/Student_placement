const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSpecialCaseSchema = new Schema({
    studentId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['image', 'pdf', 'other'],
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StudentSpecialCase', studentSpecialCaseSchema);
