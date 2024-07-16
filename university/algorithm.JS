const mongoose = require('mongoose');
const University = require('../database/universityCapacitySchema');
const StudentSelection = require('../database/selectuniversity'); // Assuming this is the correct path
const Student = require('../database/studentpersonalinfo');

async function assignStudentsToUniversities() {
  try {
    // Load all students and universities
    const students = await Student.find().sort({ entranceExamResults: -1, gender: 1 }); // Sort by entranceExamResults desc, females first
    const universities = await University.find();

    // Track assigned students
    const assignedStudents = [];

    // Iterate through sorted students
    for (const student of students) {
      // Initialize the selections array if not present
      if (!student.preferences || !Array.isArray(student.preferences)) {
        student.preferences = [];
      }

      let assigned = false;

      // Try to assign student to preferred universities
      for (const preferredUniName of student.preferences) {
        const university = universities.find(u => u.name === preferredUniName);

        if (university && university.capacity > 0) {
          // Assign student to this university
          assignedStudents.push({ studentId: student.studentId, university: university.name });
          university.capacity--;
          assigned = true;
          break; // Move to next student once assigned
        }
      }

      if (!assigned) {
    
        console.log(`Student ${student.studentId} could not be assigned to any preferred university.`);
      }
    }

    // Update StudentSelection schema with assigned universities
    for (const assignedStudent of assignedStudents) {
      let selection = await StudentSelection.findOne({ studentId: assignedStudent.studentId });

      if (!selection) {
        selection = new StudentSelection({
          studentId: assignedStudent.studentId,
          department: "", // Set a default department or fetch from another source
          selections: [{ university: assignedStudent.university }],
          registration: student._id // Assuming student._id references the registration
        });
      } else {
        selection.selections.push({ university: assignedStudent.university });
      }

      await selection.save();
    }

    console.log('Students assigned to universities successfully.');
    return assignedStudents; // Return assigned students for response
  } catch (error) {
    console.error('Error assigning students to universities:', error);
    throw error; // Propagate error for higher level handling
  } finally {
    mongoose.disconnect(); // Ensure to disconnect mongoose connection
  }
}

module.exports = assignStudentsToUniversities;
