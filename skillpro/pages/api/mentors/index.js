// pages/api/mentors/index.js
const connectDB = require('../../../lib/db');
const Mentor   = require('../../../models/Mentor');

async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const mentors = await Mentor.find({});
      return res.status(200).json(mentors);
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const doc = await Mentor.create(req.body);
      return res.status(201).json(doc);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // Method Not Allowed for other HTTP verbs
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
}

module.exports = handler;
// ensure default export for Next.js
module.exports.default = handler;
