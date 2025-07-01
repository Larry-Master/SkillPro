import connectDB from '@/lib/db';
import Certificate from '@/models/Certificate';

export default async function handler(req, res) {
  await connectDB();
  const { studentId } = req.query;

  if (req.method === 'GET') {
    try {
      const certificates = await Certificate.find({ student: studentId })
        .populate('course')
        .populate('path');
      return res.status(200).json({ certificates });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
