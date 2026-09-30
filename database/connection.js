const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });

let isConnected = false;
let memoryServer = null;

const connectDB = async (customUri) => {
  if (isConnected) {
    return mongoose.connection;
  }

  const primaryUri = customUri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/salon_appointment_db';

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[Database] Warning: Could not connect to primary MongoDB at ${primaryUri}`);
    console.warn(`[Database] Error message: ${err.message}`);

    // If local MongoDB is not running, provide automatic in-memory fallback for smooth demonstration
    try {
      console.log('[Database] Attempting in-memory MongoDB fallback for local testing/college demo...');
      let MongoMemoryServer;
      try {
        MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
      } catch (e1) {
        MongoMemoryServer = require('../backend/node_modules/mongodb-memory-server').MongoMemoryServer;
      }
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      isConnected = true;
      console.log(`[Database] Connected to In-Memory MongoDB at: ${memUri}`);
      return conn;
    } catch (fallbackErr) {
      console.error('[Database] Failed to connect to MongoDB and fallback unavailable:', fallbackErr.message);
      console.error('[Database] Please ensure MongoDB is running or specify MONGODB_URI in backend/.env');
      throw err;
    }
  }
};

const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
    isConnected = false;
    console.log('[Database] MongoDB disconnected.');
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
