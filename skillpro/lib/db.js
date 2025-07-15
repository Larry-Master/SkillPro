const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.ATLAS_MONGODB_URI || process.env.MONGODB_URI;

  if (!uri) throw new Error('No MongoDB URI provided to connectDB()');

  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(uri);
    const dbName = new URL(uri).pathname.replace('/', ''); // IMPORTANT TO NOT LEAK REAL MONGO CREDENTIALS
    console.log('✅ MongoDB connected to', dbName);

  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
