import connectDB from '@/lib/db';
import Student from '@/models/Student';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    const students = await Student.find().populate('enrolledCourses');
    return res.status(200).json(students);
  }

  if (req.method === 'POST') {
    try {
      const { name, email, enrolledCourses } = req.body;

      const student = await Student.create({
        name,
        email,
        enrolledCourses,
      });

      return res.status(201).json(student);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
