const Student = require('../models/Student');
const Course = require('../models/Course');

async function enrollStudent(studentId, courseId) {
  if (!studentId || !courseId) {
    return { status: 400, message: 'Missing studentId or courseId' };
  }

  const student = await Student.findById(studentId);
  const course = await Course.findById(courseId);

  if (!student || !course) {
    return { status: 404, message: 'Student or Course not found' };
  }

  if (student.enrolledCourses.includes(courseId)) {
    return { status: 409, message: 'Student is already enrolled in this course' };
  }

  student.enrolledCourses.push(courseId);
  await student.save();

  course.enrolledStudents.push(studentId);
  await course.save();

  return { status: 200, message: 'Enrollment successful' };
}

module.exports = enrollStudent;
