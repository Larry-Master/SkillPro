const mongoose = require('mongoose');
const connectDB = require('../../../lib/db');
const Course = require('../../../models/Course');

module.exports.config = {
  api: {
    bodyParser: false,
  },
};

async function parseJSON(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function handler(req, res) {
  await connectDB();

  try {
    const { courseId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid courseId' });
    }

    if (req.method === 'GET') {
      const course = await Course.findById(courseId).populate('professor enrolledStudents');
      if (!course) return res.status(404).json({ message: 'Course not found' });
      return res.status(200).json(course);
    }

    if (req.method === 'PUT') {
      let body;
      try {
        body = await parseJSON(req);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid JSON' });
      }

      try {
       const course = await Course.findByIdAndUpdate(courseId, body, {
         new: true,
         runValidators: true,
       });
       if (!course) return res.status(404).json({ message: 'Course not found' });
       return res.status(200).json(course);
     } catch (err) {
       return res.status(400).json({ error: err.message });
     }
   }

    if (req.method === 'DELETE') {
      const course = await Course.findByIdAndDelete(courseId);
      if (!course) return res.status(404).json({ message: 'Course not found' });
      return res.status(200).json({ message: 'Course deleted successfully' });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });

  } catch (err) {
    // Catch any unexpected errors here
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

module.exports = handler;
