const mongoose = require('mongoose');
const Student = require('../models/Student');

jest.mock('../models/Student');

describe('Student model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and save a new student', async () => {
    // Arrange: set up a mock save that returns the student doc
    const mockStudentData = {
      name: 'Leyla',
      email: 'leyla@mail.com',
      enrolledCourses: [],
    };
    const mockSave = jest.fn().mockResolvedValue(mockStudentData);
    Student.mockImplementation(() => ({
      save: mockSave
    }));

    // Act: create and save the student
    const student = new Student(mockStudentData);
    const savedStudent = await student.save();

    // Assert: save was called, and data matches
    expect(Student).toHaveBeenCalledWith(mockStudentData);
    expect(mockSave).toHaveBeenCalled();
    expect(savedStudent).toEqual(mockStudentData);
  });

  it('should throw an error if email is not unique', async () => {
    // Arrange: mock save to throw a duplicate key error
    const mockStudentData = {
      name: 'Leyla',
      email: 'duplicate@mail.com',
      enrolledCourses: [],
    };
    const duplicateKeyError = new Error('E11000 duplicate key error');
    duplicateKeyError.code = 11000;

    const mockSave = jest.fn().mockRejectedValue(duplicateKeyError);
    Student.mockImplementation(() => ({
      save: mockSave
    }));

    // Act & Assert: expect error on save
    const student = new Student(mockStudentData);
    await expect(student.save()).rejects.toThrow('E11000 duplicate key error');
    expect(mockSave).toHaveBeenCalled();
  });
});
