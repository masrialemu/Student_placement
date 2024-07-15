// university.js
const mongoose = require('mongoose');

const studentSelectionSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    selections: [{
        university: {
            type: String,
            required: true,
            enum: [
                "Addis Ababa University", "Adama Science and Technology University", "Arba Minch University",
                "Bahir Dar University", "Dilla University", "Haramaya University", "Hawassa University",
                "Jimma University", "Mekelle University", "Wolaita Sodo University", "Ambo University",
                "Aksum University", "Debre Berhan University", "Debre Markos University", "Mizan Tepi University",
                "Semera University", "Wachamo University", "Wolkite University", "Wollega University",
                "Wollo University", "Adigrat University", "Dire Dawa University", "Gondar University",
                "Jijiga University", "Mada Walabu University", "Metu University", "Asosa University",
                "Bule Hora University", "Debre Tabor University", "Mettu University", "Bonga University",
                "Wachemo University", "Kebri Dehar University", "Welkite University", "Mizan Tepi University",
                "Woldia University", "Assosa University", "Kebri Dehar University", "Samara University",
                "Jigjiga University", "Addis Ababa Science and Technology University"
            ]
        }
    }],
    registration: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentRegistration',
        required: true
    }
});

// Check if the model has already been defined to prevent OverwriteModelError
module.exports = mongoose.models.StudentSelection || mongoose.model('StudentSelection', studentSelectionSchema);
