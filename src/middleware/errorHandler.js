function normalizeError(error) {
  if (error.type === 'entity.parse.failed') {
    return { statusCode: 400, code: 'MALFORMED_JSON', message: 'Body request bukan JSON yang valid.' };
  }

  if (error.type === 'entity.too.large') {
    return { statusCode: 413, code: 'PAYLOAD_TOO_LARGE', message: 'Ukuran body request melebihi batas.' };
  }

  if (error.name === 'ValidationError') {
    return {
      statusCode: 422,
      code: 'VALIDATION_ERROR',
      message: 'Data tidak memenuhi aturan validasi.',
      details: Object.values(error.errors || {}).map((item) => ({
        field: item.path,
        message: item.message,
      })),
    };
  }

  if (error.name === 'CastError') {
    return { statusCode: 400, code: 'INVALID_ID', message: 'Format ID tidak valid.' };
  }

  if (error.code === 11000) {
    const fields = Object.keys(error.keyPattern || {});
    return {
      statusCode: 409,
      code: 'DUPLICATE_RESOURCE',
      message: 'Data dengan nilai unik tersebut sudah tersedia.',
      details: fields.length ? { fields } : undefined,
    };
  }

  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return { 
      statusCode: 401, code: 'INVALID_TOKEN', 
      message: 'Token tidak valid atau sudah kedaluwarsa.' };
  }

  return {
    statusCode: error.statusCode || error.status || 500,
    code: error.code || 'INTERNAL_SERVER_ERROR',
    message: error.message || 'Terjadi kesalahan pada server.',
    details: error.details,
  };
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const normalized = normalizeError(error);
  const isProduction = process.env.NODE_ENV === 'production';
  const message = isProduction && normalized.statusCode >= 500
    ? 'Terjadi kesalahan pada server.'
    : normalized.message;

  if (normalized.statusCode >= 500 && !error.isOperational) {
    console.error(error);
  }

  return res.status(normalized.statusCode).json({
    success: false,
    error: {
      code: normalized.code,
      message,
      ...(normalized.details ? { details: normalized.details } : {}),
    },
  });
}

module.exports = errorHandler;
