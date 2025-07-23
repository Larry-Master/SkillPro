const mongoose = require('mongoose');
const { Schema } = mongoose;

const EnrollmentSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.models.Enrollment ||mongoose.model('Enrollment', EnrollmentSchema);
