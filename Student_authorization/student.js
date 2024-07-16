const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const StudentRegistration = require('../database/studentRegistration.js');
const AdminInput = require('../database/studentpersonalinfo.js');

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'masrialemu4044@gmail.com',
        pass: 'iegw xjpv rncj gfnk' // Update with your Gmail app password or use environment variables
    }
});

// Student Registration
router.post('/register', async (req, res) => {
    try {
        const { studentId, emailAddress, password } = req.body;

        // Check if the studentId exists in AdminInput
        const adminAssignedStudent = await AdminInput.findOne({ studentId });
        if (!adminAssignedStudent) {
            return res.status(400).json({ message: 'Invalid studentId provided' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new student registration record
        const newStudentRegistration = new StudentRegistration({
            studentId,
            emailAddress,
            password: hashedPassword
        });
        await newStudentRegistration.save();

        res.status(201).json({ message: 'Registration successful', student: newStudentRegistration });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Student Login
router.post('/login', async (req, res) => {
    try {
        const { emailAddress, password } = req.body;

        // Find the student by emailAddress
        const student = await StudentRegistration.findOne({ emailAddress });
        if (!student) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ studentId: student.studentId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token, student });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Password Reset Request
router.post('/reset-password', async (req, res) => {
    try {
        const { emailAddress } = req.body;

        // Find the student by emailAddress
        const student = await StudentRegistration.findOne({ emailAddress });
        if (!student) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        student.resetPasswordToken = resetToken;
        student.resetPasswordExpires = Date.now() + 7 * 60 * 60 * 1000; // 7 hours
        await student.save();

        // Send HTML formatted email
        const resetUrl = `http://localhost:3000/student/reset-password/${resetToken}`;
        const mailOptions = {
            to: student.emailAddress,
            from: 'masrialemu4044@gmail.com',
            subject: 'Password Reset',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333333;">Password Reset Request</h2>
                    <p>Hello ${student.firstName},</p>
                    <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
                    <p style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
                        Please click on the following link, or paste this into your browser to complete the process:
                        <br/>
                        <a href="${resetUrl}" style="text-decoration: none; color: #007bff;">Reset Password</a>
                    </p>
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                    <p>Thank you!</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Password Reset
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Find the student by reset token and check expiration
        const student = await StudentRegistration.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!student) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password
        student.password = hashedPassword;
        student.resetPasswordToken = undefined;
        student.resetPasswordExpires = undefined;
        await student.save();

        res.status(200).json({ message: 'Password has been reset' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all student registrations (for admin purposes)
router.get('/all-registrations', async (req, res) => {
    try {
        const students = await StudentRegistration.find();
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
