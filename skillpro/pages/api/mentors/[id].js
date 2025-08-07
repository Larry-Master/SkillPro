// pages/api/mentors/[id].js
const { connectDB } = require('../../../../lib/db');
const Mentor = require('../../../../models/Mentor');

async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    const mentor = await Mentor.findById(id);
    if (!mentor) return res.status(404).json({ success: false, message: 'Not found' });
    return res.status(200).json(mentor);
  }

  if (req.method === 'PUT') {
    try {
      const updated = await Mentor.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
      return res.status(200).json(updated);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  if (req.method === 'DELETE') {
    const deleted = await Mentor.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Not found' });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

module.exports = handler;
