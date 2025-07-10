const mongoose = require('mongoose');
const Course = require('../../models/Course');

describe('Course model', () => {
  // Sample valid data
  const validCourseData = {
    title: 'Distributed Systems',
    professor: new mongoose.Types.ObjectId(),
    capacity: 30,
    description: 'Basic Stuff',
  };

  it('creates a course with all fields', () => {
    const course = new Course(validCourseData);

    // Check main fields
    expect(course).toMatchObject({
      title: 'Distributed Systems',
      capacity: 30,
      description: 'Basic Stuff',
    });
    // professor id should match input
    expect(course.professor).toEqual(validCourseData.professor);
    // enrolledStudents defaults to empty array
    expect(Array.isArray(course.enrolledStudents)).toBe(true);
    expect(course.enrolledStudents.length).toBe(0);
  });

  it('fails validation if required fields missing', () => {
    const course = new Course({});

    const error = course.validateSync();
    // Required fields should throw errors
    expect(error.errors.title).toBeDefined();
    expect(error.errors.professor).toBeDefined();
    expect(error.errors.capacity).toBeDefined();
  });

  it('capacity cannot be negative', () => {
    const course = new Course({ ...validCourseData, capacity: -1 });

    const error = course.validateSync();
    // Negative capacity should cause error
    expect(error.errors.capacity).toBeDefined();
  });

  it('enrolledStudents defaults to empty array', () => {
    const course = new Course(validCourseData);
    expect(course.enrolledStudents).toEqual([]);
  });
});
