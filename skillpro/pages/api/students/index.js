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

  //Registration
  if (req.method === 'POST') {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
      }

      //Check if user already exists
      const existing = await Student.findOne({ email });
      if (existing) {
        return res.status(409).json({ error: 'Email already registered.' });
      }

      const student = await Student.create({
        name,
        email,
        enrolledCourses: [], // Default on registration
      });

      return res.status(201).json(student);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }


  
  return res.status(405).json({ message: 'Method Not Allowed' });
}
