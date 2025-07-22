const mongoose = require('mongoose');
const { Schema } = mongoose;

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  professor: { type: Schema.Types.ObjectId, ref: 'Professor' },
  capacity: {
    type: Number,
    required: true,
    min: [0, 'Capacity cannot be negative'],
  },
  enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }]
});


module.exports = mongoose.models.Course || mongoose.model('Course', CourseSchema);
