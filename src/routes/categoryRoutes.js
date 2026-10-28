const express = require('express');
const categoryController = require('../controllers/categoryController');
const authenticate = require('../middleware/authenticate');
const validateAllowedFields = require('../middleware/validateAllowedFields');
const validateRequest = require('../validators/validateRequest');
const { paginationValidators } = require('../validators/listValidators');
const {
  createCategoryValidator,
  updateCategoryValidator,
  idParamValidator,
} = require('../validators/categoryValidators');

const router = express.Router();

router.use(authenticate);
router.get('/', paginationValidators([
  'name', 
  'created_at', 
  'updated_at'
]), 
validateRequest, 
categoryController.list
);
router.post('/', validateAllowedFields([
  'name', 
  'description', 
  'color'
]), 
createCategoryValidator, 
validateRequest, 
categoryController.create
);
router.get('/:id', idParamValidator, validateRequest, categoryController.getById);
router.patch(
  '/:id',
  idParamValidator,
  validateAllowedFields(['name', 'description', 'color'], { requireAtLeastOne: true }),
  updateCategoryValidator,
  validateRequest,
  categoryController.update,
);
router.delete('/:id', idParamValidator, validateRequest, categoryController.archive);

module.exports = router;
