const userService = require('../services/userService');

async function list(req, res) {
  const data = await userService.listUsers(req.query);
  return res.status(200).json({ success: true, data });
}

async function getById(req, res) {
  const user = await userService.getUserById(req.user, req.params.id);
  return res.status(200).json({ success: true, data: { user } });
}

async function update(req, res) {
  const user = await userService.updateUser(req.user, req.params.id, req.body);
  return res.status(200).json({ success: true, data: { user } });
}

module.exports = { list, getById, update };
