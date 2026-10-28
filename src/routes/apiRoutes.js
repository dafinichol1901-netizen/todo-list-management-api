const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const todoRoutes = require('./todoRoutes');
const activityRoutes = require('./activityRoutes');
const publicRoutes = require('./publicRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/todos', todoRoutes);
router.use('/activity-logs', activityRoutes);
router.use('/public', publicRoutes);
router.use('/users', userRoutes);

module.exports = router;
