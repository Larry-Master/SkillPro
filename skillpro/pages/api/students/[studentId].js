import connectDB from '@/lib/db';
import Student from '@/models/Student';

export default async function handler(req, res) {
  await connectDB();

  const { studentId } = req.query;
// View Students Profile
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

  //Update Students Profile

  if (req.method === 'PUT') {
  try {
    const { name, email } = req.body;
    const updated = await Student.findByIdAndUpdate(
      studentId,
      { name, email },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Student not found' });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

  return res.status(405).json({ message: 'Method Not Allowed' });
}
