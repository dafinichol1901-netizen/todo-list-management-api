const { query } = require('express-validator');
const { paginationValidators } = require('./listValidators');

const activityListValidators = [
  ...paginationValidators(['created_at', 'action']),
  query('action')
    .optional()
    .isIn(['TODO_CREATED', 'TODO_UPDATED', 'TODO_ARCHIVED'])
    .withMessage('action harus berupa jenis aktivitas todo yang valid.'),
];

const publicActivityValidators = [
  query('page').optional().isInt({ min: 1 }).withMessage('page harus positif.').toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit harus berada antara 1 dan 100.').toInt(),
  query('action')
    .optional()
    .isIn(['TODO_CREATED', 'TODO_UPDATED', 'TODO_ARCHIVED'])
    .withMessage('action harus berupa jenis aktivitas todo yang valid.'),
  query('after').optional().isISO8601().withMessage('after harus berupa tanggal ISO 8601.'),
];

module.exports = { activityListValidators, publicActivityValidators };
