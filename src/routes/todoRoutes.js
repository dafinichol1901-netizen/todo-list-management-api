const express = require('express');
const todoController = require('../controllers/todoController');
const authenticate = require('../middleware/authenticate');
const validateAllowedFields = require('../middleware/validateAllowedFields');
const validateRequest = require('../validators/validateRequest');
const { paginationValidators } = require('../validators/listValidators');
const {
  createTodoValidator,
  updateTodoValidator,
  listTodoValidators,
  idParamValidator,
} = require('../validators/todoValidators');

const router = express.Router();

router.use(authenticate);
router.get(
  '/',
  paginationValidators([
    'title', 
    'priority', 
    'due_date', 
    'completed', 
    'created_at', 
    'updated_at'
  ]),
  listTodoValidators,
  validateRequest,
  todoController.list,
);
router.post(
  '/',
  validateAllowedFields(['title', 'description', 'completed', 'priority', 'due_date', 'category']),
  createTodoValidator,
  validateRequest,
  todoController.create,
);
router.get('/:id', idParamValidator, validateRequest, todoController.getById);
router.patch(
  '/:id',
  idParamValidator,
  validateAllowedFields(
    ['title', 'description', 'completed', 'priority', 'due_date', 'category'],
    { requireAtLeastOne: true },
  ),
  updateTodoValidator,
  validateRequest,
  todoController.update,
);
router.delete('/:id', idParamValidator, validateRequest, todoController.archive);

module.exports = router;
