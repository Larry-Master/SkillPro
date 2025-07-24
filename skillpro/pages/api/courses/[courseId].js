import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Course from "@/models/Course";

export default async function handler(req, res) {
  await connectDB();

  const { courseId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: "Invalid courseId" });
  }

  try {
    if (req.method === "GET") {
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });
      return res.status(200).json(course);
    }

    if (req.method === "PUT") {
      const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedCourse)
        return res.status(404).json({ message: "Course not found" });
      return res.status(200).json(updatedCourse);
    }

    if (req.method === "DELETE") {
      const deleted = await Course.findByIdAndDelete(courseId);
      if (!deleted)
        return res.status(404).json({ message: "Course not found" });
      return res.status(200).json({ message: "Course deleted successfully" });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation Error", details: err.message });
    }
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
}
