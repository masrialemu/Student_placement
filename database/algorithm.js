async function assignStudentsToUniversities() {
    try {
      // Load all students and universities
      const students = await Student.find().sort({ entranceExamResults: -1, gender: 1 });
      const universities = await University.find();
  
      // Track assigned students
      const assignedStudents = [];
  
      // Iterate through sorted students
      for (const student of students) {
        // Initialize the preferences array if not present or empty
        if (!student.preferences || !Array.isArray(student.preferences) || student.preferences.length === 0) {
          console.log(`Student ${student.studentId} has no preferred universities.`);
          continue; // Skip this student if no preferences are set
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
  
        // If not assigned to any preferred university, log a message
        if (!assigned) {
          console.log(`Student ${student.studentId} could not be assigned to any preferred university.`);
          // Implement additional handling as needed
          // Example: Update a different field, notify stakeholders, etc.
        }
      }
  
      // Update StudentSelection schema with assigned universities
      for (const assignedStudent of assignedStudents) {
        let selection = await StudentSelection.findOne({ studentId: assignedStudent.studentId });
  
        if (!selection) {
          // Create new selection document if not exists
          selection = new StudentSelection({
            studentId: assignedStudent.studentId,
            department: "", // Set a default value or fetch from another source
            selections: [{ university: assignedStudent.university }],
            registration: student._id // Assuming student._id references the registration
          });
        } else {
          // Add additional university to existing selections
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
  