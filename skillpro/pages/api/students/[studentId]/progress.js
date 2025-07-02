import connectDB from '@/lib/db';
import Student from '@/models/Student';

export default async function handler(req, res) {
  await connectDB();
  const { studentId } = req.query;

  if (req.method === 'GET') {
    try {
      const student = await Student.findById(studentId).populate('enrolledCourses');
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      //Progress Logic
      const totalCourses = student.enrolledCourses.length;
      // 60% is done for demo
      const progress = totalCourses > 0 ? 60 : 0;

      return res.status(200).json({
        progress: `${progress}%`,
        totalCourses,
        
        enrolledCourses: student.enrolledCourses,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}