const { body, param, query } = require('express-validator');

const createTodoValidator = [
  body('title')
    .isString()
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage('Judul todo harus berisi 1 sampai 120 karakter.'),
  body('description')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Deskripsi todo maksimal 2000 karakter.'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('completed harus berupa boolean.')
    .toBoolean(),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('priority harus low, medium, atau high.'),
  body('due_date')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('due_date harus berupa tanggal ISO 8601.'),
  body('category')
    .optional({ nullable: true })
    .isMongoId()
    .withMessage('category harus berisi ID kategori yang valid.'),
];

const updateTodoValidator = [
  body('title')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage('Judul todo harus berisi 1 sampai 120 karakter.'),
  body('description')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Deskripsi todo maksimal 2000 karakter.'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('completed harus berupa boolean.')
    .toBoolean(),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('priority harus low, medium, atau high.'),
  body('due_date')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('due_date harus berupa tanggal ISO 8601.'),
  body('category')
    .optional({ nullable: true })
    .isMongoId()
    .withMessage('category harus berisi ID kategori yang valid.'),
];

const listTodoValidators = [
  query('completed')
    .optional()
    .isBoolean()
    .withMessage('completed harus berupa true atau false.')
    .toBoolean(),
  query('category')
    .optional()
    .isMongoId()
    .withMessage('category harus berupa ID kategori yang valid.'),
];

const idParamValidator = [param('id').isMongoId().withMessage('ID harus berupa ObjectId MongoDB yang valid.')];

module.exports = { createTodoValidator, updateTodoValidator, listTodoValidators, idParamValidator };
