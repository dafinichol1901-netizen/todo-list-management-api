const mongoose = require('mongoose');
const createAuditedSchema = require('./auditedSchema');

const categorySchema = createAuditedSchema({
  name: {
    type: String,
    required: [true, 'Nama kategori wajib diisi.'],
    trim: true,
    lowercase: true,
    minlength: [2, 'Nama kategori minimal 2 karakter.'],
    maxlength: [60, 'Nama kategori maksimal 60 karakter.'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Deskripsi kategori maksimal 500 karakter.'],
    default: '',
  },
  color: {
    type: String,
    trim: true,
    match: [/^#[0-9a-fA-F]{6}$/, 'Warna harus berupa kode hex, contoh #3366FF.'],
    default: '#3366FF',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
});

categorySchema.index(
  { user: 1, name: 1 },
  {
    unique: true,
    partialFilterExpression: { archived: false },
    name: 'unique_active_category_name_per_user',
  },
);

module.exports = mongoose.model('Category', categorySchema);
