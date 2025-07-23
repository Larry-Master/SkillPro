const enrollStudent = require('@/lib/enrollService');
const Student = require('@/models/Student');
const Course = require('@/models/Course');

describe('enrollStudent service', () => {
  // Mock student object with empty courses and a fake save function
  const mockStudent = {
    _id: 'student-id',
    enrolledCourses: [],
    save: jest.fn(),
  };

  // Mock course object with empty students and a fake save function
  const mockCourse = {
    _id: 'course-id',
    enrolledStudents: [],
    save: jest.fn(),
  };

  beforeEach(() => {
    // Mock findById to always return the mock student and course by default
    jest.spyOn(Student, 'findById').mockResolvedValue(mockStudent);
    jest.spyOn(Course, 'findById').mockResolvedValue(mockCourse);
  });

  afterEach(() => {
    // Restore all mocks after each test to avoid interference
    jest.restoreAllMocks();
  });

  describe('Successful enrollment', () => {
    it('enrolls student successfully', async () => {
      const result = await enrollStudent('student-id', 'course-id');

      // Check if Student.findById and Course.findById were called with correct ids
      expect(Student.findById).toHaveBeenCalledWith('student-id');
      expect(Course.findById).toHaveBeenCalledWith('course-id');

      // Make sure both student and course saved changes
      expect(mockStudent.save).toHaveBeenCalled();
      expect(mockCourse.save).toHaveBeenCalled();

      // Expect the success message in result
      expect(result).toEqual({ status: 200, message: 'Enrollment successful' });
    });
  });

  describe('Validation errors', () => {
    it('returns 400 if studentId or courseId missing', async () => {
      const result1 = await enrollStudent(null, 'course-id');
      expect(result1).toEqual({ status: 400, message: 'Missing studentId or courseId' });

      const result2 = await enrollStudent('student-id', null);
      expect(result2).toEqual({ status: 400, message: 'Missing studentId or courseId' });
    });
  });

  describe('Not found errors', () => {
    it('returns 404 if student or course not found', async () => {
      // Override mocks to simulate student and course not found
      jest.spyOn(Student, 'findById').mockResolvedValueOnce(null);
      jest.spyOn(Course, 'findById').mockResolvedValueOnce(null);

      const result = await enrollStudent('student-id', 'course-id');
      expect(result).toEqual({ status: 404, message: 'Student or Course not found' });
    });
  });

  describe('Conflict errors', () => {
    it('returns 409 if student already enrolled', async () => {
      // Simulate student already enrolled in the course
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
});
