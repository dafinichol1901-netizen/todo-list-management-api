const AppError = require('../utils/AppError');

function authorize(...allowedRoles) {
  return function roleGuard(req, res, next) {
    if (!req.user) {
      return next(new AppError(
        'Login diperlukan untuk mengakses resource ini.', 
        401, 
        'AUTHENTICATION_REQUIRED'
      ));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(
        'Kamu tidak memiliki izin untuk melakukan tindakan ini.', 
        403, 
        'FORBIDDEN'
      ));
    }

    return next();
  };
}

module.exports = authorize;
