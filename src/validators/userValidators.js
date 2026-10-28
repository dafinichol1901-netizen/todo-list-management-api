const { body, param, query } = require('express-validator');

const userIdValidator = [param('id').isMongoId().withMessage('ID harus berupa ObjectId MongoDB yang valid.')];

const userListValidators = [
  query('page').optional().isInt({ min: 1 }).withMessage('page harus positif.').toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit harus berada antara 1 dan 100.').toInt(),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('search maksimal 100 karakter.'),
  query('role').optional().isIn(['user', 'admin']).withMessage('role harus user atau admin.'),
  query('sortBy').optional().isIn(['name', 'email', 'role', 'created_at']).withMessage('sortBy tidak didukung.'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('order harus asc atau desc.'),
];

const updateUserValidators = [
  body('name')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nama harus berisi 2 sampai 100 karakter.'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email harus valid.')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('role harus user atau admin.'),
];

module.exports = { userIdValidator, userListValidators, updateUserValidators };
