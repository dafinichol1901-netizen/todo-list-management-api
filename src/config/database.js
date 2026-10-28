const mongoose = require('mongoose');
const { config } = require('./env');

let connectionPromise;

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose.connect(config.mongodbUri, {
    autoIndex: config.nodeEnv !== 'production',
    serverSelectionTimeoutMS: 10000,
  });

  try {
    await connectionPromise;
    return mongoose.connection;
  } catch (error) {
    connectionPromise = undefined;
    throw error;
  }
}

async function disconnectDatabase() {
  connectionPromise = undefined;
  await mongoose.disconnect();
}

module.exports = { connectDatabase, disconnectDatabase };
