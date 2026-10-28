const authService = require('../services/authService');

async function register(req, res) {
  const data = await authService.register(req.body);
  return res.status(201).json({ success: true, data });
}

async function login(req, res) {
  const data = await authService.login(req.body);
  return res.status(200).json({ success: true, data });
}

async function me(req, res) {
  return res.status(200).json({ success: true, data: { user: req.user } });
}

module.exports = { register, login, me };
