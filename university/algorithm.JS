const mongoose = require('mongoose');
const University = require('../database/universityCapacitySchema');
const StudentSelection = require('../database/University');
const Student = require('../database/admininput');

async function assignStudentsToUniversities() {
  try {
    // Load all students and universities
    const students = await Student.find().sort({ examScore: -1, gender: 1 }); // Sort by examScore desc, females first
    const universities = await University.find();

    // Track assigned students
    const assignedStudents = [];

    // Iterate through sorted students
    for (const student of students) {
      // Try to assign student to preferred universities
      for (const preferredUniName of student.preferences) {
        const university = universities.find(u => u.name === preferredUniName);

        if (university && university.capacity > 0) {
          // Assign student to this university
          assignedStudents.push({ studentId: student.studentId, university: university.name });
          university.capacity--;
          break; // Move to next student
        }
      }
    }

    // Update StudentSelection schema with assigned universities
    const studentSelections = await StudentSelection.find();
    for (const assignedStudent of assignedStudents) {
      const selection = studentSelections.find(s => s.studentId === assignedStudent.studentId);
      if (selection) {
        selection.selections.push({ university: assignedStudent.university });
        await selection.save();
      }
    }

    console.log('Students assigned to universities successfully.');
  } catch (error) {
    console.error('Error assigning students to universities:', error);
  } finally {
    mongoose.disconnect();
  }
}

module.exports = assignStudentsToUniversities; // Correct export statement
