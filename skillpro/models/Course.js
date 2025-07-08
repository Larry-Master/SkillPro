const mongoose = require('mongoose');
const { Schema } = mongoose;

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  professor: { type: Schema.Types.ObjectId, ref: 'Professor', required: true },
  capacity: { type: Number, default: 0 },
  enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }]
  });

module.exports = mongoose.models.Course || mongoose.model('Course', CourseSchema);
