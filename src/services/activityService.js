const ActivityLog = require('../models/ActivityLog');
const Todo = require('../models/Todo');
const Category = require('../models/Category');
const User = require('../models/User');
const { getListOptions, getPaginationMeta } = require('../utils/listQuery');

function getOwnerFilter(user) {
  return user.role === 'admin' ? {} : { actor: user._id };
}

async function listActivityLogs(user, query) {
  const filter = { archived: false, ...getOwnerFilter(user) };
  if (query.action) filter.action = query.action;

  const options = getListOptions(query, ['created_at', 'action'], 'created_at');
  const [items, totalItems] = await Promise.all([
    ActivityLog.find(filter)
      .populate('actor', 'name email')
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit),
    ActivityLog.countDocuments(filter),
  ]);

  return { items, pagination: getPaginationMeta(options.page, options.limit, totalItems) };
}

async function getPublicStats() {
  const [totalTodos, completedTodos, totalCategories, totalUsers, totalActivities] = await Promise.all([
    Todo.countDocuments({ archived: false }),
    Todo.countDocuments({ archived: false, completed: true }),
    Category.countDocuments({ archived: false }),
    User.countDocuments({ archived: false }),
    ActivityLog.countDocuments({ archived: false }),
  ]);

  return {
    users: { total: totalUsers },
    todos: {
      total: totalTodos,
      completed: completedTodos,
      pending: totalTodos - completedTodos,
    },
    categories: { total: totalCategories },
    activities: { total: totalActivities },
    generatedAt: new Date().toISOString(),
  };
}

async function listPublicActivityLogs(query) {
  const page = Number(query.page) || 1;
  const limit = Math.min(Number(query.limit) || 20, 100);
  const filter = { archived: false };
  if (query.action) filter.action = query.action;
  if (query.after) filter.created_at = { $gte: new Date(query.after) };

  const options = getListOptions({ ...query, page, limit }, ['created_at'], 'created_at');
  const [items, totalItems] = await Promise.all([
    ActivityLog.find(filter)
      .sort({ created_at: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .select('action entity created_at'),
    ActivityLog.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => ({
      action: item.action,
      entity: item.entity,
      occurredAt: item.created_at,
    })),
    pagination: getPaginationMeta(options.page, options.limit, totalItems),
  };
}

module.exports = { listActivityLogs, getPublicStats, listPublicActivityLogs };
