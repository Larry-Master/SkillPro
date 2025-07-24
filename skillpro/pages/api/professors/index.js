import connectDB from "@/lib/db";
import Professor from "@/models/Professor";

export default async function handler(req, res) {
  await connectDB();

  try {
    if (req.method === "GET") {
      const professors = await Professor.find({});
      return res.status(200).json(professors);
    }

    if (req.method === "POST") {
      const newProfessor = new Professor(req.body);
      await newProfessor.save();
      return res.status(201).json(newProfessor);
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
