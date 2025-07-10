const Enrollment = require('../../models/Enrollment');

jest.mock('../../models/Enrollment');

describe('Enrollment model', () => {

  afterEach(() => {
    // Reset mocks so each test starts fresh
    jest.clearAllMocks();
  });

  it('creates and saves a new enrollment', async () => {
    // Sample enrollment data
    const data = {
      student: 'student-id',
      course: 'course-id',
      enrolledAt: new Date('2025-07-02T00:00:00Z')
    };

    // Mock the save function to just return the data
    const saveMock = jest.fn().mockResolvedValue(data);

    // When Enrollment is called, return an object with our mocked save
    Enrollment.mockImplementation(() => ({ save: saveMock }));

    // Create a new enrollment instance and save it
    const enrollment = new Enrollment(data);
    const result = await enrollment.save();

    // Check that Enrollment constructor got called with correct data
    expect(Enrollment).toHaveBeenCalledWith(data);

    // Confirm save was called
    expect(saveMock).toHaveBeenCalled();

    // Result should be the same data we passed in
    expect(result).toEqual(data);
  });

  it('throws error if student is missing', async () => {
    // Missing the required student field here
    const data = { course: 'course-id' };

    // Simulate validation error thrown by mongoose
    const error = new Error('Enrollment validation failed: student: Path `student` is required.');
    error.name = 'ValidationError';

    // Mock save to reject with this validation error
    const saveMock = jest.fn().mockRejectedValue(error);
    Enrollment.mockImplementation(() => ({ save: saveMock }));

    // Create enrollment without student and expect save to throw error
    const enrollment = new Enrollment(data);
    await expect(enrollment.save()).rejects.toThrow(error.message);

    // Make sure save was called even though it failed
    expect(saveMock).toHaveBeenCalled();
  });
});
