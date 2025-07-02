import dbConnect from '../../../../lib/db';
import Review from '../../../../models/Review';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const reviews = await Review.find({ course: id })
        .populate('student', 'name email') // 👈 Populate student info
        .populate('course', 'title');      // 👈 Optionally include course title
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { student, content, rating } = req.body;
      const newReview = new Review({ course: id, student, content, rating });
      await newReview.save();
      res.status(201).json(newReview);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create review' });
    }
  }
}
