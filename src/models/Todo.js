const mongoose = require('mongoose');
const createAuditedSchema = require('./auditedSchema');

const todoSchema = createAuditedSchema({
  title: {
    type: String,
    required: [true, 'Judul todo wajib diisi.'],
    trim: true,
    minlength: [1, 'Judul todo tidak boleh kosong.'],
    maxlength: [120, 'Judul todo maksimal 120 karakter.'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Deskripsi todo maksimal 2000 karakter.'],
    default: '',
  },
  completed: {
    type: Boolean,
    default: false,
    index: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
    index: true,
  },
  due_date: {
    type: Date,
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    index: true,
    default: null,
  },
});

todoSchema.index({ user: 1, archived: 1, completed: 1, created_at: -1 });
todoSchema.index({ user: 1, archived: 1, due_date: 1 });

module.exports = mongoose.model('Todo', todoSchema);
