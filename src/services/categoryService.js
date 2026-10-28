const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const { getListOptions, getPaginationMeta, escapeRegex } = require('../utils/listQuery');

function getOwnerFilter(user) {
  return user.role === 'admin' ? {} : { user: user._id };
}

async function listCategories(user, query) {
  const filter = { archived: false, ...getOwnerFilter(user) };
  if (query.search) {
    const search = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [{ name: search }, { description: search }];
  }

  const options = getListOptions(query, ['name', 'created_at', 'updated_at'], 'name');
  const [items, totalItems] = await Promise.all([
    Category.find(filter)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit),
    Category.countDocuments(filter),
  ]);

  return { items, pagination: getPaginationMeta(options.page, options.limit, totalItems) };
}

async function createCategory(user, data) {
  return Category.create({
    name: data.name,
    description: data.description || '',
    color: data.color || '#3366FF',
    user: user._id,
    created_by: user._id,
    updated_by: user._id,
  });
}

async function getCategoryById(user, id) {
  const category = await Category.findOne({ _id: id, archived: false, ...getOwnerFilter(user) });
  if (!category) throw new AppError('Kategori tidak ditemukan.', 404, 'CATEGORY_NOT_FOUND');
  return category;
}

async function updateCategory(user, id, data) {
  const category = await getCategoryById(user, id);
  for (const field of ['name', 'description', 'color']) {
    if (Object.hasOwn(data, field)) category[field] = data[field];
  }
  category.updated_by = user._id;
  await category.save();
  return category;
}

async function archiveCategory(user, id) {
  const category = await getCategoryById(user, id);
  category.archived = true;
  category.updated_by = user._id;
  await category.save();
  return category;
}

module.exports = { listCategories, createCategory, getCategoryById, updateCategory, archiveCategory };
