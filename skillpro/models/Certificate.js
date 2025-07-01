const mongoose = require('mongoose');
const { Schema } = mongoose;

const CertificateSchema = new Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  date: { type: Date, default: Date.now }
});

export default mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
