import connectDB from "@/lib/db";
import Student from "@/models/Student";

export default async function handler(req, res) {
  await connectDB();
  const { studentId } = req.query;

  if (req.method === "POST") {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: "courseId is required" });
    }

    try {
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      if (!student.enrolledCourses.includes(courseId)) {
        student.enrolledCourses.push(courseId);
        await student.save();
      }

      return res.status(200).json(student);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
