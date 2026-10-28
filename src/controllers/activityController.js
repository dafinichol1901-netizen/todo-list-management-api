const activityService = require('../services/activityService');

async function list(req, res) {
  const data = await activityService.listActivityLogs(req.user, req.query);
  return res.status(200).json({ success: true, data });
}

async function publicStats(req, res) {
  const stats = await activityService.getPublicStats();
  return res.status(200).json({ success: true, data: { stats } });
}

async function publicLogs(req, res) {
  const data = await activityService.listPublicActivityLogs(req.query);
  return res.status(200).json({ success: true, data });
}

module.exports = { list, publicStats, publicLogs };
