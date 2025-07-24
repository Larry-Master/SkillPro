const mongoose = require("mongoose");
const { Schema } = mongoose;

const AssessmentSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  answers: [{ question: String, answer: String }],
  result: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.Assessment || mongoose.model("Assessment", AssessmentSchema);
