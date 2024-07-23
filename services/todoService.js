const TodoModel = require("../models/todoModel");

class TodoService {

    async createTodo(title, text) {
        const todo = new TodoModel({title, text});

        return await todo.save();
    }

    async getAllTodos() {
        const todos = await TodoModel.find({});

        return todos;
    }

    async getTodoById(id) {
        const todo = await TodoModel.findById(id);
        return todo;
    }

    async deleteTodo(id) {
        const todo = await TodoModel.findByIdAndDelete(id);
        return todo;
    }
}

module.exports = new TodoService();