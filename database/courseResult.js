const mongoose = require('mongoose');

const courseResultSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        minlength: 9
    },
    courses: [
        {
            courseName: { type: String, required: true },
            score: { type: Number, required: true, min: 0, max: 100 }
        }
    ],
    totalScore: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        enum: ['Social Sciences', 'Natural Sciences'],
        required: true
    }
});

courseResultSchema.methods.calculateTotalScore = function () {
    this.totalScore = this.courses.reduce((acc, course) => acc + course.score, 0);
};

const CourseResult = mongoose.model('CourseResult', courseResultSchema);

module.exports = CourseResult;
