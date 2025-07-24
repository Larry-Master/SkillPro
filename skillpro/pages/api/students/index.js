import connectDB from "@/lib/db";
import Student from "@/models/Student";
import Course from "@/models/Course";

export default async function handler(req, res) {
  await connectDB();

  // GET /api/students - Get all students
  if (req.method === "GET") {
    try {
      const students = await Student.find().populate("enrolledCourses");
      return res.status(200).json(students);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST /api/students - Register a new student
  if (req.method === "POST") {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required." });
      }

      // Check if email already exists
      const existing = await Student.findOne({ email });
      if (existing) {
        return res.status(409).json({ error: "Email already registered." });
      }

      // Create student
      const student = await Student.create({
        name,
        email,
        enrolledCourses: [], // default empty
      });

      return res.status(201).json(student);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Method Not Allowed
  return res.status(405).json({ error: "Method Not Allowed" });
}
