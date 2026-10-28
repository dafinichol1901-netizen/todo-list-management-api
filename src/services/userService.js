const User = require('../models/User');
const AppError = require('../utils/AppError');
const { getListOptions, getPaginationMeta, escapeRegex } = require('../utils/listQuery');

async function listUsers(query) {
  const filter = { archived: false };
  if (query.search) {
    const search = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [{ name: search }, { email: search }];
  }
  if (query.role) filter.role = query.role;

  const options = getListOptions(query, ['name', 'email', 'role', 'created_at'], 'created_at');
  const [items, totalItems] = await Promise.all([
    User.find(filter).sort(options.sort).skip(options.skip).limit(options.limit),
    User.countDocuments(filter),
  ]);

  return { items, pagination: getPaginationMeta(options.page, options.limit, totalItems) };
}

async function getUserById(actor, id) {
  if (actor.role !== 'admin' && String(actor._id) !== id) {
    throw new AppError('Kamu hanya dapat mengakses profil sendiri.', 403, 'FORBIDDEN');
  }

  const user = await User.findOne({ _id: id, archived: false });
  if (!user) throw new AppError('User tidak ditemukan.', 404, 'USER_NOT_FOUND');
  return user;
}

async function updateUser(actor, id, data) {
  const user = await getUserById(actor, id);
  if (Object.hasOwn(data, 'role') && actor.role !== 'admin') {
    throw new AppError('Hanya admin yang dapat mengubah role user.', 403, 'FORBIDDEN');
  }

  for (const field of ['name', 'email', 'role']) {
    if (Object.hasOwn(data, field)) user[field] = data[field];
  }
  user.updated_by = actor._id;
  await user.save();
  return user;
}

module.exports = { listUsers, getUserById, updateUser };
