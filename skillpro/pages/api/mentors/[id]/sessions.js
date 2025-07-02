// pages/api/mentors/[id]/sessions.js
import dbConnect from '../../../../lib/dbConnect';
import Mentor from '../../../../models/Mentor';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const mentor = await Mentor.findById(id).select('sessionsCompleted');
      if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found' });
      res.status(200).json({ success: true, data: { sessionsCompleted: mentor.sessionsCompleted } });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const mentor = await Mentor.findByIdAndUpdate(
        id,
        { $inc: { sessionsCompleted: 1 } },
        { new: true }
      );
      if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found' });
      res.status(200).json({ success: true, data: { sessionsCompleted: mentor.sessionsCompleted } });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
