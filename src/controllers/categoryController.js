const categoryService = require('../services/categoryService');

async function list(req, res) {
  const data = await categoryService.listCategories(req.user, req.query);
  return res.status(200).json({ success: true, data });
}

async function create(req, res) {
  const category = await categoryService.createCategory(req.user, req.body);
  return res.status(201).json({ success: true, data: { category } });
}

async function getById(req, res) {
  const category = await categoryService.getCategoryById(req.user, req.params.id);
  return res.status(200).json({ success: true, data: { category } });
}

async function update(req, res) {
  const category = await categoryService.updateCategory(req.user, req.params.id, req.body);
  return res.status(200).json({ success: true, data: { category } });
}

async function archive(req, res) {
  const category = await categoryService.archiveCategory(req.user, req.params.id);
  return res.status(200).json({ 
    success: true, 
    data: { category, 
      message: 'Kategori berhasil diarsipkan.' } 
    });
}

module.exports = { list, create, getById, update, archive };
