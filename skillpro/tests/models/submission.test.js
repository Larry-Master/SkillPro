const Submission = require("@/models/Submission");

jest.mock("@/models/Submission");

describe("Submission model", () => {
  afterEach(() => jest.clearAllMocks());

  it("should create and save a new submission", async () => {
    const mockSubmissionData = {
      student: "507f1f77bcf86cd799439011",
      assignment: "707f1f77bcf86cd799439013",
      content: "My assignment answer",
      submittedAt: new Date("2025-08-03T15:00:00Z"),
    };
    const mockSave = jest.fn().mockResolvedValue(mockSubmissionData);
    Submission.mockImplementation(() => ({
      save: mockSave,
    }));

    const submission = new Submission(mockSubmissionData);
    const savedSubmission = await submission.save();

    expect(Submission).toHaveBeenCalledWith(mockSubmissionData);
    expect(mockSave).toHaveBeenCalled();
    expect(savedSubmission).toEqual(mockSubmissionData);
  });

  it("should throw an error if student is missing", async () => {
    const mockSubmissionData = {
      // student missing
      assignment: "707f1f77bcf86cd799439013",
      content: "No student",
    };
    const validationError = new Error(
      "Submission validation failed: student: Path `student` is required.",
    );
    validationError.name = "ValidationError";

    const mockSave = jest.fn().mockRejectedValue(validationError);
    Submission.mockImplementation(() => ({
      save: mockSave,
    }));

    const submission = new Submission(mockSubmissionData);
    await expect(submission.save()).rejects.toThrow(
      "Submission validation failed: student: Path `student` is required.",
    );
    expect(mockSave).toHaveBeenCalled();
  });

  it("should throw an error if assignment is missing", async () => {
    const mockSubmissionData = {
      student: "507f1f77bcf86cd799439011",
      // assignment missing
      content: "No assignment",
    };
    const validationError = new Error(
      "Submission validation failed: assignment: Path `assignment` is required.",
    );
    validationError.name = "ValidationError";

    const mockSave = jest.fn().mockRejectedValue(validationError);
    Submission.mockImplementation(() => ({
      save: mockSave,
    }));

    const submission = new Submission(mockSubmissionData);
    await expect(submission.save()).rejects.toThrow(
      "Submission validation failed: assignment: Path `assignment` is required.",
    );
    expect(mockSave).toHaveBeenCalled();
  });

  it("should set submittedAt to default if not provided", async () => {
    const mockSubmissionData = {
      student: "507f1f77bcf86cd799439011",
      assignment: "707f1f77bcf86cd799439013",
      content: "Default date test",
      // submittedAt omitted
    };
    const mockNow = new Date("2025-08-03T15:00:00Z");
    const mockSave = jest
      .fn()
      .mockResolvedValue({ ...mockSubmissionData, submittedAt: mockNow });
    Submission.mockImplementation(() => ({
      save: mockSave,
    }));

    const submission = new Submission(mockSubmissionData);
    const savedSubmission = await submission.save();

    expect(savedSubmission.submittedAt).toBe(mockNow);
    expect(mockSave).toHaveBeenCalled();
  });
});
