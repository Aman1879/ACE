const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);

const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 ACE Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
});

// Connect to MongoDB
connectDB().catch((err) => {
  console.warn(`⚠️ Running in offline DB mode: ${err.message}`);
  console.log(`ℹ️ To connect: start local MongoDB service or update MONGODB_URI in server/.env`);
});

module.exports = server;
