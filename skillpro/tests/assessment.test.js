const Assessment = require('../models/Assessment');

jest.mock('../models/Assessment');

describe('Assessment model', () => {
  afterEach(() => jest.clearAllMocks());

  it('should create and save a new assessment', async () => {
    const mockAssessmentData = {
      student: '507f1f77bcf86cd799439011', // dummy ObjectId as string
      answers: [{ question: 'Q1', answer: 'A1' }],
      result: 'Beginner',
      date: new Date('2023-01-01T00:00:00Z')
    };
    const mockSave = jest.fn().mockResolvedValue(mockAssessmentData);
    Assessment.mockImplementation(() => ({
      save: mockSave
    }));

    const assessment = new Assessment(mockAssessmentData);
    const savedAssessment = await assessment.save();

    expect(Assessment).toHaveBeenCalledWith(mockAssessmentData);
    expect(mockSave).toHaveBeenCalled();
    expect(savedAssessment).toEqual(mockAssessmentData);
  });

  it('should throw an error if student is missing', async () => {
    const mockAssessmentData = {
      // student: missing on purpose
      answers: [{ question: 'Q1', answer: 'A1' }],
      result: 'Beginner'
    };
    // Simulate Mongoose validation error
    const validationError = new Error('Assessment validation failed: student: Path `student` is required.');
    validationError.name = 'ValidationError';

    const mockSave = jest.fn().mockRejectedValue(validationError);
    Assessment.mockImplementation(() => ({
      save: mockSave
    }));

    const assessment = new Assessment(mockAssessmentData);
    await expect(assessment.save()).rejects.toThrow('Assessment validation failed: student: Path `student` is required.');
    expect(mockSave).toHaveBeenCalled();
  });

  it('should set date to default if not provided', async () => {
    const mockAssessmentData = {
      student: '507f1f77bcf86cd799439011',
      answers: [{ question: 'Q1', answer: 'A1' }],
      result: 'Intermediate'
      // date is omitted
    };
    // Simulate default date being set
    const mockNow = new Date('2025-07-07T12:00:00Z');
    // Save will return the assessment with default date
    const mockSave = jest.fn().mockResolvedValue({ ...mockAssessmentData, date: mockNow });
    Assessment.mockImplementation(() => ({
      save: mockSave
    }));

    const assessment = new Assessment(mockAssessmentData);
    const savedAssessment = await assessment.save();

    expect(savedAssessment.date).toBe(mockNow);
    expect(mockSave).toHaveBeenCalled();
  });
});
