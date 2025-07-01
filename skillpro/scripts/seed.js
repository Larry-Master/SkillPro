const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const connectDB = require('../lib/db');
const Student = require('../models/Student');
const Professor = require('../models/Professor');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

async function seed() {
  await connectDB();

  // Clear all existing data
  await Student.deleteMany({});
  await Professor.deleteMany({});
  await Course.deleteMany({});
  await Enrollment.deleteMany({});

  // Fixed IDs for curl commands
  const fixedProfId = new ObjectId('64f1b8c8a6e8f94b5a5a1a01');
  const fixedStudentId = new ObjectId('64f1b8c8a6e8f94b5a5a1a02');
  const fixedCourseId = new ObjectId('64f1b8c8a6e8f94b5a5a1a03');

  // Create fixed Professor
  const professor = new Professor({
    _id: fixedProfId,
    name: 'Prof. Dr. Michael Hoffman',
    department: 'Computer Science',
  });
  await professor.save();

  // Create fixed Student
  const student = new Student({
    _id: fixedStudentId,
    name: 'Anna Smith',
    email: 'anna.smith@student.htw-berlin.de',
    enrolledCourses: [fixedCourseId],
  });
  await student.save();

  // Create fixed Course
  const course = new Course({
    _id: fixedCourseId,
    title: 'Distributed Systems',
    description: 'Basics of distributed systems',
    professor: fixedProfId,
    capacity: 30,
    enrolledStudents: [fixedStudentId],
  });
  await course.save();

  // Create enrollment linking student & course
  await Enrollment.create({
    student: fixedStudentId,
    course: fixedCourseId,
  });

  console.log('Database seeded with fixed Professor, Student, and Course!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
