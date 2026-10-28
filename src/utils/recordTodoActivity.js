const ActivityLog = require('../models/ActivityLog');

async function recordTodoActivity({ actorId, todoId, action, changedFields = [] }) {
  return ActivityLog.create({
    actor: actorId,
    action,
    entity: 'Todo',
    entity_id: todoId,
    metadata: { changed_fields: changedFields },
    created_by: actorId,
    updated_by: actorId,
  });
}

module.exports = recordTodoActivity;
