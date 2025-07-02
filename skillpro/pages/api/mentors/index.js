import dbConnect from '../../../lib/dbConnect';
import Mentor from '../../../models/Mentor';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const mentors = await Mentor.find({});
        res.status(200).json({ success: true, data: mentors });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const mentor = await Mentor.create(req.body);
        res.status(201).json({ success: true, data: mentor });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
