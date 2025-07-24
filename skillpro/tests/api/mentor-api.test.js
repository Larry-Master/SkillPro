import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import http from 'http';
import supertest from 'supertest';

import sessionsHandler from '@/pages/api/mentors/[id]/sessions';
import reviewsHandler from '@/pages/api/mentors/[id]/reviews';
import Mentor from '@/models/Mentor';

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
  describe('Sessions API', () => {
    it('returns 404 for GET /sessions on non-existent mentor', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request.get(`/api/mentors/${fakeId}/sessions`);
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ success: false, message: 'Mentor not found' });
    });

    it('returns 404 for POST /sessions on non-existent mentor', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request.post(`/api/mentors/${fakeId}/sessions`).send();
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ success: false, message: 'Mentor not found' });
    });

    it('increments and returns sessionsCompleted', async () => {
      const mentor = await Mentor.create({
        name: 'A',
        email: 'a@x.com',
        industry: 'X',
        sessionsCompleted: 0
      });

      const postRes = await request
        .post(`/api/mentors/${mentor._id}/sessions`)
        .send();
      expect(postRes.status).toBe(200);
      expect(postRes.body.success).toBe(true);
      expect(postRes.body.data.sessionsCompleted).toBe(1);

      const getRes = await request.get(`/api/mentors/${mentor._id}/sessions`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.success).toBe(true);
      expect(getRes.body.data.sessionsCompleted).toBe(1);
    });

    it('handles multiple session increments correctly', async () => {
      const mentor = await Mentor.create({
        name: 'D',
        email: 'd@x.com',
        industry: 'W',
        sessionsCompleted: 5
      });

      const postRes = await request
        .post(`/api/mentors/${mentor._id}/sessions`)
        .send();
      expect(postRes.status).toBe(200);
      expect(postRes.body.data.sessionsCompleted).toBe(6);
    });
  });

  describe('Reviews API', () => {
    it('returns 404 for GET /reviews on non-existent mentor', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request.get(`/api/mentors/${fakeId}/reviews`);
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ success: false, message: 'Mentor not found' });
    });

    it('returns 404 for POST /reviews on non-existent mentor', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request
        .post(`/api/mentors/${fakeId}/reviews`)
        .send({ rating: 5 });
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ success: false, message: 'Mentor not found' });
    });

    it('returns default rating on GET /reviews', async () => {
      const mentor = await Mentor.create({
        name: 'B',
        email: 'b@x.com',
        industry: 'Y'
      });

      const res = await request.get(`/api/mentors/${mentor._id}/reviews`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rating).toBe(0);
    });

    it('validates rating value on POST /reviews', async () => {
      const mentor = await Mentor.create({
        name: 'E',
        email: 'e@x.com',
        industry: 'V'
      });

      const invalidRes = await request
        .post(`/api/mentors/${mentor._id}/reviews`)
        .send({ rating: 6 })
        .set('Content-Type', 'application/json');
      expect(invalidRes.status).toBe(400);
      expect(invalidRes.body).toEqual({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });

      const missingRes = await request
        .post(`/api/mentors/${mentor._id}/reviews`)
        .send({})
        .set('Content-Type', 'application/json');
      expect(missingRes.status).toBe(400);
      expect(missingRes.body).toEqual({ 
        success: false, 
        message: 'Rating is required' 
      });
    });

    it('increments rating on POST /reviews', async () => {
      const mentor = await Mentor.create({
        name: 'C',
        email: 'c@x.com',
        industry: 'Z',
        rating: 0
      });

      const postRes1 = await request
        .post(`/api/mentors/${mentor._id}/reviews`)
        .send({ rating: 5 })
        .set('Content-Type', 'application/json');
      expect(postRes1.status).toBe(200);
      expect(postRes1.body.success).toBe(true);
      expect(postRes1.body.data.rating).toBe(5);

      const postRes2 = await request
        .post(`/api/mentors/${mentor._id}/reviews`)
        .send({ rating: 2 })
        .set('Content-Type', 'application/json');
      expect(postRes2.status).toBe(200);
      expect(postRes2.body.success).toBe(true);
      expect(postRes2.body.data.rating).toBe(7);

      const getRes = await request.get(`/api/mentors/${mentor._id}/reviews`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.success).toBe(true);
      expect(getRes.body.data.rating).toBe(7);
    });
  });

  describe('Method not allowed', () => {
    it('returns 405 for PUT /sessions', async () => {
      const mentor = await Mentor.create({
        name: 'F',
        email: 'f@x.com',
        industry: 'U'
      });
      
      const res = await request.put(`/api/mentors/${mentor._id}/sessions`);
      expect(res.status).toBe(405);
      expect(res.headers.allow).toBe('GET, POST');
    });

    it('returns 405 for PUT /reviews', async () => {
      const mentor = await Mentor.create({
        name: 'G',
        email: 'g@x.com',
        industry: 'T'
      });
      
      const res = await request.put(`/api/mentors/${mentor._id}/reviews`);
      expect(res.status).toBe(405);
      expect(res.headers.allow).toBe('GET, POST');
    });

    it('returns 404 for unknown endpoints', async () => {
      const mentor = await Mentor.create({
        name: 'H',
        email: 'h@x.com',
        industry: 'S'
      });
      
      const res = await request.get(`/api/mentors/${mentor._id}/unknown`);
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ 
        success: false, 
        message: 'Not Found' 
      });
    });
  });
});
