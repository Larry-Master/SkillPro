import connectDB from '@/lib/db';
import Mentor from '@/models/Mentor';

export default async function handler(req, res) {
  await connectDB();
  const { mentorId } = req.query;

  if (req.method === 'GET') {
    const mentor = await Mentor.findById(mentorId).select('rating');
    if (!mentor) return res.status(404).json({ success: false, message: 'Not found' });
    return res.status(200).json({ success: true, data: { rating: mentor.rating } });
  }

  if (req.method === 'POST') {
    const { rating } = req.body;
    const updated = await Mentor.findByIdAndUpdate(
      mentorId,
      { $inc: { rating } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
    return res.status(200).json({ success: true, data: { rating: updated.rating } });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
