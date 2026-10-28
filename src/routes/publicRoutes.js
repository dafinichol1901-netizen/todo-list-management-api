const express = require('express');
const activityController = require('../controllers/activityController');
const requireApiKey = require('../middleware/requireApiKey');
const connectDatabase = require('../middleware/connectDatabase');
const { publicApiLimiter } = require('../middleware/rateLimiters');
const validateRequest = require('../validators/validateRequest');
const { publicActivityValidators } = require('../validators/activityValidators');

const router = express.Router();

router.get('/stats', publicApiLimiter, requireApiKey, connectDatabase, activityController.publicStats);
router.get(
  '/activity-logs',
  publicApiLimiter,
  requireApiKey,
  publicActivityValidators,
  validateRequest,
  connectDatabase,
  activityController.publicLogs,
);

module.exports = router;
