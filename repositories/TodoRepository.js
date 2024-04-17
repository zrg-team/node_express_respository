const { Todo } = require('../models');
class TodoRepository {
  async create(todoData) {
    return Todo.create(todoData);
  }
}
module.exports = new TodoRepository();