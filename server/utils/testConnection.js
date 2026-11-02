require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ace_db';
  console.log('Testing connection to:', uri);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log('✅ MongoDB connection SUCCESSFUL');
    await mongoose.disconnect();
  } catch (err) {
    console.log('⚠️ Local MongoDB not reachable:', err.message);
    console.log('ℹ️ When ready, run `mongod` locally or provide a MongoDB Atlas URI in `server/.env`');
  }
}

testConnection();

