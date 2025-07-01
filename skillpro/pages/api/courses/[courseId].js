import connectDB from '@/lib/db';
import Course from '@/models/Course';

export default async function handler(req, res) {
  await connectDB();

  const { courseId } = req.query;  

  if (req.method === 'GET') {
    const course = await Course.findById(courseId).populate('professor enrolledStudents');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    return res.status(200).json(course);
  }

  if (req.method === 'PUT') {
    try {
      const course = await Course.findByIdAndUpdate(courseId, req.body, {
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
      const course = await Course.findByIdAndDelete(courseId);
      if (!course) return res.status(404).json({ message: 'Course not found' });
      return res.status(200).json({ message: 'Course deleted successfully' });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
