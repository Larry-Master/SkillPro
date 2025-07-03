// pages/api/mentors/[id].js
const connectDB = require('../../../lib/db');
const Mentor   = require('../../../models/Mentor');


export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    // GET /api/mentors/:id
    const mentor = await Mentor.findById(id);
    if (!mentor) return res.status(404).json({ success: false, error: 'Not found' });
    return res.status(200).json({ success: true, data: mentor });
  }

  if (req.method === 'PUT') {
    // PUT /api/mentors/:id
    try {
      const updated = await Mentor.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      });
      if (!updated) throw new Error('Not found');
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    // DELETE /api/mentors/:id
    await Mentor.findByIdAndDelete(id);
    return res.status(200).json({ success: true, data: {} });
  }

  res.setHeader('Allow', ['GET','PUT','DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
