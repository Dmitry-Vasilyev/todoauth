const todoService = require("../services/todoService");

class TodoController {

    async getTodos(req, res, next) {
        try {
            const todos = await todoService.getAllTodos();
            res.send(todos);
        } catch (e) {
            console.log(e);
        }
    }

    async getTodoById(req, res, next) {
        try {
            const todo = await todoService.getTodoById(req.params.id);
            if(!todo) {
                return res.status(404).send({error: "Todo not found"});
            }

            return res.send(todo);
        } catch (e) {
            console.log(e);
        }
    }

    async createTodo(req, res, next) {
        try {
            if(!req.body) {
                return res.status(400).send({message: 'POST body is required'});
            }

            const {title, text} = req.body;
            await todoService.createTodo(title, text);

            return res.status(201).send({message: 'Todo created successfully'});

        } catch (e) {
            console.log(e);
        }
    }

    async delTodo(req, res, next) {
        try {
            const todo = await todoService.deleteTodo(req.params.id);
            if(!todo) {
                return res.status(404).send({error: "Todo not found and cant delete todo"});
            }

            return res.send({message: 'Todo deleted successfully'});

        } catch (e) {
            console.log(e);
        }
    }

}

module.exports = new TodoController();