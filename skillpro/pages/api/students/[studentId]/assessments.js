import connectDB from "@/lib/db";
import Assessment from "@/models/Assessment";

export default async function handler(req, res) {
  await connectDB();
  const { studentId } = req.query;

  // Create new assessment
  if (req.method === "POST") {
    try {
      const { answers } = req.body;

      const result = "Frontend Developer";

      const assessment = await Assessment.create({
        student: studentId,
        answers,
        result,
        date: new Date(),
      });

      return res.status(201).json(assessment);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
