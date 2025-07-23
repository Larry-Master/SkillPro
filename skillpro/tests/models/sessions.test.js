import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/mentors/[id]/sessions';
import Mentor from '@/models/Mentor';

// 🧪 Mock connectDB to avoid real DB hit
jest.mock('../../lib/db', () => {
  const fn = jest.fn().mockResolvedValue();
  fn.connectDB = fn;
  return fn;
});

describe('Mentor Sessions API (Unit)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns 404 if mentor not found', async () => {
    const selectMock = jest.fn().mockResolvedValue(null);
    jest.spyOn(Mentor, 'findById').mockReturnValue({ select: selectMock });

    const { req, res } = createMocks({
      method: 'GET',
      query: { id: 'nonexistent-id' },
    });

    await handler(req, res);

    expect(Mentor.findById).toHaveBeenCalledWith('nonexistent-id');
    expect(selectMock).toHaveBeenCalledWith('sessionsCompleted');
    expect(res._getStatusCode()).toBe(404);
  });

  it('returns sessionsCompleted if mentor exists', async () => {
    const doc = { sessionsCompleted: 5 };
    const selectMock = jest.fn().mockResolvedValue(doc);
    jest.spyOn(Mentor, 'findById').mockReturnValue({ select: selectMock });

    const { req, res } = createMocks({
      method: 'GET',
      query: { id: 'some-id' },
    });

    await handler(req, res);

    expect(Mentor.findById).toHaveBeenCalledWith('some-id');
    expect(selectMock).toHaveBeenCalledWith('sessionsCompleted');
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData()).data.sessionsCompleted).toBe(5);
  });

  it('increments sessionsCompleted on POST', async () => {
    const updated = { sessionsCompleted: 6 };
    const updateSpy = jest
      .spyOn(Mentor, 'findByIdAndUpdate')
      .mockResolvedValue(updated);

    const { req, res } = createMocks({
      method: 'POST',
      query: { id: 'abc123' },
    });

    await handler(req, res);

    expect(updateSpy).toHaveBeenCalledWith(
      'abc123',
      { $inc: { sessionsCompleted: 1 } },
      { new: true }
    );
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData()).data.sessionsCompleted).toBe(6);
  });
});
