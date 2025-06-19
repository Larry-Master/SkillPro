// scripts/seed.js
const connectDB = require('../lib/db');
const Student = require('../models/Student');
const Professor = require('../models/Professor');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

async function seed() {
  await connectDB();

  // Clear old data
  await Student.deleteMany({});
  await Professor.deleteMany({});
  await Course.deleteMany({});
  await Enrollment.deleteMany({});

  // Create Professor
  const prof = await Professor.create({
    name: 'Prof. Alice',
    department: 'Computer Science',
  });

  // Create Student
  const student = await Student.create({
    name: 'Bob Student',
    email: 'bob@student.htw-berlin.de',
  });

  // Create Course
  const course = await Course.create({
    title: 'Distributed Systems',
    description: 'Basics of distributed systems',
    professor: prof._id,
    capacity: 25,
    enrolledStudents: [student._id],
  });

  // Link Student to Course
  student.enrolledCourses.push(course._id);
  await student.save();

  // Create Enrollment
  await Enrollment.create({
    student: student._id,
    course: course._id,
  });

  console.log('✅ Database seeded');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
