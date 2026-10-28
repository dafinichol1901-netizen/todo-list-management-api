const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { config } = require('../config/env');
const { connectDatabase } = require('../config/database');
const { assertRequiredEnvironment } = require('../config/env');

const authenticate = asyncHandler(async (req, res, next) => {
  const authorization = req.get('authorization');
  const [scheme, token, extra] = authorization ? authorization.split(' ') : [];

  if (scheme !== 'Bearer' || !token || extra) {
    throw new AppError(
      'Token Bearer wajib disertakan.', 
      401, 
      'AUTHENTICATION_REQUIRED'
    );
  }

  try {
    assertRequiredEnvironment();
  } catch (error) {
    throw new AppError(
      'Konfigurasi autentikasi server belum lengkap.', 
      503, 
      'AUTHENTICATION_UNAVAILABLE'
    );
  }

  const payload = jwt.verify(token, config.jwtSecret);

  try {
    await connectDatabase();
  } catch (error) {
    throw new AppError(
      'Database belum siap memverifikasi akun.', 
      503, 
      'DATABASE_UNAVAILABLE'
    );
  }
  const user = await User.findOne({ _id: payload.sub, archived: false });
  if (!user) {
    throw new AppError(
      'Akun tidak ditemukan atau sudah dinonaktifkan.', 
      401, 
      'ACCOUNT_UNAVAILABLE'
    );
  }

  req.user = user;
  next();
});

module.exports = authenticate;
