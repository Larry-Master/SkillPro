// pages/api/mentors/[id]/reviews.js
const { connectDB } = require('../../../../lib/db');
const Mentor = require('../../../../models/Mentor');

async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    const mentor = await Mentor.findById(id).select('rating');
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }
    return res.status(200).json({
      success: true,
      data: { rating: mentor.rating }
    });
  }

  if (req.method === 'POST') {
    const { rating: delta } = req.body;
    const mentor = await Mentor.findByIdAndUpdate(
      id,
      { $inc: { rating: delta } },
      { new: true }
    );
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }
    return res.status(200).json({
      success: true,
      data: { rating: mentor.rating }
    });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

module.exports = handler;
