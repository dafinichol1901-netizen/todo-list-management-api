const express = require('express');
const activityController = require('../controllers/activityController');
const authenticate = require('../middleware/authenticate');
const validateRequest = require('../validators/validateRequest');
const { activityListValidators } = require('../validators/activityValidators');

const router = express.Router();

router.get('/', authenticate, activityListValidators, validateRequest, activityController.list);

module.exports = router;
