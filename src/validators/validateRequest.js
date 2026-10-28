const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

function validateRequest(req, res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) return next();

  const details = result.array({ onlyFirstError: true }).map((item) => ({
    field: item.path,
    message: item.msg,
  }));

  return next(new AppError('Data request tidak valid.', 400, 'REQUEST_VALIDATION_ERROR', details));
}

module.exports = validateRequest;
