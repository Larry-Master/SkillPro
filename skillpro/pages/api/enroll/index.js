import connectDB from '@/lib/db';
import Student from '@/models/Student';
import Course from '@/models/Course';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await connectDB();

  const { studentId, courseId } = req.body;

  if (!studentId || !courseId) {
    return res.status(400).json({ message: 'Missing studentId or courseId' });
  }

  try {
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      return res.status(404).json({ message: 'Student or Course not found' });
    }

    // Check if student already enrolled in course
    if (student.enrolledCourses.includes(courseId)) {
      return res.status(409).json({ message: 'Student is already enrolled in this course' });
    }

    // Add course to student's enrolledCourses
    student.enrolledCourses.push(courseId);
    await student.save();

    // Add student to course's enrolledStudents
    course.enrolledStudents.push(studentId);
    await course.save();

    return res.status(200).json({ message: 'Enrollment successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
