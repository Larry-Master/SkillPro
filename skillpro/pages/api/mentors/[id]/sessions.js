// pages/api/mentors/[id]/sessions.js
const connectDB = require('../../../../lib/db');
const Mentor   = require('../../../../models/Mentor');


export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    // GET /api/mentors/:id/sessions
    const { sessionsCompleted } = await Mentor.findById(id).select('sessionsCompleted');
    return res.status(200).json({ success: true, data: { sessionsCompleted } });
  }

  if (req.method === 'POST') {
    // POST /api/mentors/:id/sessions  → increment count
    const mentor = await Mentor.findByIdAndUpdate(
      id,
      { $inc: { sessionsCompleted: 1 } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      data: { sessionsCompleted: mentor.sessionsCompleted }
    });
  }

  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
