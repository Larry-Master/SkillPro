const mongoose = require('mongoose');
const { Schema } = mongoose;

const CourseSchema = new Schema({
  title: String,
  description: String,
  professor: { type: Schema.Types.ObjectId, ref: 'Professor' },
  capacity: Number,
  enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }]
});

module.exports = mongoose.model('Course', CourseSchema);
