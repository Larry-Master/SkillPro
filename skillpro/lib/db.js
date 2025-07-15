const mongoose = require('mongoose');

const MONGODB_URI =  process.env.ATLAS_MONGODB_URI || process.env.MONGODB_URI ;

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(ATLAS_MONGODB_URI);
    console.log('✅ MongoDB connected to', ATLAS_MONGODB_URI);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
