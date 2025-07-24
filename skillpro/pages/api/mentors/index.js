// pages/api/mentors/index.js
const connectDB = require("../../../lib/db");
const Mentor = require("../../../models/Mentor");

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    // GET /api/mentors
    const mentors = await Mentor.find({});
    return res.status(200).json({ success: true, data: mentors });
  }

  if (req.method === "POST") {
    // POST /api/mentors
    try {
      const mentor = await Mentor.create(req.body);
      return res.status(201).json({ success: true, data: mentor });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
