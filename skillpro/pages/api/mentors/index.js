import connectDB from '@/lib/db';
import Mentor from '@/models/Mentor';

export default async function handler(req, res) {
  // Database connection with error handling
  try {
    await connectDB();
  } catch (err) {
    console.error('🛑 DB connection error:', err);
    return res.status(500).json({ success: false, message: 'Database connection failed' });
  }

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
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
}
