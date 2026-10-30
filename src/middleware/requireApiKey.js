const { timingSafeEqual } = require('node:crypto');
const AppError = require('../utils/AppError');
const { config } = require('../config/env');

function requireApiKey(req, res, next) {
  const suppliedKey = req.get('x-api-key');

  if (!config.apiKey) {
    return next(new AppError('API Key belum dikonfigurasi di server.', 503, 'API_KEY_NOT_CONFIGURED'));
  }

  if (typeof suppliedKey !== 'string') {
    return next(new AppError('Header x-api-key wajib disertakan.', 401, 'API_KEY_REQUIRED'));
  }

  const suppliedBuffer = Buffer.from(suppliedKey);
  const valid = [config.apiKey, config.apiKeyDemo].some((key) => {
    if (!key) return false;
    const expectedBuffer = Buffer.from(key);
    return expectedBuffer.length === suppliedBuffer.length
      && timingSafeEqual(expectedBuffer, suppliedBuffer);
  });

  if (!valid) {
    return next(new AppError('API Key tidak valid.', 403, 'INVALID_API_KEY'));
  }

  return next();
}

module.exports = requireApiKey;
