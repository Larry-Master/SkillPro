import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDB from "@/lib/db";

let mongod;
const originalExit = process.exit;
const originalEnv = { ...process.env };

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  // Mock process.exit to prevent actual exit during tests
  process.exit = jest.fn();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
  process.exit = originalExit;
  // Restore original env
  process.env = { ...originalEnv };
});

beforeEach(() => {
  // Reset environment variables before each test
  process.env.MONGODB_URI = mongod.getUri();
  delete process.env.ATLAS_MONGODB_URI;
  jest.clearAllMocks();
});

afterEach(async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    // Ignore disconnect errors
  }
});

describe("connectDB (integration)", () => {
  it("returns early if mongoose is already connected", async () => {
    // Test the early return when already connected
    await mongoose.connect(process.env.MONGODB_URI);
    expect(mongoose.connection.readyState).toBe(1); // connected

    const result = await connectDB();
    expect(result).toBeUndefined(); // no new connection attempt
  });

  it("connects successfully with MONGODB_URI", async () => {
    // Test successful connection with MONGODB_URI
    expect(mongoose.connection.readyState).toBe(0); // disconnected

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await connectDB();

    expect(mongoose.connection.readyState).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      "✅ MongoDB connected to",
      expect.any(String),
    );
    consoleSpy.mockRestore();
  });

  it("connects successfully with ATLAS_MONGODB_URI", async () => {
    // Test ATLAS_MONGODB_URI fallback
    const mongoUri = process.env.MONGODB_URI;
    delete process.env.MONGODB_URI;
    process.env.ATLAS_MONGODB_URI = mongoUri;

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await connectDB();

    expect(mongoose.connection.readyState).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      "✅ MongoDB connected to",
      expect.any(String),
    );
    consoleSpy.mockRestore();
  });

  it("throws error if no MongoDB URI provided", async () => {
    // Test error when no URI provided
    delete process.env.MONGODB_URI;
    delete process.env.ATLAS_MONGODB_URI;

    await expect(connectDB()).rejects.toThrow(
      "No MongoDB URI provided to connectDB()",
    );
  });

  it("handles connection errors correctly", async () => {
    // Test connection error handling
    process.env.MONGODB_URI = "invalid://uri";
    
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const processExitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});
    
    try {
      await connectDB();
    } catch (error) {
      // Expected to throw, but we want to verify the error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "❌ MongoDB connection error:",
        expect.any(Error)
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    } finally {
      consoleErrorSpy.mockRestore();
      processExitSpy.mockRestore();
    }
  });
});

