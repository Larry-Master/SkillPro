import mongoose from "mongoose";
import connectDB from '@/lib/db';
import Mentor from '@/models/Mentor';

export default async function handler(req, res) {
  await connectDB();

  const { mentorId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(mentorId)) {
    return res.status(400).json({ message: "Invalid mentorId" });
  }

  try {
    if (req.method === 'GET') {
      const mentor = await Mentor.findById(mentorId);
      if (!mentor) return res.status(404).json({ message: 'Mentor not found' });
      return res.status(200).json({ sessionsCompleted: mentor.sessionsCompleted || 0 });
    }

    if (req.method === 'POST') {
      const updated = await Mentor.findByIdAndUpdate(
        mentorId,
        { $inc: { sessionsCompleted: 1 } },
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: 'Mentor not found' });
      return res.status(200).json({ sessionsCompleted: updated.sessionsCompleted });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation Error", details: err.message });
    }
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
}
