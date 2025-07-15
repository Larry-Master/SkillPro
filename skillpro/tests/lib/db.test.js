process.env.MONGODB_URI = 'mongodb://mocked-uri/test';
const mongoose = require('mongoose');
const connectDB = require('../../lib/db');



// Mock mongoose so we can control its behavior in tests
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn(), // mock connect method
    connection: {
      readyState: 0, // simulate disconnected state by default
      on: jest.fn(),
      once: jest.fn(),
    },
    Types: actualMongoose.Types, // keep actual Types for ObjectId, etc.
  };
});

describe('connectDB', () => {
  beforeEach(() => {
    mongoose.connection.readyState = 0; // reset connection state before each test
    jest.clearAllMocks(); // clear call counts on mocks
  });

  afterEach(() => {
    jest.restoreAllMocks(); // restore any spied methods (console, process, etc.)
  });

  it('returns early if mongoose is already connected', async () => {
    mongoose.connection.readyState = 1; // simulate already connected

    await connectDB();

    // connect should NOT be called because we are already connected
    expect(mongoose.connect).not.toHaveBeenCalled();
  });

  it('connects if not already connected', async () => {
  mongoose.connect.mockResolvedValueOnce();
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});


  await connectDB();

  expect(mongoose.connect).toHaveBeenCalled();

  // match the actual console log output
  const dbName = new URL(process.env.MONGODB_URI).pathname.replace('/', '');
  expect(consoleSpy).toHaveBeenCalledWith('✅ MongoDB connected to', dbName);
  });


  it('logs and exits on connection error', async () => {
    const error = new Error('Connection failed');
    mongoose.connect.mockRejectedValueOnce(error); // mock connection failure

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    await connectDB();

    // check error was logged
    expect(consoleSpy).toHaveBeenCalledWith('❌ MongoDB connection error:', error);
    // check process.exit was called with 1 (failure)
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('throws error if no MongoDB URI provided', async () => {
  // Clear both env variables
  delete process.env.MONGODB_URI;
  delete process.env.ATLAS_MONGODB_URI;

  await expect(connectDB()).rejects.toThrow('No MongoDB URI provided to connectDB()');
});
});
