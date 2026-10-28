const { rateLimit } = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMITED',
      message: 'Terlalu banyak percobaan autentikasi. Coba lagi beberapa saat.',
    },
  },
});

const publicApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'PUBLIC_API_RATE_LIMITED',
      message: 'Batas request endpoint publik tercapai. Coba lagi nanti.',
    },
  },
});

module.exports = { authLimiter, publicApiLimiter };
