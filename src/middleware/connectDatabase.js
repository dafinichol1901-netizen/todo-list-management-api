const { connectDatabase } = require('../config/database');
const { assertRequiredEnvironment } = require('../config/env');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const connectDatabaseMiddleware = asyncHandler(async (req, res, next) => {
  try {
    assertRequiredEnvironment();
    await connectDatabase();
  } catch (error) {
    throw new AppError('Database belum siap menerima request.', 503, 'DATABASE_UNAVAILABLE');
  }

  next();
});

module.exports = connectDatabaseMiddleware;
