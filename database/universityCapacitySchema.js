const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema
const universitySchema = new Schema({
  name: { type: String, required: true, unique: true },
  capacity: { type: Number, default: 0 },
});

// Create model
const University = mongoose.model('Universitycapacity1', universitySchema);

module.exports = University;
