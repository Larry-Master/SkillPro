const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubmissionSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  content: { type: String },
  submittedAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
