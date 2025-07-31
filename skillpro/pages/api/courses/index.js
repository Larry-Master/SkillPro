const connectDB = require("@/lib/db");
const Course = require("@/models/Course");
const Student = require("@/models/Student");
const Professor = require("@/models/Professor");
const mongoose = require("mongoose");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // First try to connect to DB and get real data
      try {
        await connectDB();
        const courses = await Course.find().populate("professor enrolledStudents");
        
        if (courses && courses.length > 0) {
          return res.status(200).json(courses);
        }
      } catch (dbError) {
        console.log("Database error, using fallback data:", dbError.message);
      }
      
      // Fallback sample data if DB is empty or not connected
      const sampleCourses = [
        {
          _id: "sample1",
          title: "Introduction to Web Development",
          description: "Learn the fundamentals of HTML, CSS, and JavaScript",
          capacity: 30,
          professor: { name: "Dr. Sarah Miller", department: "Computer Science" },
          enrolledStudents: []
        },
        {
          _id: "sample2", 
          title: "React.js Fundamentals",
          description: "Build modern web applications with React",
          capacity: 25,
          professor: { name: "Prof. John Smith", department: "Software Engineering" },
          enrolledStudents: []
        },
        {
          _id: "sample3",
          title: "Node.js Backend Development", 
          description: "Create robust server-side applications",
          capacity: 20,
          professor: { name: "Dr. Emily Johnson", department: "Web Technologies" },
          enrolledStudents: []
        },
        {
          _id: "sample4",
          title: "Database Design & SQL",
          description: "Master database concepts and SQL queries",
          capacity: 35,
          professor: { name: "Prof. Michael Brown", department: "Data Science" },
          enrolledStudents: []
        }
      ];
      
      return res.status(200).json(sampleCourses);
    }

  if (req.method === "POST") {
    try {
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
