const Router = require('express').Router;
const todoController = require('../controllers/todoController');
const authMiddleware = require("../middlewares/authMiddleware");

const todoRouter = new Router;

todoRouter.get('/', todoController.getTodos);
todoRouter.get('/:id', authMiddleware, todoController.getTodoById);
todoRouter.post('/', authMiddleware, todoController.createTodo);
todoRouter.delete('/:id', authMiddleware, todoController.delTodo);


module.exports = todoRouter;
