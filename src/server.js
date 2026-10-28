const app = require('./app');
const mongoose = require('mongoose');
const { config, assertRequiredEnvironment } = require('./config/env');
const { connectDatabase, disconnectDatabase } = require('./config/database');

async function startServer() {
  assertRequiredEnvironment();
  await connectDatabase();

  const server = app.listen(config.port, () => {
    console.log(`Todo List API berjalan di port ${config.port} (${config.nodeEnv}).`);
  });

  let isShuttingDown = false;
  const shutdown = (signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`${signal} diterima. Menutup server...`);
    server.close(async (error) => {
      try {
        await disconnectDatabase();
      } finally {
        process.exit(error ? 1 : 0);
      }
    });
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));

  return server;
}

if (require.main === module) {
  startServer().catch(async (error) => {
    console.error(`Server gagal dimulai: ${error.message}`);
    await mongoose.disconnect().catch(() => {});
    process.exitCode = 1;
  });
}

module.exports = app;
module.exports.startServer = startServer;
