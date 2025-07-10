const mongoose = require('mongoose');

const MONGODB_URI = process.env.NODE_ENV === 'production'
    ? process.env.ATLAS_MONGODB_URI
    : process.env.MONGODB_URI; //testing 

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected to', MONGODB_URI);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
