import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB from '@/lib/db';

let mongod;


beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async() => {
  await mongoose.disconnect();
});

describe('connectDB (integration)', () => {
  it('returns early if mongoose is already connected', async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    expect(mongoose.connection.readyState).toBe(1); // connected

    const result = await connectDB();
    expect(result).toBeUndefined(); // no new connection attempt
  });

  it('connects if not already connected', async () => {
    expect(mongoose.connection.readyState).toBe(0); // disconnected

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await connectDB();

    expect(mongoose.connection.readyState).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      '✅ MongoDB connected to',
      expect.any(String)
    );
    consoleSpy.mockRestore();
  });

  it('throws error if no MongoDB URI provided', async () => {
    delete process.env.MONGODB_URI;
    delete process.env.ATLAS_MONGODB_URI;

    await expect(connectDB()).rejects.toThrow('No MongoDB URI provided to connectDB()');
  });

  it('logs and exits on connection error', async () => {
    process.env.MONGODB_URI = 'invalid://localhost:27017/fail';
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    await connectDB();

    expect(errorSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);

    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
