// pages/api/mentors/[id].js
import connectDB from '@/lib/db';
import Mentor   from '@/models/Mentor';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('🛑 DB connection error:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Database connection failed' });
  }

  const { mentorId } = req.query;
  if (req.method === 'GET') {
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ success: false, message: 'Not found' });
    return res.status(200).json(mentor);
  }

  if (req.method === 'PUT') {
    try {
      const updated = await Mentor.findByIdAndUpdate(mentorId, req.body, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
      return res.status(200).json(updated);
    } catch (err) {
      console.error('🛑 Mentor.update error:', err);
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  if (req.method === 'DELETE') {
    const deleted = await Mentor.findByIdAndDelete(mentorId);
    if (!deleted) return res.status(404).json({ success: false, message: 'Not found' });
    return res.status(200).json({ success: true });
  }

  return res
    .status(405)
    .json({ success: false, message: 'Method Not Allowed' });
}
