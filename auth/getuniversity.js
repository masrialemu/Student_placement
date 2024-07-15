const mongoose = require('mongoose');
const University = require('../database/universityCapacitySchema');

app.get('/universities', async (req, res) => {
    try {
      const universities = await University.find();
      res.json(universities);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });