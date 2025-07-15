const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.ATLAS_MONGODB_URI || process.env.MONGODB_URI;

  if (!uri) throw new Error('No MongoDB URI provided to connectDB()');

  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected to', uri);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
