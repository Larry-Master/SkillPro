import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import supertest from "supertest";
import http from "http";

import sessionsHandler from "@/pages/api/mentors/[mentorId]/sessions.js";
import reviewsHandler from "@/pages/api/mentors/[mentorId]/reviews.js";
import Mentor from "@/models/Mentor";

let mongod, server, request;

const parseJSONBody = (req) =>
  new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk.toString()));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
  });

const createServer = () =>
  http.createServer(async (req, res) => {
    const urlParts = req.url.split("/");
    const endpoint = urlParts[urlParts.length - 1];
    const mentorId = urlParts[urlParts.length - 2];
    
    req.query = { mentorId };

    if (["PUT", "POST"].includes(req.method)) {
      try {
        req.body = await parseJSONBody(req);
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Invalid JSON" }));
      }
    } else {
      req.body = {};
    }

    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
      return res;
    };

    if (endpoint === 'sessions') return sessionsHandler(req, res);
    if (endpoint === 'reviews') return reviewsHandler(req, res);
    
    res.status(404).json({ message: 'Not Found' });
  });

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  process.env.MONGODB_URI = uri;

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  server = createServer();
  request = supertest(server);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
  await new Promise(resolve => server.close(resolve));
});

beforeEach(async () => {
  await Mentor.deleteMany();
});

