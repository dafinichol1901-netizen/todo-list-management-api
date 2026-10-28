const express = require('express');
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { connectDatabase } = require('../config/database');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      service: 'todo-list-management-api',
      databaseConnected: mongoose.connection.readyState === 1,
      timestamp: new Date().toISOString(),
    },
  });
});

router.get('/ready', asyncHandler(async (req, res) => {
  try {
    await connectDatabase();
  } catch (error) {
    throw new AppError('Database belum siap menerima request.', 503, 'DATABASE_UNAVAILABLE');
  }
  return res.status(200).json({
    success: true,
    data: { status: 'ready', timestamp: new Date().toISOString() },
  });
}));

module.exports = router;
