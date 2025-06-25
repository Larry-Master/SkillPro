const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProfessorSchema = new Schema({
  name: String,
  department: String,
});

module.exports = mongoose.model('Professor', ProfessorSchema);
