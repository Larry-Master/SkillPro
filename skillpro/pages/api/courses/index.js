const connectDB = require("@/lib/db");
const Course = require("@/models/Course");
const Student = require("@/models/Student");
const Professor = require("@/models/Professor");
const mongoose = require("mongoose");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      try {
        await connectDB();
        const courses = await Course.find().populate("professor enrolledStudents");
        // Always return an array, even if empty
        return res.status(200).json(courses || []);
      } catch (dbError) {
        console.error("Database error:", dbError.message);
        // Return empty array instead of error object to prevent frontend crashes
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
        courseData.professor = professor; // only include valid professor (this only occur while creating a course without Professor)
      }

      const course = await Course.create(courseData);

      return res.status(201).json(course);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
