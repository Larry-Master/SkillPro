// pages/api/mentors/index.js
import connectDB from '../../../lib/db';
import Mentor   from '../../../models/Mentor';

export default async function handler(req, res) {
  // 1) DB connect with error handling
  try {
    await connectDB();
  } catch (err) {
    console.error('🛑 DB connection error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Database connection failed' });
  }

  // 2) CRUD methods
  if (req.method === 'GET') {
    try {
      const mentors = await Mentor.find({});
      return res.status(200).json(mentors);
    } catch (err) {
      console.error('🛑 Mentor.find error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const doc = await Mentor.create(req.body);
      return res.status(201).json(doc);
    } catch (err) {
      console.error('🛑 Mentor.create error:', err);
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // 3) Method not allowed
  res.setHeader('Allow', ['GET','POST']);
  return res
    .status(405)
    .json({ success: false, message: `Method ${req.method} Not Allowed` });
}
