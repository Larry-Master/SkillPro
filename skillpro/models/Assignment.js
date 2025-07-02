const mongoose = require('mongoose');
const { Schema } = mongoose;

const AssignmentSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  dueDate: Date,
});

module.exports = mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);
