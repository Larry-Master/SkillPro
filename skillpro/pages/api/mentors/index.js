// pages/api/mentors/index.js
import { withApiHandler, ApiErrors } from '@/lib/apiHelpers';
import Mentor from '@/models/Mentor';

async function handler(req, res) {
  // GET /api/mentors - Get all mentors
  if (req.method === 'GET') {
    try {
      const mentors = await Mentor.find({});
      return res.status(200).json(mentors);
    } catch (err) {
      console.error('🛑 Mentor.find error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // POST /api/mentors - Create new mentor
  if (req.method === 'POST') {
    try {
      const mentor = await Mentor.create(req.body);
      return res.status(201).json(mentor);
    } catch (err) {
      console.error('🛑 Mentor.create error:', err);
      return ApiErrors.validationError(res, err);
    }
  }

  return ApiErrors.methodNotAllowed(req, res, ['GET', 'POST']);
}

export default withApiHandler(handler);
