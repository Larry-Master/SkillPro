const mongoose = require('mongoose');
const Course = require('../../models/Course');

describe('Course model', () => {
  test('should create a course with required fields', () => {
    const courseData = {
      title: 'Math 101',
      professor: new mongoose.Types.ObjectId(),
      capacity: 30,
      description: 'Basic Mathematics'
    };

    const course = new Course(courseData);

    expect(course.title).toBe(courseData.title);
    expect(course.professor).toEqual(courseData.professor);
    expect(course.capacity).toBe(courseData.capacity);
    expect(course.description).toBe(courseData.description);
    expect(course.enrolledStudents.length).toBe(0);
  });
});
