// pages/api/mentors/[id]/sessions.js
const { connectDB } = require("../../../../lib/db");
const Mentor = require("../../../../models/Mentor");

async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const mentor = await Mentor.findById(id).select("sessionsCompleted");
    if (!mentor) {
      return res
        .status(404)
        .json({ success: false, message: "Mentor not found" });
    }
    return res.status(200).json({
      success: true,
      data: { sessionsCompleted: mentor.sessionsCompleted },
    });
  }

  if (req.method === "POST") {
    const mentor = await Mentor.findByIdAndUpdate(
      id,
      { $inc: { sessionsCompleted: 1 } },
      { new: true },
    );
    if (!mentor) {
      return res
        .status(404)
        .json({ success: false, message: "Mentor not found" });
    }
    return res.status(200).json({
      success: true,
      data: { sessionsCompleted: mentor.sessionsCompleted },
    });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

module.exports = handler;
