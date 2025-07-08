const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');
const http = require('http');

const handler = require('../../pages/api/enroll/[courseId].js');
const Course = require('../../models/Course');
const Professor = require('../../models/Professor');
const Student = require('../../models/Student');

let mongod;
let server;
let request;

jest.setTimeout(15000);

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri);

  server = http.createServer(async (req, res) => {
    // Patch res with Express-like methods
    res.status = function (statusCode) {
      this.statusCode = statusCode;
      return this;
    };
    res.json = function (data) {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(data));
    };

    // Extract courseId from URL path (assuming /api/enroll/:courseId)
    const url = new URL(req.url, `http://${req.headers.host}`);
    req.query = { courseId: url.pathname.split('/').pop() };

    // Do NOT parse body here — handler does it manually
    await handler(req, res);
  });

  request = supertest(server);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
  await new Promise(resolve => server.close(resolve));
});

beforeEach(async () => {
  await Course.deleteMany();
});

describe('Course API Handler E2E Tests', () => {
  it('GET returns 404 if course not found', async () => {
    const res = await request.get('/api/enroll/64f1b8c8a6e8f94b5a5a1a03');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Course not found');
  });

  it('GET returns 400 for invalid courseId', async () => {
    const res = await request.get('/api/enroll/invalid-id');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid courseId');
  });

  it('PUT returns 400 on invalid JSON body', async () => {
    const course = await Course.create({
      title: 'Old Title',
      professor: new mongoose.Types.ObjectId(),
      capacity: 20,
      description: 'desc',
    });

    const res = await request
      .put(`/api/enroll/${course._id}`)
      .set('Content-Type', 'application/json')
      .send('invalid-json');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid JSON');
  });

  it('PUT returns 404 if course not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request
      .put(`/api/enroll/${fakeId}`)
      .send(JSON.stringify({ title: 'Updated Title' }))
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Course not found');
  });

  it('PUT returns 400 on validation error', async () => {
    // Create course first
    const course = await Course.create({
      title: 'Old Title',
      professor: new mongoose.Types.ObjectId(),
      capacity: 20,
      description: 'desc',
    });

    // Send update that violates schema (e.g., capacity negative)
    const res = await request
      .put(`/api/enroll/${course._id}`)
      .send(JSON.stringify({ capacity: -5 }))
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/validation/i);
  });

  it('PUT updates existing course', async () => {
    const course = await Course.create({
      title: 'Old Title',
      professor: new mongoose.Types.ObjectId(),
      capacity: 20,
      description: 'desc',
    });

    const res = await request
      .put(`/api/enroll/${course._id}`)
      .send(JSON.stringify({ title: 'New Title' }))
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('New Title');
  });

  it('DELETE returns 404 if course not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request.delete(`/api/enroll/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Course not found');
  });

  it('DELETE deletes existing course', async () => {
    const course = await Course.create({
      title: 'Delete Me',
      professor: new mongoose.Types.ObjectId(),
      capacity: 15,
      description: 'desc',
    });

    const res = await request.delete(`/api/enroll/${course._id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Course deleted successfully');
  });

  it('GET returns course data', async () => {
    const course = await Course.create({
      title: 'Sample Course',
      professor: new mongoose.Types.ObjectId(),
      capacity: 10,
      description: 'desc',
    });

    const res = await request.get(`/api/enroll/${course._id}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Sample Course');
  });

  it('returns 405 for unsupported POST method', async () => {
    const course = await Course.create({
      title: 'Some Course',
      professor: new mongoose.Types.ObjectId(),
      capacity: 10,
      description: 'desc',
    });

    const res = await request.post(`/api/enroll/${course._id}`);
    expect(res.status).toBe(405);
    expect(res.body.message).toBe('Method Not Allowed');
  });

  it('returns 405 for unsupported PATCH method', async () => {
    const course = await Course.create({
      title: 'Some Course',
      professor: new mongoose.Types.ObjectId(),
      capacity: 10,
      description: 'desc',
    });

    const res = await request.patch(`/api/enroll/${course._id}`);

    expect(res.status).toBe(405);
    expect(res.body.message).toBe('Method Not Allowed');
  });

  it('returns 500 for unexpected errors', async () => {
  // Temporarily override Course.findById to simulate a crash
  const originalFindById = Course.findById;
  Course.findById = () => {
    throw new Error('Unexpected failure');
  };

  const courseId = new mongoose.Types.ObjectId();

  const res = await request.get(`/api/enroll/${courseId}`);

  // Restore original function
  Course.findById = originalFindById;

  expect(res.status).toBe(500);
  expect(res.body.error).toBe('Internal Server Error');
  expect(res.body.details).toMatch(/Unexpected failure/);
});

});
