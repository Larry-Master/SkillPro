const Enrollment = require('../../models/Enrollment');

jest.mock('../../models/Enrollment');

describe('Enrollment model', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('creates and saves a new enrollment', async () => {
    const data = {
      student: 'student-id',
      course: 'course-id',
      enrolledAt: new Date('2025-07-02T00:00:00Z')
    };

    const saveMock = jest.fn().mockResolvedValue(data);
    Enrollment.mockImplementation(() => ({ save: saveMock }));

    const enrollment = new Enrollment(data);
    const result = await enrollment.save();

    expect(Enrollment).toHaveBeenCalledWith(data);
    expect(saveMock).toHaveBeenCalled();
    expect(result).toEqual(data);
  });

  test('throws error if student is missing', async () => {
    const data = { course: 'course-id' }; // student missing

    const error = new Error('Enrollment validation failed: student: Path `student` is required.');
    error.name = 'ValidationError';

    const saveMock = jest.fn().mockRejectedValue(error);
    Enrollment.mockImplementation(() => ({ save: saveMock }));

    const enrollment = new Enrollment(data);
    await expect(enrollment.save()).rejects.toThrow(error.message);
    expect(saveMock).toHaveBeenCalled();
  });
});