describe('Mentor API (E2E)', () => {
  describe('Sessions API', () => {
    it('returns 404 for GET /sessions on non-existent mentor', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request.get(`/api/mentors/${fakeId}/sessions`);
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Mentor not found' });
    });

    it('returns 404 for POST /sessions on non-existent mentor', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request.post(`/api/mentors/${fakeId}/sessions`).send();
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Mentor not found' });
    });

    it('increments and returns sessionsCompleted', async () => {
      const mentor = await Mentor.create({
        name: 'Test Mentor',
        email: 'test@example.com',
        industry: 'Tech',
        sessionsCompleted: 0,
      });

      const postRes = await request
        .post(`/api/mentors/${mentor._id}/sessions`)
        .send();
      expect(postRes.status).toBe(200);
      expect(postRes.body.sessionsCompleted).toBe(1);
    });

    it('returns 0 for GET /sessions when mentor has no sessionsCompleted field', async () => {
      // Create mentor without sessionsCompleted field
      const mentor = new Mentor({
        name: 'Test Mentor',
        email: 'test@example.com',
        industry: 'Tech',
      });
      // Remove the sessionsCompleted field that gets set by default
      mentor.sessionsCompleted = undefined;
      await mentor.save();

      const res = await request.get(`/api/mentors/${mentor._id}/sessions`);
      expect(res.status).toBe(200);
      expect(res.body.sessionsCompleted).toBe(0);
    });

    it('handles multiple session increments correctly', async () => {
      const mentor = await Mentor.create({
        name: 'Test Mentor',
        email: 'test@example.com', 
        industry: 'Tech',
        sessionsCompleted: 5,
      });

      const postRes = await request
        .post(`/api/mentors/${mentor._id}/sessions`)
        .send();
      expect(postRes.status).toBe(200);
      expect(postRes.body.sessionsCompleted).toBe(6);
    });
  });

  describe('Reviews API', () => {
    it('returns 404 for GET /reviews on non-existent mentor', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request.get(`/api/mentors/${fakeId}/reviews`);
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Mentor not found' });
    });

    it('returns 404 for POST /reviews on non-existent mentor', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request
        .post(`/api/mentors/${fakeId}/reviews`)
        .send({ rating: 5 });
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Mentor not found' });
    });

    it('returns default rating on GET /reviews', async () => {
      const mentor = await Mentor.create({
        name: 'Test Mentor',
        email: 'test@example.com',
        industry: 'Tech',
      });

      const res = await request.get(`/api/mentors/${mentor._id}/reviews`);
      expect(res.status).toBe(200);
      expect(res.body.rating).toBe(0);
    });

    it('validates rating value on POST /reviews', async () => {
      const mentor = await Mentor.create({
        name: 'Test Mentor',
        email: 'test@example.com',
        industry: 'Tech',
      });

      const invalidRes = await request
        .post(`/api/mentors/${mentor._id}/reviews`)
        .send({ rating: 6 })
        .set('Content-Type', 'application/json');
      expect(invalidRes.status).toBe(400);
      expect(invalidRes.body).toEqual({ 
        message: 'Rating must be between 1 and 5' 
      });

      const validRes = await request
        .post(`/api/mentors/${mentor._id}/reviews`)
        .send({ rating: 4 })
        .set('Content-Type', 'application/json');
      expect(validRes.status).toBe(200);
    });

    it('increments rating on POST /reviews', async () => {
      const mentor = await Mentor.create({
        name: 'Test Mentor',
        email: 'test@example.com',
        industry: 'Tech',
        rating: 0,
      });

      const postRes1 = await request
        .post(`/api/mentors/${mentor._id}/reviews`)
        .send({ rating: 5 })
        .set('Content-Type', 'application/json');
      expect(postRes1.status).toBe(200);
      expect(postRes1.body.rating).toBe(5);

      const getRes = await request.get(`/api/mentors/${mentor._id}/reviews`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.rating).toBe(5);

      const postRes2 = await request
        .post(`/api/mentors/${mentor._id}/reviews`)
        .send({ rating: 3 })
        .set('Content-Type', 'application/json');
      expect(postRes2.status).toBe(200);
      expect(postRes2.body.rating).toBe(8);
    });
  });

  describe('Invalid mentorId validation', () => {
    it('returns 400 for invalid mentorId on GET /sessions', async () => {
      const res = await request.get('/api/mentors/invalid-id/sessions');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Invalid mentorId' });
    });

    it('returns 400 for invalid mentorId on POST /sessions', async () => {
      const res = await request.post('/api/mentors/invalid-id/sessions').send();
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Invalid mentorId' });
    });

    it('returns 400 for invalid mentorId on GET /reviews', async () => {
      const res = await request.get('/api/mentors/invalid-id/reviews');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Invalid mentorId' });
    });

    it('returns 400 for invalid mentorId on POST /reviews', async () => {
      const res = await request
        .post('/api/mentors/invalid-id/reviews')
        .send({ rating: 5 });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Invalid mentorId' });
    });
  });

  describe('Error handling', () => {
    it('handles database errors gracefully on sessions GET', async () => {
      const validId = new mongoose.Types.ObjectId();
      
      // Mock Mentor.findById to throw a database error
      const originalFindById = Mentor.findById;
      Mentor.findById = jest.fn().mockRejectedValue(new Error('Database connection failed'));
      
      const res = await request.get(`/api/mentors/${validId}/sessions`);
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal Server Error');
      
      // Restore original method
      Mentor.findById = originalFindById;
    });

    it('handles database errors gracefully on sessions POST', async () => {
      const validId = new mongoose.Types.ObjectId();
      
      // Mock Mentor.findByIdAndUpdate to throw a database error
      const originalFindByIdAndUpdate = Mentor.findByIdAndUpdate;
      Mentor.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database connection failed'));
      
      const res = await request.post(`/api/mentors/${validId}/sessions`).send();
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal Server Error');
      
      // Restore original method
      Mentor.findByIdAndUpdate = originalFindByIdAndUpdate;
    });

    it('handles database errors gracefully on reviews GET', async () => {
      const validId = new mongoose.Types.ObjectId();
      
      // Mock Mentor.findById to throw a database error
      const originalFindById = Mentor.findById;
      Mentor.findById = jest.fn().mockRejectedValue(new Error('Database connection failed'));
      
      const res = await request.get(`/api/mentors/${validId}/reviews`);
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal Server Error');
      
      // Restore original method
      Mentor.findById = originalFindById;
    });

    it('handles database errors gracefully on reviews POST', async () => {
      const validId = new mongoose.Types.ObjectId();
      
      // Mock Mentor.findByIdAndUpdate to throw a database error
      const originalFindByIdAndUpdate = Mentor.findByIdAndUpdate;
      Mentor.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database connection failed'));
      
      const res = await request
        .post(`/api/mentors/${validId}/reviews`)
        .send({ rating: 5 });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal Server Error');
      
      // Restore original method
      Mentor.findByIdAndUpdate = originalFindByIdAndUpdate;
    });

    it('handles validation errors gracefully on reviews POST', async () => {
      const validId = new mongoose.Types.ObjectId();
      
      // Mock Mentor.findByIdAndUpdate to throw a validation error
      const originalFindByIdAndUpdate = Mentor.findByIdAndUpdate;
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      Mentor.findByIdAndUpdate = jest.fn().mockRejectedValue(validationError);
      
      const res = await request
        .post(`/api/mentors/${validId}/reviews`)
        .send({ rating: 5 });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation Error');
      
      // Restore original method
      Mentor.findByIdAndUpdate = originalFindByIdAndUpdate;
    });

    it('handles validation errors gracefully on sessions POST', async () => {
      const validId = new mongoose.Types.ObjectId();
      
      // Mock Mentor.findByIdAndUpdate to throw a validation error
      const originalFindByIdAndUpdate = Mentor.findByIdAndUpdate;
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      Mentor.findByIdAndUpdate = jest.fn().mockRejectedValue(validationError);
      
      const res = await request.post(`/api/mentors/${validId}/sessions`).send();
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation Error');
      
      // Restore original method
      Mentor.findByIdAndUpdate = originalFindByIdAndUpdate;
    });
  });

  describe('Method not allowed', () => {
    it('returns 405 for PUT /sessions', async () => {
      const mentor = await Mentor.create({
        name: 'Test Mentor',
        email: 'test@example.com',
        industry: 'Tech',
      });

      const res = await request.put(`/api/mentors/${mentor._id}/sessions`);
      expect(res.status).toBe(405);
      expect(res.body).toEqual({ message: 'Method Not Allowed' });
    });

    it('returns 405 for PUT /reviews', async () => {
      const mentor = await Mentor.create({
        name: 'Test Mentor', 
        email: 'test@example.com',
        industry: 'Tech',
      });

      const res = await request.put(`/api/mentors/${mentor._id}/reviews`);
      expect(res.status).toBe(405);
      expect(res.body).toEqual({ message: 'Method Not Allowed' });
    });

    it('returns 404 for unknown endpoints', async () => {
      const mentor = await Mentor.create({
        name: 'Test Mentor',
        email: 'test@example.com',
        industry: 'Tech',
      });

      const res = await request.get(`/api/mentors/${mentor._id}/unknown`);
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Not Found' });
    });
  });
});
