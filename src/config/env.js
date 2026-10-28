const dotenv = require('dotenv');

dotenv.config({ quiet: true });

const splitList = (value) => value
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

const config = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number.parseInt(process.env.PORT || '3000', 10),
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  apiKey: process.env.API_KEY || '',
  bcryptSaltRounds: Number.parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  corsOrigins: splitList(process.env.CORS_ORIGINS || '*'),
});

function assertRequiredEnvironment() {
  const errors = [];

  if (!config.mongodbUri) {
    errors.push('MONGODB_URI wajib diisi.');
  }

  if (config.jwtSecret.length < 32 || config.jwtSecret.toLowerCase().includes('replace-with')) {
    errors.push('JWT_SECRET harus berupa secret acak dengan minimal 32 karakter.');
  }

  if (config.apiKey.length < 32 || config.apiKey.toLowerCase().includes('replace-with')) {
    errors.push('API_KEY harus berupa secret acak dengan minimal 32 karakter.');
  }

  if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) {
    errors.push('PORT harus berupa angka antara 1 dan 65535.');
  }

  if (!Number.isInteger(config.bcryptSaltRounds) || config.bcryptSaltRounds < 10 || config.bcryptSaltRounds > 15) {
    errors.push('BCRYPT_SALT_ROUNDS harus berupa angka antara 10 dan 15.');
  }

  if (errors.length > 0) {
    throw new Error(`Konfigurasi environment belum valid:\n- ${errors.join('\n- ')}`);
  }
}

module.exports = { config, assertRequiredEnvironment };
