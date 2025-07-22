import connectDB from '@/lib/db';
import Course from '@/models/Course';
import Student from '@/models/Student';
import Professor from '@/models/Professor';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    const courses = await Course.find().populate('professor enrolledStudents');
    return res.status(200).json(courses);
  }

  if (req.method === 'POST') {
    try {
      const { _id, title, description, professor, capacity } = req.body;

      const courseData = { title, description, professor, capacity };
      if (_id) courseData._id = _id;

      const course = await Course.create(courseData);

      return res.status(201).json(course);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
