const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');
const http = require('http');

const handler = require('../../pages/api/courses/[courseId].js');
const Course = require('../../models/Course');
const Professor = require('../../models/Professor');
const Student = require('../../models/Student');

let mongod;
let server;
let request;

jest.setTimeout(15000); // timeout increase

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
  await mongoose.connect(uri);

  server = http.createServer(async (req, res) => {
    res.status = code => {
      res.statusCode = code;
      return res;
    };
    res.json = data => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    };

    const url = new URL(req.url, `http://${req.headers.host}`);
    req.query = { courseId: url.pathname.split('/').pop() };

    await handler(req, res);
  });

  request = supertest(server);
});


afterAll(async () => {
  // Disconnect mongoose and stop in-memory server after tests
  await mongoose.disconnect();
  await mongod?.stop();
  // Close the HTTP server
  await new Promise(resolve => server.close(resolve));
});

// Clear courses before each test so tests don't affect each other
beforeEach(() => Course.deleteMany());

describe('Course API', () => {
  // Helper function to create a course in DB with default values
  const createCourse = async (overrides = {}) =>
    Course.create({
      title: 'Test Course',
      professor: new mongoose.Types.ObjectId(),
      capacity: 30,
      description: 'test desc',
      ...overrides,
    });

  describe('GET /api/enroll/:courseId', () => {
    it('returns 404 if course not found', async () => {
      const res = await request.get('/api/enroll/64f1b8c8a6e8f94b5a5a1a09');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Course not found');
    });

    it('returns 400 for invalid courseId', async () => {
      const res = await request.get('/api/enroll/invalid-id');
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid courseId');
    });

    it('returns 200 with course data', async () => {
      // use helper function and extract id
      const course = await createCourse({ title: 'Sample' });
      const res = await request.get(`/api/enroll/${course._id}`);
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Sample');
    });

    it('returns 500 on unexpected server error', async () => {
      // Force Course.findById to throw an error
      const original = Course.findById;
      Course.findById = () => {
        throw new Error('Fail');
      };

      const id = new mongoose.Types.ObjectId();
      const res = await request.get(`/api/enroll/${id}`);
      // Restore original method so other tests not affected
      Course.findById = original;

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal Server Error');
      expect(res.body.details).toMatch(/Fail/);
    });
  });

  describe('PUT /api/enroll/:courseId', () => {
    it('returns 400 on invalid JSON', async () => {
      const course = await createCourse();
      const res = await request
        .put(`/api/enroll/${course._id}`)
        .set('Content-Type', 'application/json')
        .send('bad-json'); // send invalid JSON string
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid JSON');
    });

    it('returns 404 if course not found', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request
        .put(`/api/enroll/${id}`)
        .send(JSON.stringify({ title: 'New Title' }))
        .set('Content-Type', 'application/json');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Course not found');
    });

    it('returns 400 on validation error', async () => {
      const course = await createCourse();
      const res = await request
        .put(`/api/enroll/${course._id}`)
        .send(JSON.stringify({ capacity: -10 })) // invalid capacity
        .set('Content-Type', 'application/json');
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/validation/i);
    });

    it('returns 200 on success', async () => {
      const course = await createCourse();
      const res = await request
        .put(`/api/enroll/${course._id}`)
        .send(JSON.stringify({ title: 'Updated Title' }))
        .set('Content-Type', 'application/json');
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Title');
    });
  });

  describe('DELETE /api/enroll/:courseId', () => {
    it('returns 404 if course not found', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request.delete(`/api/enroll/${id}`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Course not found');
    });

    it('returns 200 on success', async () => {
      const course = await createCourse();
      const res = await request.delete(`/api/enroll/${course._id}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Course deleted successfully');
    });
  });

  describe('Unsupported HTTP methods', () => {
    it('POST returns 405 Method Not Allowed', async () => {
      const course = await createCourse();
      const res = await request.post(`/api/enroll/${course._id}`);
      expect(res.status).toBe(405);
      expect(res.body.message).toBe('Method Not Allowed');
    });

    it('PATCH returns 405 Method Not Allowed', async () => {
      const course = await createCourse();
      const res = await request.patch(`/api/enroll/${course._id}`);
      expect(res.status).toBe(405);
      expect(res.body.message).toBe('Method Not Allowed');
    });
  });


});
