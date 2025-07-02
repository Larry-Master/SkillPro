import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  industry: { type: String, required: true },
  expertise: [String],
  bio: String,
  availability: {
    type: String,
    enum: ['part-time', 'full-time', 'flexible'],
    default: 'flexible'
  },
  rating: { type: Number, default: 0 },
  sessionsCompleted: { type: Number, default: 0 },
  paymentRate: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Mentor || mongoose.model('Mentor', mentorSchema);
