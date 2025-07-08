// models/Mentor.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const mentorSchema = new Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  industry:    { type: String, required: true },
  expertise:   [String],
  bio:         String,
  availability:{
    type: String,
    enum: ['part-time','full-time','flexible'],
    default: 'flexible'
  },
  rating:            { type: Number, default: 0 },
  sessionsCompleted: { type: Number, default: 0 },
  paymentRate:       { type: Number },
  createdAt:         { type: Date, default: Date.now }
});

// Avoid re-defining the model on hot reload
module.exports = mongoose.models.Mentor ||
                 mongoose.model('Mentor', mentorSchema);
