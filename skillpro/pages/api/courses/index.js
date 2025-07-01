import connectDB from '@/lib/db';
import Course from '@/models/Course';
import Professor from '@/models/Professor';
import Student from '@/models/Student';

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  if (req.method === 'GET') {
    const courses = await Course.find().populate('professor enrolledStudents');
    return res.status(200).json(courses);
  }

  if (req.method === 'POST') {
  try {
    const { _id, title, description, professor, capacity } = req.body;

    const courseData = {
      title,
      description,
      professor,
      capacity,
    };

    if (_id) {
      courseData._id = _id;  // assign fixed _id if provided
    }

    const course = await Course.create(courseData);

    return res.status(201).json(course);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}


  if (req.method === 'PUT') {
    try {
      const course = await Course.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!course) return res.status(404).json({ message: 'Course not found' });

      return res.status(200).json(course);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const course = await Course.findByIdAndDelete(id);

      if (!course) return res.status(404).json({ message: 'Course not found' });

      return res.status(200).json({ message: 'Course deleted successfully' });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
