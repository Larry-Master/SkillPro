// lib/db.js
const mongoose = require('mongoose');

// Changed: Added default DB name (skillpro) to the URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27018/';

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // New: Added to prevent deprecation warnings
      useCreateIndex: true,     // <-- (1) For model index support
      useFindAndModify: false   // <-- (2) Disables deprecated methods
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
