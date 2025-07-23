import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Professor from '@/models/Professor';

export default async function handler(req, res) {
  await connectDB();

  const { professorId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(professorId)) {
    return res.status(400).json({ message: 'Invalid professorId' });
  }

  try {
    if (req.method === 'GET') {
      const professor = await Professor.findById(professorId);
      if (!professor) return res.status(404).json({ message: 'Professor not found' });
      return res.status(200).json(professor);
    }

    if (req.method === 'PUT') {
      const updated = await Professor.findByIdAndUpdate(professorId, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updated) return res.status(404).json({ message: 'Professor not found' });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const deleted = await Professor.findByIdAndDelete(professorId);
      if (!deleted) return res.status(404).json({ message: 'Professor not found' });
      return res.status(200).json({ message: 'Professor deleted successfully' });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation Error', details: err.message });
    }
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
