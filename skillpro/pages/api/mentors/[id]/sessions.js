import { connectDB } from '../../../../lib/db';
import Mentor from '../../../../models/Mentor';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    const mentor = await Mentor.findById(id).select('sessionsCompleted');
    if (!mentor) return res.status(404).json({ success: false, message: 'Not found' });
    return res.status(200).json({ success: true, data: { sessionsCompleted: mentor.sessionsCompleted } });
  }

  if (req.method === 'POST') {
    const updated = await Mentor.findByIdAndUpdate(
      id,
      { $inc: { sessionsCompleted: 1 } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
    return res.status(200).json({ success: true, data: { sessionsCompleted: updated.sessionsCompleted } });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

