// tests/models/mentor.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Mentor = require('../../models/Mentor');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // Ensure indexes (including unique email) are created before inserting
  await Mentor.init();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await Mentor.deleteMany();
});

describe('Mentor Model', () => {
  it('requires name, email, and industry', async () => {
    const m = new Mentor({});
    let err;
    try {
      await m.validate();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.errors.name).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.industry).toBeDefined();
  });

  it('sets default rating and sessionsCompleted to 0', async () => {
    const m = await Mentor.create({
      name: 'Test',
      email: 'test@example.com',
      industry: 'Tech',
    });
    expect(m.rating).toBe(0);
    expect(m.sessionsCompleted).toBe(0);
  });

  it('enforces unique email', async () => {
    await Mentor.create({
      name: 'A',
      email: 'dup@example.com',
      industry: 'X',
    });

    let err;
    try {
      await Mentor.create({
        name: 'B',
        email: 'dup@example.com',
        industry: 'Y',
      });
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    // 11000 is Mongo duplicate key error
    expect(err.code).toBe(11000);
  });
});
