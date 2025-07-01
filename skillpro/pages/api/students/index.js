import connectDB from '@/lib/db';
import Course from '@/models/Course';
import Student from '@/models/Student';

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      if (id) {
        // Get a single student by id and populate enrolledCourses
        const student = await Student.findById(id).populate('enrolledCourses');
        if (!student) return res.status(404).json({ message: 'Student not found' });
        return res.status(200).json(student);
      } else {
        // Get all students and populate enrolledCourses
        const students = await Student.find().populate('enrolledCourses');
        return res.status(200).json(students);
      }
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
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

  if (req.method === 'PUT') {
    try {
      const student = await Student.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!student) return res.status(404).json({ message: 'Student not found' });

      return res.status(200).json(student);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const student = await Student.findByIdAndDelete(id);

      if (!student) return res.status(404).json({ message: 'Student not found' });

      return res.status(200).json({ message: 'Student deleted successfully' });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
