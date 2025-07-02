import connectDB from '@/lib/db';
import Submission from '@/models/Submission';

export default async function handler(req, res) {
  await connectDB();
  const { studentId, assignmentId } = req.query;

  if (req.method === 'POST') {
    const { content } = req.body; 

    if (!content) {
      return res.status(400).json({ error: 'Submission content is required' });
    }

    try {
      const submission = await Submission.create({
        student: studentId,
        assignment: assignmentId,
        content,
        submittedAt: new Date()
      });

      return res.status(201).json(submission);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  return res.status(405).json({ message: 'Method Not Allowed' });
}
