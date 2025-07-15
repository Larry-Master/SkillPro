const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) throw new Error('No MongoDB URI provided to connectDB()');

  if (mongoose.connection.readyState > 0) {
    await mongoose.disconnect(); // clean previous connection
  }

  try {
    await mongoose.connect(uri);
    console.log(`✅ Connected to DB: ${uri.includes('mongodb+srv') ? 'Atlas' : 'Local'}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
