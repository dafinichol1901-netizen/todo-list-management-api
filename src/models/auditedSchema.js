const mongoose = require('mongoose');

function createAuditedSchema(fields, options = {}) {
  return new mongoose.Schema({
    ...fields,
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    archived: {
      type: Boolean,
      default: false,
      index: true,
    },
  }, {
    ...options,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(_document, result) {
        delete result.__v;
        delete result.password;
        return result;
      },
    },
  });
}

module.exports = createAuditedSchema;
