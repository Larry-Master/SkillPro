const mongoose = require('mongoose');
const { Schema } = mongoose;

const StudentSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
});

module.exports = mongoose.model('Student', StudentSchema);
