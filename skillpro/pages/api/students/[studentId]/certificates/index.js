import connectDB from '@/lib/db';
import Certificate from '@/models/Certificate';
import Course from '@/models/Course'; 

export default async function handler(req, res) {
  await connectDB();

  const { studentId } = req.query;

  try {
    if (req.method === 'GET') {
      // Get all certificates for a student, possibly populating course
      const certificates = await Certificate.find({ student: studentId }).populate('course');
      return res.status(200).json(certificates);
    }

    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
