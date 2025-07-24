import connectDB from '@/lib/db';
import Mentor from '@/models/Mentor';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    const mentor = await Mentor.findById(id).select('rating');
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }
    return res.status(200).json({ success: true, data: { rating: mentor.rating } });
  }

  if (req.method === 'POST') {
    const { rating } = req.body;
    if (rating === undefined) {
      return res.status(400).json({ success: false, message: 'Rating is required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }
    const updated = await Mentor.findByIdAndUpdate(
      id,
      { $inc: { rating } },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }
    return res.status(200).json({ success: true, data: { rating: updated.rating } });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

module.exports = handler;
