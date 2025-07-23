import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';
import http from 'http';

import handler from '@/pages/api/courses/[courseId].js';
import Course from '@/models/Course';

let mongod, server, request;

const parseJSONBody = req =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => (data += chunk.toString()));
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });

const createServer = () =>
  http.createServer(async (req, res) => {
    const urlParts = req.url.split('/');
    req.query = { courseId: urlParts[urlParts.length - 1] };

    if (['PUT', 'POST'].includes(req.method)) {
      try {
        req.body = await parseJSONBody(req);
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Invalid JSON' }));
      }
    } else {
      req.body = {};
    }

    res.status = code => {
      res.statusCode = code;
      return res;
    };
    res.json = data => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
      return res;
    };

    return handler(req, res);
  });

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
  await mongoose.connect(uri);
  server = createServer();
  request = supertest(server);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
  await new Promise(resolve => server.close(resolve));
});

beforeEach(() => Course.deleteMany());



describe('Course API', () => {
  it('GET returns 404 if course not found', async () => {
    const res = await request.get('/api/courses/64f1b8c8a6e8f94b5a5a1a09');
    expect(res.status).toBe(404);
  });

  it('GET returns 200 and course data on success', async () => {
  const course = await Course.create({
    title: 'Test Course',
    professor: new mongoose.Types.ObjectId(),
    capacity: 25,
    description: 'Some description',
  });

  const res = await request.get(`/api/courses/${course._id}`);

  expect(res.status).toBe(200);
  expect(res.body.title).toBe('Test Course');
  expect(res.body.capacity).toBe(25);
});


  it('GET returns 400 for invalid courseId', async () => {
    const res = await request.get('/api/courses/invalid-id');
    expect(res.status).toBe(400);
  });

  it('PUT returns 400 on validation error', async () => {
    const course = await Course.create({
      title: 'Test',
      professor: new mongoose.Types.ObjectId(),
      capacity: 10,
      description: 'desc',
  });

    const res = await request
      .put(`/api/courses/${course._id}`)
      .send({ capacity: -10 }); // invalid capacity

    expect(res.status).toBe(400);
  });

  it('PUT returns 404 if course not found', async () => {
  const fakeId = new mongoose.Types.ObjectId();

  const res = await request
    .put(`/api/courses/${fakeId}`)
    .send({ title: 'Will not update' });

  expect(res.status).toBe(404);
  expect(res.body.message).toBe('Course not found');
  });

  it('PUT returns 200 on success', async () => {
    const course = await Course.create({
      title: 'Test',
      professor: new mongoose.Types.ObjectId(),
      capacity: 10,
      description: 'desc',
  });

    const res = await request
      .put(`/api/courses/${course._id}`)
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('DELETE returns 404 if course not found', async () => {
  const fakeId = new mongoose.Types.ObjectId();

  const res = await request.delete(`/api/courses/${fakeId}`);

  expect(res.status).toBe(404);
  expect(res.body.message).toBe('Course not found');
});


  it('DELETE returns 200 on success', async () => {
    const course = await Course.create({
      title: 'Test',
      professor: new mongoose.Types.ObjectId(),
      capacity: 10,
      description: 'desc',
  });

    const res = await request.delete(`/api/courses/${course._id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Course deleted successfully');
  });

  it('returns 405 for unsupported method', async () => {
  const course = await Course.create({
    title: 'Test',
    professor: new mongoose.Types.ObjectId(),
    capacity: 10,
  });

  const res = await request.post(`/api/courses/${course._id}`);
  expect(res.status).toBe(405);
  expect(res.body.message).toBe('Method Not Allowed');
  });

  it('returns 500 on unexpected error', async () => {
  const course = await Course.create({
    title: 'Test',
    professor: new mongoose.Types.ObjectId(),
    capacity: 10,
  });
  // Temporarily override the function
  const original = Course.findByIdAndUpdate;
  Course.findByIdAndUpdate = () => { throw new Error('Something failed'); };

  const res = await request.put(`/api/courses/${course._id}`).send({ title: 'Oops' });

  expect(res.status).toBe(500);
  expect(res.body.error).toBe('Internal Server Error');

  // Restore original function
  Course.findByIdAndUpdate = original;
  });


});
