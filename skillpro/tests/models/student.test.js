const mongoose = require("mongoose");
const Student = require("@/models/Student");

jest.mock("@/models/Student");

describe("Student model", () => {
  // Shared mock data and setup
  const mockStudentData = {
    name: "Leyla",
    email: "leyla@mail.com",
    enrolledCourses: [],
  };

  const createMockStudent = (mockSave) => {
    Student.mockImplementation(() => ({ save: mockSave }));
    return new Student(mockStudentData);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create and save a new student", async () => {
    // Arrange: set up a mock save that returns the student doc
    const mockSave = jest.fn().mockResolvedValue(mockStudentData);
    const student = createMockStudent(mockSave);

    // Act: create and save the student
    const savedStudent = await student.save();

    // Assert: save was called, and data matches
    expect(Student).toHaveBeenCalledWith(mockStudentData);
    expect(mockSave).toHaveBeenCalled();
    expect(savedStudent).toEqual(mockStudentData);
  });

  it("should throw an error if email is not unique", async () => {
    // Arrange: mock save to throw a duplicate key error
    const duplicateKeyError = new Error("E11000 duplicate key error");
    duplicateKeyError.code = 11000;

    const mockSave = jest.fn().mockRejectedValue(duplicateKeyError);
    const student = createMockStudent(mockSave);

    // Act & Assert: expect error on save
    await expect(student.save()).rejects.toThrow("E11000 duplicate key error");
    expect(mockSave).toHaveBeenCalled();
  });

});


