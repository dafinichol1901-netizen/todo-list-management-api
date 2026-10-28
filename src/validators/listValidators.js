const { query } = require('express-validator');

function paginationValidators(sortFields) {
  return [
    query('page').optional().isInt({ min: 1 }).withMessage('page harus berupa bilangan bulat positif.').toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit harus berada antara 1 dan 100.').toInt(),
    query('sortBy').optional().isIn(sortFields).withMessage(`sortBy harus salah satu dari: ${sortFields.join(', ')}.`),
    query('order').optional().isIn(['asc', 'desc']).withMessage('order harus asc atau desc.'),
    query('search').optional().trim().isLength({ max: 100 }).withMessage('search maksimal 100 karakter.'),
  ];
}

module.exports = { paginationValidators };
