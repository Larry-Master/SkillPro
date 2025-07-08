// pages/api/mentors/[id]/reviews.js
const connectDB = require('../../../../lib/db');
const Mentor   = require('../../../../models/Mentor');


export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    // GET /api/mentors/:id/reviews
    const { rating } = await Mentor.findById(id).select('rating');
    return res.status(200).json({ success: true, data: { rating } });
  }

  if (req.method === 'POST') {
    // POST /api/mentors/:id/reviews  → add to rating
    const { rating: delta } = req.body;
    const mentor = await Mentor.findByIdAndUpdate(
      id,
      { $inc: { rating: delta } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      data: { rating: mentor.rating }
    });
  }

  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
