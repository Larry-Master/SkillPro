const Assignment = require('../models/Assignment');

jest.mock('../models/Assignment');

describe('Assignment model', () => {
  afterEach(() => jest.clearAllMocks());

  it('should create and save a new assignment', async () => {
    const mockAssignmentData = {
      title: 'React Basics',
      description: 'Build your first React app',
      course: '607f1f77bcf86cd799439012', // dummy ObjectId as string
      dueDate: new Date('2025-08-01T00:00:00Z')
    };
    const mockSave = jest.fn().mockResolvedValue(mockAssignmentData);
    Assignment.mockImplementation(() => ({
      save: mockSave
    }));

    const assignment = new Assignment(mockAssignmentData);
    const savedAssignment = await assignment.save();

    expect(Assignment).toHaveBeenCalledWith(mockAssignmentData);
    expect(mockSave).toHaveBeenCalled();
    expect(savedAssignment).toEqual(mockAssignmentData);
  });

  it('should throw an error if title is missing', async () => {
    const mockAssignmentData = {
      // title missing!
      description: 'No title assignment',
      course: '607f1f77bcf86cd799439012'
    };
    // Simulate Mongoose validation error
    const validationError = new Error('Assignment validation failed: title: Path `title` is required.');
    validationError.name = 'ValidationError';

    const mockSave = jest.fn().mockRejectedValue(validationError);
    Assignment.mockImplementation(() => ({
      save: mockSave
    }));

    const assignment = new Assignment(mockAssignmentData);
    await expect(assignment.save()).rejects.toThrow('Assignment validation failed: title: Path `title` is required.');
    expect(mockSave).toHaveBeenCalled();
  });

  it('should create an assignment without optional fields', async () => {
    const mockAssignmentData = {
      title: 'Only Title'
      // description, course, dueDate missing
    };
    const mockSave = jest.fn().mockResolvedValue(mockAssignmentData);
    Assignment.mockImplementation(() => ({
      save: mockSave
    }));

    const assignment = new Assignment(mockAssignmentData);
    const savedAssignment = await assignment.save();

    expect(savedAssignment.title).toBe('Only Title');
    expect(savedAssignment.description).toBeUndefined();
    expect(savedAssignment.course).toBeUndefined();
    expect(savedAssignment.dueDate).toBeUndefined();
    expect(mockSave).toHaveBeenCalled();
  });
});
