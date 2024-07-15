const express = require('express');
const University = require('../database/universityCapacitySchema');
const route = express.Router();

// Array of universities to be added
const universitiesData = [
  { "name": "Addis Ababa University", "capacity": 4000 },
  { "name": "Adama Science and Technology University", "capacity": 3000 },
  { "name": "Arba Minch University", "capacity": 3500 },
  { "name": "Bahir Dar University", "capacity": 2500 },
  { "name": "Dilla University", "capacity": 3000 },
  { "name": "Haramaya University", "capacity": 4000 },
  { "name": "Hawassa University", "capacity": 3000 },
  { "name": "Jimma University", "capacity": 3500 },
  { "name": "Mekelle University", "capacity": 4000 },
  { "name": "Wolaita Sodo University", "capacity": 2500 },
  { "name": "Ambo University", "capacity": 3000 },
  { "name": "Aksum University", "capacity": 3500 },
  { "name": "Debre Berhan University", "capacity": 3000 },
  { "name": "Debre Markos University", "capacity": 2500 },
  { "name": "Mizan Tepi University", "capacity": 3500 },
  { "name": "Semera University", "capacity": 3000 },
  { "name": "Wachamo University", "capacity": 2500 },
  { "name": "Wolkite University", "capacity": 4000 },
  { "name": "Wollega University", "capacity": 3000 },
  { "name": "Wollo University", "capacity": 2500 },
  { "name": "Adigrat University", "capacity": 3500 },
  { "name": "Dire Dawa University", "capacity": 3000 },
  { "name": "Gondar University", "capacity": 4000 },
  { "name": "Jijiga University", "capacity": 3000 },
  { "name": "Mada Walabu University", "capacity": 3500 },
  { "name": "Metu University", "capacity": 3000 },
  { "name": "Asosa University", "capacity": 2500 },
  { "name": "Bule Hora University", "capacity": 3500 },
  { "name": "Debre Tabor University", "capacity": 2500 },
  { "name": "Mettu University", "capacity": 4000 },
  { "name": "Bonga University", "capacity": 3000 },
  { "name": "Wachemo University", "capacity": 2500 },
  { "name": "Kebri Dehar University", "capacity": 3500 },
  { "name": "Welkite University", "capacity": 3000 },
  { "name": "Mizan Tepi University", "capacity": 4000 },
  { "name": "Woldia University", "capacity": 3000 },
  { "name": "Assosa University", "capacity": 2500 },
  { "name": "Kebri Dehar University", "capacity": 3500 },
  { "name": "Samara University", "capacity": 3000 },
  { "name": "Jigjiga University", "capacity": 4000 },
  { "name": "Addis Ababa Science and Technology University", "capacity": 3000 }
];

// POST operation to add universities to database
route.post('/universities', async (req, res) => {
  try {
    await University.insertMany(universitiesData); // Insert all universities at once
    res.status(201).json({ message: 'Universities added successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET operation to retrieve all universities
route.get('/universities', async (req, res) => {
  try {
    const universities = await University.find();
    res.json(universities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = route;
