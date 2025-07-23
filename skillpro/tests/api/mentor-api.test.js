// tests/api/mentor-api.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const http = require('http');
const supertest = require('supertest');

const sessionsHandler = require('@/pages/api/mentors/[id]/sessions');
const reviewsHandler  = require('@/pages/api/mentors/[id]/reviews');
const Mentor = require('@/models/Mentor');

// bump timeout for all tests & hooks
jest.setTimeout(30000);

let mongod, server, request;

function setupServer() {
  return http.createServer((req, res) => {
    res.status = code => { res.statusCode = code; return res; };
    res.json = data => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    };

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      req.body = body ? JSON.parse(body) : {};
      const url = new URL(req.url, 'http://localhost');
      const parts = url.pathname.split('/').filter(Boolean);
      // /api/mentors/:id/…
      req.query = { id: parts[2] };

      if (parts[3] === 'sessions')   return sessionsHandler(req, res);
      if (parts[3] === 'reviews')    return reviewsHandler(req, res);
      res.status(404).json({ success: false, message: 'Not Found' });
    });
  });
}

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // ✅ Set the env variable for connectDB to pick up
  process.env.MONGODB_URI = uri;

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  server = setupServer();
  request = supertest(server);
});


afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
  await new Promise(resolve => server.close(resolve));
});

beforeEach(async () => {
  // now that mongoose.connection.readyState === 1, this will resolve quickly
  await Mentor.deleteMany();
});

describe('Mentor API (E2E)', () => {
  it('returns 404 for GET /sessions on non-existent mentor', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request.get(`/api/mentors/${fakeId}/sessions`);
    expect(res.status).toBe(404);
  });

  it('increments and returns sessionsCompleted', async () => {
    const m = await Mentor.create({
      name:        'A',
      email:       'a@x.com',
      industry:    'X'
    });

    const postRes = await request
      .post(`/api/mentors/${m._id}/sessions`)
      .send();
    expect(postRes.status).toBe(200);
    expect(postRes.body.data.sessionsCompleted).toBe(1);

    const getRes = await request.get(`/api/mentors/${m._id}/sessions`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.data.sessionsCompleted).toBe(1);
  });

  it('returns default rating on GET /reviews', async () => {
    const m = await Mentor.create({
      name:     'B',
      email:    'b@x.com',
      industry: 'Y'
    });

    const res = await request.get(`/api/mentors/${m._id}/reviews`);
    expect(res.status).toBe(200);
    expect(res.body.data.rating).toBe(0);
  });

  it('increments rating on POST /reviews', async () => {
    const m = await Mentor.create({
      name:     'C',
      email:    'c@x.com',
      industry: 'Z'
    });

    const postRes1 = await request
      .post(`/api/mentors/${m._id}/reviews`)
      .send({ rating: 5 })
      .set('Content-Type', 'application/json');
    expect(postRes1.status).toBe(200);
    expect(postRes1.body.data.rating).toBe(5);

    const postRes2 = await request
      .post(`/api/mentors/${m._id}/reviews`)
      .send({ rating: 2 })
      .set('Content-Type', 'application/json');
    expect(postRes2.status).toBe(200);
    expect(postRes2.body.data.rating).toBe(7);
  });
});
