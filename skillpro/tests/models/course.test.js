const mongoose = require('mongoose');
const Course = require('../../models/Course');

describe('Course model', () => {
  const validCourseData = {
    title: 'Distributed Systems',
    professor: new mongoose.Types.ObjectId(),
    capacity: 30,
    description: 'Basic Stuff',
  };

  test('creates a course with all fields', () => {
    const course = new Course(validCourseData);

    expect(course).toMatchObject({
      title: 'Distributed Systems',
      capacity: 30,
      description: 'Basic Stuff',
    });
    expect(course.professor).toEqual(validCourseData.professor);
    expect(Array.isArray(course.enrolledStudents)).toBe(true);
    expect(course.enrolledStudents.length).toBe(0);
  });

  test('fails validation if required fields missing', () => {
    const course = new Course({}); // empty object -> not allowed

    const error = course.validateSync();
    expect(error.errors.title).toBeDefined();
    expect(error.errors.professor).toBeDefined();
    expect(error.errors.capacity).toBeDefined();
  });

  test('capacity cannot be negative', () => {
    const course = new Course({ ...validCourseData, capacity: -1 });

    const error = course.validateSync();
    expect(error.errors.capacity).toBeDefined();
  });

  test('enrolledStudents defaults to empty array', () => {
    const course = new Course(validCourseData);

    expect(course.enrolledStudents).toEqual([]);
  });
});
