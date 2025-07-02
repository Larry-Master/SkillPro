import dbConnect from '../../../lib/dbConnect';
import Mentor from '../../../models/Mentor';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const mentor = await Mentor.findById(id);
        if (!mentor) return res.status(404).json({ success: false });
        res.status(200).json({ success: true, data: mentor });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'PUT':
      try {
        const updated = await Mentor.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ success: false });
        res.status(200).json({ success: true, data: updated });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'DELETE':
      try {
        const deleted = await Mentor.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false });
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
