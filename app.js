const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const unicapacityRouter = require('./auth/unicapacity'); // Adjust the path as per your project structure

// Routes from your project
const signupRoute = require('./auth/adminsignuppage');
const loginRoute = require('./auth/adminlogin');
const adminReadRoute = require('./auth/adminread');
const studentController = require('./admininput/admininput');
const studentRouter = require('./auth/ssignup');
const studentPlacement = require('./placement/studentplace');
const adminPlacement = require('./placement/admin');

dotenv.config();

const app = express();
const PORT = 3000;
const DB_PASSWORD = process.env.DB_PASSWORD;

app.use(express.json());

// MongoDB Atlas connection
mongoose.connect(`mongodb+srv://Masri404:${DB_PASSWORD}@personalwebsite.uo6hnoi.mongodb.net/personalwebsite`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

// Routes
app.use('/api/', signupRoute);
app.use('/api/', loginRoute);
app.use('/api/admins', adminReadRoute); // Mount the admin read route
app.use('/api/universities', unicapacityRouter); // Mount the university capacity router

app.use('/student', studentRouter);
app.use('/', studentPlacement);
app.use('/', adminPlacement);

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
