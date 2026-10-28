const bcrypt = require('bcryptjs');
const createAuditedSchema = require('./auditedSchema');
const { config } = require('../config/env');

const userSchema = createAuditedSchema({
  name: {
    type: String,
    required: [true, 'Nama wajib diisi.'],
    trim: true,
    minlength: [2, 'Nama minimal 2 karakter.'],
    maxlength: [100, 'Nama maksimal 100 karakter.'],
  },
  email: {
    type: String,
    required: [true, 'Email wajib diisi.'],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [254, 'Email terlalu panjang.'],
  },
  password: {
    type: String,
    required: [true, 'Password wajib diisi.'],
    minlength: [8, 'Password minimal 8 karakter.'],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true,
  },
});

userSchema.pre('validate', function setSelfAuditFields() {
  if (this.isNew) {
    this.created_by ||= this._id;
    this.updated_by ||= this._id;
  }
});

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, config.bcryptSaltRounds);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = require('mongoose').model('User', userSchema);
