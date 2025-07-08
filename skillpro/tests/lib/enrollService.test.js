const enrollStudent = require('../../lib/enrollService');
const Student = require('../../models/Student');
const Course = require('../../models/Course');

describe('enrollStudent service', () => {
  const mockStudent = {
    _id: 'student-id',
    enrolledCourses: [],
    save: jest.fn(),
  };

  const mockCourse = {
    _id: 'course-id',
    enrolledStudents: [],
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.spyOn(Student, 'findById').mockResolvedValue(mockStudent);
    jest.spyOn(Course, 'findById').mockResolvedValue(mockCourse);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('enrolls student successfully', async () => {
    const result = await enrollStudent('student-id', 'course-id');

    expect(Student.findById).toHaveBeenCalledWith('student-id');
    expect(Course.findById).toHaveBeenCalledWith('course-id');
    expect(mockStudent.save).toHaveBeenCalled();
    expect(mockCourse.save).toHaveBeenCalled();
    expect(result).toEqual({ status: 200, message: 'Enrollment successful' });
  });

  test('returns 400 if studentId or courseId missing', async () => {
  const result1 = await enrollStudent(null, 'course-id');
  expect(result1).toEqual({ status: 400, message: 'Missing studentId or courseId' });

  const result2 = await enrollStudent('student-id', null);
  expect(result2).toEqual({ status: 400, message: 'Missing studentId or courseId' });
});

test('returns 404 if student or course not found', async () => {
  jest.spyOn(Student, 'findById').mockResolvedValueOnce(null);
  jest.spyOn(Course, 'findById').mockResolvedValueOnce(null);

  const result = await enrollStudent('student-id', 'course-id');
  expect(result).toEqual({ status: 404, message: 'Student or Course not found' });
});

test('returns 409 if student already enrolled', async () => {
  const enrolledStudent = {
    _id: 'student-id',
    enrolledCourses: ['course-id'],
    save: jest.fn(),
  };

  jest.spyOn(Student, 'findById').mockResolvedValueOnce(enrolledStudent);
  jest.spyOn(Course, 'findById').mockResolvedValueOnce(mockCourse);

  const result = await enrollStudent('student-id', 'course-id');
  expect(result).toEqual({ status: 409, message: 'Student is already enrolled in this course' });
});

});
