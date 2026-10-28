const { body, param } = require('express-validator');

const createCategoryValidator = [
  body('name')
    .isString()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Nama kategori harus berisi 2 sampai 60 karakter.'),
  body('description')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Deskripsi kategori maksimal 500 karakter.'),
  body('color')
    .optional()
    .matches(/^#[0-9a-fA-F]{6}$/)
    .withMessage('Warna harus berupa kode hex, contoh #3366FF.'),
];

const updateCategoryValidator = [
  body('name')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Nama kategori harus berisi 2 sampai 60 karakter.'),
  body('description')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Deskripsi kategori maksimal 500 karakter.'),
  body('color')
    .optional()
    .matches(/^#[0-9a-fA-F]{6}$/)
    .withMessage('Warna harus berupa kode hex, contoh #3366FF.'),
];

const idParamValidator = [param('id').isMongoId().withMessage('ID harus berupa ObjectId MongoDB yang valid.')];

module.exports = { createCategoryValidator, updateCategoryValidator, idParamValidator };
