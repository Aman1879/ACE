const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongodInstance = null;

const connectDB = async () => {
  // 1. Try external MONGODB_URI (e.g. MongoDB Atlas or running local MongoDB)
  const envUri = process.env.MONGODB_URI;
  if (envUri && (envUri.startsWith('mongodb+srv://') || (!envUri.includes('localhost:27017') && !envUri.includes('127.0.0.1:27017')))) {
    try {
      console.log('📡 Connecting to MongoDB Atlas Cluster...');
      const conn = await mongoose.connect(envUri, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log(`✅ Connected to MongoDB Atlas: ${conn.connection.host}`);
      await seedOnConnect();
      return conn;
    } catch (err) {
      console.warn(`⚠️ MongoDB Atlas connection notice (${err.message}), falling back to embedded MongoDB...`);
    }
  }

  // 2. Try localhost MONGODB_URI if local service is already active
  try {
    const conn = await mongoose.connect(envUri || 'mongodb://127.0.0.1:27017/ace_db', {
      serverSelectionTimeoutMS: 1500,
    });
    console.log(`✅ Connected to Local MongoDB Service: ${conn.connection.host}`);
    await seedOnConnect();
    return conn;
  } catch (err) {
    // Local MongoDB service not active, fall through to MongoMemoryServer
  }

  // 3. Launch embedded MongoMemoryServer
  try {
    console.log('🔄 Initializing embedded In-Process MongoDB Server...');
    mongodInstance = await MongoMemoryServer.create({
      instance: {
        dbName: 'ace_db',
      },
    });
    const memoryUri = mongodInstance.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`✅ Embedded Real MongoDB Engine running at: ${memoryUri}`);
    await seedOnConnect();
    return conn;
  } catch (err) {
    console.error(`❌ Failed to start embedded MongoDB: ${err.message}`);
    throw err;
  }
};

const seedOnConnect = async () => {
  try {
    const { seedInitialData } = require('../utils/seed');
    if (typeof seedInitialData === 'function') {
      await seedInitialData();
    }
  } catch (seedErr) {
    console.warn('Seed notice:', seedErr.message);
  }
};

module.exports = connectDB;
