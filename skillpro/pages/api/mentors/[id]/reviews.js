const { connectDB } = require('../../../../lib/db');
const Mentor        = require('../../../../models/Mentor');

async function handler(req, res) {
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

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

module.exports = handler;
