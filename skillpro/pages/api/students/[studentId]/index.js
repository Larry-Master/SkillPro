import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Student from "@/models/Student";
import Course from "@/models/Course";

export default async function handler(req, res) {
  await connectDB();
  const { studentId } = req.query;

  // Validate studentId as ObjectId
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ error: "Invalid student ID" });
  }

  if (req.method === "GET") {
    // View student's profile
    try {
      const student =
        await Student.findById(studentId).populate("enrolledCourses");
      if (!student)
        return res.status(404).json({ message: "Student not found" });
      return res.status(200).json(student);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "PUT") {
    // Update student's profile
    try {
      const { name, email, enrolledCourses } = req.body;
      const updated = await Student.findByIdAndUpdate(
        studentId,
        { name, email, enrolledCourses },
        { new: true, runValidators: true },
      );
      if (!updated)
        return res.status(404).json({ message: "Student not found" });
      return res.status(200).json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "DELETE") {
    // Delete student
    try {
      const student = await Student.findByIdAndDelete(studentId);
      if (!student)
        return res.status(404).json({ message: "Student not found" });
      return res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: "Method Not Allowed" });
}
