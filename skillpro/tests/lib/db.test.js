const mongoose = require('mongoose');
const connectDB = require('../../lib/db');

jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn(),
    connection: {
      readyState: 0,
      on: jest.fn(),
      once: jest.fn(),
    },
    Types: actualMongoose.Types,
  };
});

describe('connectDB', () => {
  beforeEach(() => {
    mongoose.connection.readyState = 0;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns early if mongoose is already connected', async () => {
    mongoose.connection.readyState = 1;
    const connectSpy = jest.spyOn(mongoose, 'connect');

    await connectDB();

    expect(connectSpy).not.toHaveBeenCalled();
  });

  it('connects if not already connected', async () => {
    mongoose.connection.readyState = 0;
    mongoose.connect.mockResolvedValueOnce();

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(
      expect.stringContaining('mongodb://'),
      expect.objectContaining({
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    );
    expect(consoleSpy).toHaveBeenCalledWith('✅ MongoDB connected');

    consoleSpy.mockRestore();
  });

  it('logs and exits on connection error', async () => {
    mongoose.connection.readyState = 0;
    const error = new Error('Connection failed');

    mongoose.connect.mockRejectedValueOnce(error);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    await connectDB();

    expect(consoleSpy).toHaveBeenCalledWith(
      '❌ MongoDB connection error:',
      error
    );
    expect(exitSpy).toHaveBeenCalledWith(1);

    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
