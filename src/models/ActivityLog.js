const mongoose = require('mongoose');
const createAuditedSchema = require('./auditedSchema');

const todoSnapshotSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'] },
  due_date: { type: Date, default: null },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
}, { _id: false });

const activityLogSchema = createAuditedSchema({
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  action: {
    type: String,
    enum: ['TODO_CREATED', 'TODO_UPDATED', 'TODO_ARCHIVED'],
    required: true,
    index: true,
  },
  entity: {
    type: String,
    enum: ['Todo'],
    default: 'Todo',
    required: true,
  },
  entity_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: () => ({}),
  },
  snapshot: {
    type: todoSnapshotSchema,
    default: null,
  },
});

activityLogSchema.index({ created_at: -1 });
activityLogSchema.index({ actor: 1, created_at: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
