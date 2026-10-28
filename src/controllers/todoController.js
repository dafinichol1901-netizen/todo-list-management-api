const todoService = require('../services/todoService');

async function list(req, res) {
  const data = await todoService.listTodos(req.user, req.query);
  return res.status(200).json({ success: true, data });
}

async function create(req, res) {
  const todo = await todoService.createTodo(req.user, req.body);
  return res.status(201).json({ success: true, data: { todo } });
}

async function getById(req, res) {
  const todo = await todoService.getTodoById(req.user, req.params.id);
  return res.status(200).json({ success: true, data: { todo } });
}

async function update(req, res) {
  const todo = await todoService.updateTodo(req.user, req.params.id, req.body);
  return res.status(200).json({ success: true, data: { todo } });
}

async function archive(req, res) {
  const todo = await todoService.archiveTodo(req.user, req.params.id);
  return res.status(200).json({ 
    success: true, 
    data: { todo, 
      message: 'Todo berhasil diarsipkan.' } 
    });
}

module.exports = { list, create, getById, update, archive };
