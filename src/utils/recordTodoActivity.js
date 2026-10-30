const ActivityLog = require('../models/ActivityLog');

async function recordTodoActivity({ actorId, todoId, action, todo, changedFields = [] }) {
  return ActivityLog.create({
    actor: actorId,
    action,
    entity: 'Todo',
    entity_id: todoId,
    metadata: { changed_fields: changedFields },
    snapshot: {
      title: todo.title,
      description: todo.description || '',
      completed: todo.completed,
      priority: todo.priority,
      due_date: todo.due_date || null,
      category: todo.category || null,
    },
    created_by: actorId,
    updated_by: actorId,
  });
}

module.exports = recordTodoActivity;
