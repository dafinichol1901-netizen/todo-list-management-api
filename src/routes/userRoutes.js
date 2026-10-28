const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validateAllowedFields = require('../middleware/validateAllowedFields');
const validateRequest = require('../validators/validateRequest');
const { 
  userIdValidator, 
  userListValidators, 
  updateUserValidators 
} = require('../validators/userValidators');

const router = express.Router();

router.use(authenticate);
router.get(
  '/', authorize('admin'), 
  userListValidators, 
  validateRequest, 
  userController.list
);
router.get(
  '/:id', 
  userIdValidator, 
  validateRequest, 
  userController.getById
);
router.patch(
  '/:id',
  userIdValidator,
  validateAllowedFields([
    'name', 
    'email', 
    'role'
  ], 
  { requireAtLeastOne: true }),
  updateUserValidators,
  validateRequest,
  userController.update,
);

module.exports = router;
