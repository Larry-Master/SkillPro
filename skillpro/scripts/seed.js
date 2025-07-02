const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const connectDB = require('../lib/db');
const Student = require('../models/Student');
const Professor = require('../models/Professor');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const Certificate = require('../models/Certificate');
const Review = require('../models/Review');




async function seed() {
  await connectDB();

  // Clear all existing data
  await Student.deleteMany({});
  await Professor.deleteMany({});
  await Course.deleteMany({});
  await Enrollment.deleteMany({});
  await Assignment.deleteMany({});
  await Certificate.deleteMany({});
  await Review.deleteMany({});



  // Fixed IDs for curl commands
  const fixedProfId = new ObjectId('64f1b8c8a6e8f94b5a5a1a01');
  const fixedStudentId = new ObjectId('64f1b8c8a6e8f94b5a5a1a02');
  const fixedCourseId = new ObjectId('64f1b8c8a6e8f94b5a5a1a03');
  const fixedAssignmentId = new ObjectId('64f1b8c8a6e8f94b5a5a1a04');
  const fixedCertificateId = new ObjectId('64f1b8c8a6e8f94b5a5a1abc'); 


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

  // Create fixed Assignment
const assignment = new Assignment({
  _id: fixedAssignmentId,
  title: 'HTML Basics Assignment',
  description: 'Build a simple web page using HTML.',
  course: fixedCourseId, 
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // due in 7 days
});
await assignment.save();


//Create Certificate
const certificate = new Certificate({
  _id: fixedCertificateId,
  student: fixedStudentId,
  course: fixedCourseId,
  issuedAt: new Date(),
});
  await certificate.save();

const review = new Review({
  student: fixedStudentId,
  course: fixedCourseId,
  content: 'Great course!',
  rating: 5
});
await review.save();


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
