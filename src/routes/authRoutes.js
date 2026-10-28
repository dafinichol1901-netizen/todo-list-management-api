const express = require('express');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const validateAllowedFields = require('../middleware/validateAllowedFields');
const connectDatabase = require('../middleware/connectDatabase');
const { authLimiter } = require('../middleware/rateLimiters');
const validateRequest = require('../validators/validateRequest');
const { registerValidator, loginValidator } = require('../validators/authValidators');

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  validateAllowedFields(['name', 'email', 'password']),
  registerValidator,
  validateRequest,
  connectDatabase,
  authController.register,
);
router.post(
  '/login',
  authLimiter,
  validateAllowedFields(['email', 'password']),
  loginValidator,
  validateRequest,
  connectDatabase,
  authController.login,
);
router.get('/me', authenticate, authController.me);

module.exports = router;
