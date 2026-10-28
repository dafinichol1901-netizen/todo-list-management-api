const { body } = require('express-validator');

const registerValidator = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nama harus berisi 2 sampai 100 karakter.'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email harus valid.')
    .normalizeEmail(),
  body('password')
    .isString()
    .isLength({ min: 8, max: 72 })
    .custom((value) => Buffer.byteLength(value, 'utf8') <= 72)
    .withMessage('Password harus berisi 8 sampai 72 karakter.'),
];

const loginValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email harus valid.')
    .normalizeEmail(),
  body('password')
    .isString()
    .notEmpty()
    .withMessage('Password wajib diisi.'),
];

module.exports = { registerValidator, loginValidator };
