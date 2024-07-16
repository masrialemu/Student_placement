const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const assignStudentsToUniversities = require('./university/'); // Adjust the path as per your project structure

// Routes from your project

const adminloginRoute = require('./Admin_authorization/admin');
const adminReadRoute = require('./Admin_Task/adminread');
const studentController = require('./admininput/admininput');
const studentRouter = require('./Student_authorization/student');
const studentPlacement = require('./selectplacement/studentplacement');
const adminPlacement = require('./selectplacement/admin');
const unicapacityRouter = require('./Admin_Task/unicapacity'); // Assuming this is the correct router file
const deleteAllCollections = require('./database/delete'); // Adjust the path accordingly
const studentSpecialCase = require('./selectplacement/studentspecialcase');
const studentinfo = require('./Admin_Task/studentinfo');
const course = require('./Admin_Task/courseResult');
const university = require('./university/universityRoutes');



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PASSWORD = process.env.DB_PASSWORD;

app.use(express.json());

// MongoDB Atlas connection
mongoose.connect(`mongodb+srv://Masri404:${DB_PASSWORD}@personalwebsite.uo6hnoi.mongodb.net/personalwebsite`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

app.post('/api/delete-all-collections', async (req, res) => {
    try {
      await deleteAllCollections();
      res.status(200).json({ message: 'All collections deleted successfully.' });
    } catch (error) {
      console.error('Error in delete-all-collections route:', error);
      res.status(500).json({ error: `An error occurred while deleting collections: ${error.message}` });
    }
  });
  



app.use('/admin', adminloginRoute); // Mount the admin read route
app.use('/api/universities', unicapacityRouter); // Mount the university capacity router



app.use('/student', studentSpecialCase);
app.use('/student', studentRouter);
app.use('/student', studentPlacement);
app.use('/', adminPlacement);

// Endpoint to trigger student assignment
app.post('/api/assign-students', async (req, res) => {
  try {
    const result = await assignStudentsToUniversities();
    res.status(200).json({ message: 'Student assignment completed successfully.', result });
  } catch (error) {
    console.error('Error assigning students:', error);
    res.status(500).json({ error: 'An error occurred while assigning students.' });
  }
});


app.use('/', studentinfo);
// app.get('/admin/studentinfo', studentinfo.getAllStudents);
// app.get('/admin/studentinfo/:id', studentinfo.getStudentById);
// app.put('/admin/studentinfo/:id', studentinfo.updateStudent);
// app.delete('/admin/studentinfo/:id', studentinfo.deleteStudent);
  
  
app.use('/', course);
app.use('/', university);
// Student CRUD operations
app.post('/api/adminpost', studentController.createStudent);
app.get('/api/adminget', studentController.getAllStudents);
app.get('/api/admingetid/:id', studentController.getStudentById);
app.put('/api/admin/update/:id', studentController.updateStudent);
app.delete('/api/admindelete/:id', studentController.deleteStudent);

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB Atlas!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
