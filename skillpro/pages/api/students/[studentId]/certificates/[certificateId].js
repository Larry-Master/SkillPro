import connectDB from "@/lib/db";
import Certificate from "@/models/Certificate";
import Course from "@/models/Course";

export default async function handler(req, res) {
  await connectDB();
  const { studentId, certificateId } = req.query;

  if (req.method === "GET") {
    try {
      const certificate = await Certificate.findOne({
        _id: certificateId,
        student: studentId,
      }).populate("course");
      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }
      return res.status(200).json(certificate);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
