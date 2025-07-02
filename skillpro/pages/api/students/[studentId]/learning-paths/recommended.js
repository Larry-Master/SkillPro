import connectDB from '@/lib/db';
import Assessment from '@/models/Assessment';

export default async function handler(req, res) {
  await connectDB();
  const { studentId } = req.query;

  if (req.method === 'GET') {
    try {
      // Find latest assessment for the student
      const latest = await Assessment.findOne({ student: studentId }).sort({ date: -1 });
      if (!latest) {
        return res.status(404).json({ error: 'No assessment found' });
      }
      return res.status(200).json({ recommended: latest.result });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
