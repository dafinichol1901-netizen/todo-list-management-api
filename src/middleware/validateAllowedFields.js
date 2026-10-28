const AppError = require('../utils/AppError');

function validateAllowedFields(allowedFields, { requireAtLeastOne = false } = {}) {
  const allowlist = new Set(allowedFields);

  return function allowedFieldsGuard(req, res, next) {
    const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body)
      ? req.body
      : {};
    const unknownFields = Object.keys(body).filter((field) => !allowlist.has(field));

    if (unknownFields.length > 0) {
      return next(new AppError(
        'Request berisi field yang tidak diizinkan.',
        400,
        'UNKNOWN_FIELDS',
        { fields: unknownFields },
      ));
    }

    if (requireAtLeastOne && !Object.keys(body).some((field) => allowlist.has(field))) {
      return next(new AppError('Minimal satu field yang diizinkan harus dikirim.', 400, 'EMPTY_UPDATE'));
    }

    return next();
  };
}

module.exports = validateAllowedFields;
