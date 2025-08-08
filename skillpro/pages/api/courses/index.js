import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Student from "@/models/Student";
import Professor from "@/models/Professor";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectDB();
      const courses = await Course.find().populate("professor enrolledStudents");
      return res.status(200).json(courses);
    } catch (dbError) {
      console.error("Database error:", dbError.message);
      return res.status(200).json([]);
    }
  }

  if (req.method === "POST") {
    try {
      await connectDB();
      const { _id, title, description, professor, capacity } = req.body;

      const courseData = { title, description, capacity };
      if (_id) courseData._id = _id;

      if (professor && mongoose.Types.ObjectId.isValid(professor)) {
        courseData.professor = professor;
      }

      const course = await Course.create(courseData);
      return res.status(201).json(course);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
