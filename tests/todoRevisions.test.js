jest.mock('../src/models/Category', () => ({ findOne: jest.fn() }));
jest.mock('../src/models/Todo', () => ({
  countDocuments: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
}));
jest.mock('../src/models/ActivityLog', () => ({ create: jest.fn() }));

const { validationResult } = require('express-validator');
const Category = require('../src/models/Category');
const Todo = require('../src/models/Todo');
const ActivityLog = require('../src/models/ActivityLog');
const { createTodoValidator, updateTodoValidator } = require('../src/validators/todoValidators');
const todoService = require('../src/services/todoService');

async function validateBody(validators, body) {
  const req = { body, params: {}, query: {} };
  await Promise.all(validators.map((validator) => validator.run(req)));
  return validationResult(req).array();
}

describe('optional todo categories and activity snapshots', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creation accepts an omitted or null category while still validating provided IDs', async () => {
    expect(await validateBody(createTodoValidator, { title: 'Uncategorized task' })).toEqual([]);
    expect(await validateBody(createTodoValidator, { title: 'Uncategorized task', category: null })).toEqual([]);
    expect(await validateBody(createTodoValidator, { title: 'Task', category: 'not-an-object-id' }))
      .toEqual(expect.arrayContaining([
        expect.objectContaining({ path: 'category' }),
      ]));
  });

  test('update accepts null to remove an existing category', async () => {
    expect(await validateBody(updateTodoValidator, { category: null })).toEqual([]);
  });

  test('creates a todo without looking up a category and stores its snapshot', async () => {
    const todo = {
      _id: 'todo-id',
      title: 'Uncategorized task',
      description: '',
      completed: false,
      priority: 'medium',
      due_date: null,
      category: null,
      populate: jest.fn().mockResolvedValue(undefined),
    };
    Todo.create.mockResolvedValue(todo);
    todo.populate.mockResolvedValue(todo);

    await todoService.createTodo(
      { _id: 'user-id', role: 'user' },
      { title: 'Uncategorized task' },
    );

    expect(Category.findOne).not.toHaveBeenCalled();
    expect(Todo.create).toHaveBeenCalledWith(expect.objectContaining({ category: null }));
    expect(ActivityLog.create).toHaveBeenCalledWith(expect.objectContaining({
      action: 'TODO_CREATED',
      snapshot: expect.objectContaining({ title: 'Uncategorized task', category: null }),
    }));
  });

  test('removing a category stores null in the updated snapshot', async () => {
    const todo = {
      _id: 'todo-id',
      user: 'user-id',
      title: 'Updated task',
      description: '',
      completed: false,
      priority: 'medium',
      due_date: null,
      category: 'old-category-id',
      archived: false,
      save: jest.fn().mockResolvedValue(undefined),
      populate: jest.fn().mockResolvedValue(undefined),
    };
    Todo.findOne.mockResolvedValue(todo);
    todo.populate.mockResolvedValue(todo);

    await todoService.updateTodo(
      { _id: 'user-id', role: 'user' },
      'todo-id',
      { category: null },
    );

    expect(Category.findOne).not.toHaveBeenCalled();
    expect(todo.category).toBeNull();
    expect(ActivityLog.create).toHaveBeenCalledWith(expect.objectContaining({
      action: 'TODO_UPDATED',
      snapshot: expect.objectContaining({ title: 'Updated task', category: null }),
    }));
  });

  test('archive activity preserves the todo snapshot', async () => {
    const todo = {
      _id: 'todo-id',
      user: 'user-id',
      title: 'Archived task',
      description: 'Keep its context',
      completed: true,
      priority: 'high',
      due_date: null,
      category: null,
      archived: false,
      save: jest.fn().mockResolvedValue(undefined),
    };
    Todo.findOne.mockResolvedValue(todo);

    await todoService.archiveTodo({ _id: 'user-id', role: 'user' }, 'todo-id');

    expect(ActivityLog.create).toHaveBeenCalledWith(expect.objectContaining({
      action: 'TODO_ARCHIVED',
      snapshot: expect.objectContaining({
        title: 'Archived task',
        description: 'Keep its context',
        completed: true,
        priority: 'high',
      }),
    }));
  });
});
