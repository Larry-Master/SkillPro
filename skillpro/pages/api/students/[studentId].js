import connectDB from '@/lib/db';
import Student from '@/models/Student';

export default async function handler(req, res) {
  await connectDB();

  const { studentId } = req.query;

  if (req.method === 'GET') {
    const student = await Student.findById(studentId).populate('enrolledCourses');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    return res.status(200).json(student);
  }

  if (req.method === 'PUT') {
    const student = await Student.findByIdAndUpdate(studentId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    return res.status(200).json(student);
  }

  if (req.method === 'DELETE') {
    const student = await Student.findByIdAndDelete(studentId); 
    if (!student) return res.status(404).json({ message: 'Student not found' });
    return res.status(200).json({ message: 'Student deleted successfully' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
