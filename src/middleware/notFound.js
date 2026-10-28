const AppError = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError(`Rute 
    ${req.method} 
    ${req.originalUrl} tidak ditemukan.`, 404, 'ROUTE_NOT_FOUND'));
}

module.exports = notFound;
