const Category = require('../models/Category');
const Todo = require('../models/Todo');
const AppError = require('../utils/AppError');
const recordTodoActivity = require('../utils/recordTodoActivity');
const { getListOptions, getPaginationMeta, escapeRegex } = require('../utils/listQuery');

function getOwnerFilter(user) {
  return user.role === 'admin' ? {} : { user: user._id };
}

async function assertCategoryBelongsToUser(categoryId, userId) {
  const category = await Category.findOne({ 
    _id: categoryId, 
    user: userId, 
    archived: false 
  });
  if (!category) {
    throw new AppError(
      'Kategori tidak ditemukan atau bukan milik akun ini.', 
      404, 
      'CATEGORY_NOT_FOUND'
    );
  }
  return category;
}

async function listTodos(user, query) {
  const filter = { archived: false, ...getOwnerFilter(user) };

  if (query.completed !== undefined) filter.completed = query.completed;
  if (query.category) filter.category = query.category;
  if (query.search) {
    const search = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [{ title: search }, { description: search }];
  }

  const options = getListOptions(
    query,
    [
      'title', 
      'priority', 
      'due_date', 
      'completed', 
      'created_at', 
      'updated_at'
    ],
    'created_at',
  );
  const [items, totalItems] = await Promise.all([
    Todo.find(filter)
      .populate('category', 'name description color archived')
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit),
    Todo.countDocuments(filter),
  ]);

  return { 
    items, 
    pagination: getPaginationMeta
    (options.page, 
      options.limit, 
      totalItems) 
    };
}

async function createTodo(user, data) {
  const category = data.category
    ? await assertCategoryBelongsToUser(data.category, user._id)
    : null;
  const todo = await Todo.create({
    title: data.title,
    description: data.description || '',
    completed: data.completed ?? false,
    priority: data.priority || 'medium',
    due_date: data.due_date || null,
    user: user._id,
    category: category?._id || null,
    created_by: user._id,
    updated_by: user._id,
  });

  await recordTodoActivity({
    actorId: user._id,
    todoId: todo._id,
    action: 'TODO_CREATED',
    todo,
    changedFields: [
      'title', 
      'description', 
      'completed', 
      'priority', 
      'due_date', 
      'category'
    ],
  });

  return todo.populate('category', 'name description color archived');
}

async function getTodoById(user, id) {
  const todo = await Todo.findOne({ 
    _id: id, 
    archived: false, ...getOwnerFilter(user) 
  })
    .populate('category', 'name description color archived');

  if (!todo) throw new AppError(
    'Todo tidak ditemukan.', 
    404, 
    'TODO_NOT_FOUND'
  );
  return todo;
}

async function updateTodo(user, id, data) {
  const todo = await Todo.findOne({ 
    _id: id, 
    archived: false, ...getOwnerFilter(user) 
  });
  if (!todo) throw new AppError(
    'Todo tidak ditemukan.', 
    404, 
    'TODO_NOT_FOUND'
  );

  if (Object.hasOwn(data, 'category')) {
    if (data.category) {
      const category = await assertCategoryBelongsToUser(data.category, todo.user);
      todo.category = category._id;
    } else {
      todo.category = null;
    }
  }

  const changedFields = [];
  for (const field of [
    'title', 
    'description', 
    'completed', 
    'priority', 
    'due_date'
  ]) 
  {
    if (Object.hasOwn(data, field)) {
      todo[field] = data[field];
      changedFields.push(field);
    }
  }
  if (Object.hasOwn(data, 'category')) changedFields.push('category');

  todo.updated_by = user._id;
  await todo.save();
  await recordTodoActivity({
    actorId: user._id,
    todoId: todo._id,
    action: 'TODO_UPDATED',
    todo,
    changedFields,
  });

  return todo.populate('category', 'name description color archived');
}

async function archiveTodo(user, id) {
  const todo = await Todo.findOne({ 
    _id: id, 
    archived: false, ...getOwnerFilter(user) 
  });
  if (!todo) throw new AppError(
    'Todo tidak ditemukan.', 
    404, 
    'TODO_NOT_FOUND'
  );

  todo.archived = true;
  todo.updated_by = user._id;
  await todo.save();
  await recordTodoActivity({
    actorId: user._id,
    todoId: todo._id,
    action: 'TODO_ARCHIVED',
    todo,
    changedFields: ['archived'],
  });

  return todo;
}

module.exports = { listTodos, createTodo, getTodoById, updateTodo, archiveTodo };
