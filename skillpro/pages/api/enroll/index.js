import connectDB from '@/lib/db';
import enrollStudent from '@/lib/enrollService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await connectDB();

  const { studentId, courseId } = req.body;

  try {
    const result = await enrollStudent(studentId, courseId);
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
