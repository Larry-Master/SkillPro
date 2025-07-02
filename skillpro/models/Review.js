const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);
