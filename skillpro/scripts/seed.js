require('dotenv').config(); // makes sure ENV URI is loaded
const mongoose = require('mongoose');
const connectDB = require('../lib/db');

const Student = require('../models/Student');
const Professor = require('../models/Professor');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const Certificate = require('../models/Certificate');
const Review = require('../models/Review');
const Mentor = require('../models/Mentor');

async function seed() {
  await connectDB();

  // Wipe all existing records
  await Promise.all([
    Student.deleteMany({}),
    Professor.deleteMany({}),
    Course.deleteMany({}),
    Enrollment.deleteMany({}),
    Assignment.deleteMany({}),
    Certificate.deleteMany({}),
    Review.deleteMany({}),
    Mentor.deleteMany({})
  ]);

  // --- Professors ---
  const professors = await Professor.insertMany([
    { name: 'Dr. Sarah Müller', department: 'Web Development' },
    { name: 'Prof. Daniel Rivera', department: 'Computer Graphics' },
    { name: 'Dr. Nina Petrova', department: 'AI & Data Science' }
  ]);

  // --- Courses ---
  const courses = await Course.insertMany([
    { title: 'Web Technologies', description: 'HTML, CSS, JS basics', professor: professors[0]._id, capacity: 30 },
    { title: 'Distributed Systems', description: 'Client-server architecture & sockets', professor: professors[1]._id, capacity: 25 },
    { title: 'Human-Computer Interaction', description: 'UX/UI and user testing methods', professor: professors[0]._id, capacity: 20 },
    { title: 'Machine Learning Basics', description: 'Intro to supervised learning', professor: professors[2]._id, capacity: 30 },
    { title: '3D Modeling and Animation', description: 'Fundamentals of 3D design and motion', professor: professors[1]._id, capacity: 15 }
  ]);

  // --- Students ---
  const students = await Student.insertMany([
    { name: 'Leyla Demir', email: 'leyla.demir@htw-berlin.de' },
    { name: 'Mateo Rossi', email: 'mateo.rossi@htw-berlin.de' },
    { name: 'Sofia Chen', email: 'sofia.chen@htw-berlin.de' },
    { name: 'Lucas Schneider', email: 'lucas.schneider@htw-berlin.de' },
    { name: 'Emily Johnson', email: 'emily.johnson@htw-berlin.de' }
  ]);

  // --- Enrollments ---
  const enrollments = await Promise.all([
    Enrollment.create({ student: students[0]._id, course: courses[0]._id }),
    Enrollment.create({ student: students[1]._id, course: courses[1]._id }),
    Enrollment.create({ student: students[2]._id, course: courses[2]._id }),
    Enrollment.create({ student: students[3]._id, course: courses[3]._id }),
    Enrollment.create({ student: students[4]._id, course: courses[4]._id }),
  ]);

  // Add enrolledCourses to students
  for (const enrollment of enrollments) {
    await Student.findByIdAndUpdate(enrollment.student, {
      $push: { enrolledCourses: enrollment.course }
    });
    await Course.findByIdAndUpdate(enrollment.course, {
      $push: { enrolledStudents: enrollment.student }
    });
  }

  // --- Assignments ---
  await Assignment.insertMany([
    {
      title: 'HTML Portfolio Page',
      description: 'Create a personal website using HTML/CSS.',
      course: courses[0]._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Distributed Chat App',
      description: 'Build a basic TCP-based chat app.',
      course: courses[1]._id,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'UX Case Study',
      description: 'Analyze and redesign a real-world app’s UI.',
      course: courses[2]._id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }
  ]);

  // --- Mentors ---
  const mentors = await Mentor.insertMany([
    {
      name: 'Alex Novak',
      email: 'alex.novak@techmentor.com',
      industry: 'Frontend Engineering',
      expertise: ['React', 'Web Performance'],
      bio: '10 years building frontend systems in Berlin startups',
      availability: 'part-time',
      paymentRate: 80
    },
    {
      name: 'Maria Ivanova',
      email: 'maria.ivanova@mlmentor.ai',
      industry: 'Machine Learning',
      expertise: ['Python', 'Scikit-learn', 'TensorFlow'],
      bio: 'Former data scientist at Zalando',
      availability: 'flexible',
      paymentRate: 100
    },
    {
      name: 'Thomas Meier',
      email: 'thomas.meier@motiondesign.io',
      industry: '3D & Motion',
      expertise: ['Blender', 'Cinema4D'],
      bio: 'Freelance motion designer for TV and games',
      availability: 'full-time',
      paymentRate: 90
    }
  ]);

  // --- Certificates ---
  await Certificate.insertMany([
    {
      student: students[0]._id,
      course: courses[0]._id,
      issuedAt: new Date()
    },
    {
      student: students[1]._id,
      course: courses[1]._id,
      issuedAt: new Date()
    },
    {
      student: students[2]._id,
      course: courses[2]._id,
      issuedAt: new Date()
    }
  ]);

  // --- Reviews ---
  await Review.insertMany([
    {
      student: students[0]._id,
      mentor: mentors[0]._id,
      content: 'Alex was super helpful with React hooks!',
      rating: 5
    },
    {
      student: students[1]._id,
      mentor: mentors[1]._id,
      content: 'Maria explained ML models clearly. Very useful.',
      rating: 4
    },
    {
      student: students[2]._id,
      mentor: mentors[2]._id,
      content: 'Thomas gave me awesome animation tips!',
      rating: 5
    }
  ]);

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
