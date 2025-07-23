const Certificate = require('../../models/Certificate');

jest.mock('../../models/Certificate');

describe('Certificate model', () => {
  afterEach(() => jest.clearAllMocks());

  it('should create and save a new certificate', async () => {
    const mockCertificateData = {
      student: '507f1f77bcf86cd799439011',
      course: '607f1f77bcf86cd799439012',
      date: new Date('2025-08-02T00:00:00Z')
    };
    const mockSave = jest.fn().mockResolvedValue(mockCertificateData);
    Certificate.mockImplementation(() => ({
      save: mockSave
    }));

    const certificate = new Certificate(mockCertificateData);
    const savedCertificate = await certificate.save();

    expect(Certificate).toHaveBeenCalledWith(mockCertificateData);
    expect(mockSave).toHaveBeenCalled();
    expect(savedCertificate).toEqual(mockCertificateData);
  });

  it('should throw an error if student is missing', async () => {
    const mockCertificateData = {
      // student is missing!
      course: '607f1f77bcf86cd799439012'
    };
    const validationError = new Error('Certificate validation failed: student: Path `student` is required.');
    validationError.name = 'ValidationError';

    const mockSave = jest.fn().mockRejectedValue(validationError);
    Certificate.mockImplementation(() => ({
      save: mockSave
    }));

    const certificate = new Certificate(mockCertificateData);
    await expect(certificate.save()).rejects.toThrow('Certificate validation failed: student: Path `student` is required.');
    expect(mockSave).toHaveBeenCalled();
  });

  it('should set date to default if not provided', async () => {
    const mockCertificateData = {
      student: '507f1f77bcf86cd799439011',
      course: '607f1f77bcf86cd799439012'
      // date is omitted
    };
    const mockNow = new Date('2025-08-02T12:00:00Z');
    const mockSave = jest.fn().mockResolvedValue({ ...mockCertificateData, date: mockNow });
    Certificate.mockImplementation(() => ({
      save: mockSave
    }));

    const certificate = new Certificate(mockCertificateData);
    const savedCertificate = await certificate.save();

    expect(savedCertificate.date).toBe(mockNow);
    expect(mockSave).toHaveBeenCalled();
  });
});
