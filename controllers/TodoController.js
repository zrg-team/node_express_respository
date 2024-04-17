// controllers/TodoController.js
const TodoRepository = require('../repositories/TodoRepository');
const response = require('../utils/response');

const TodoController = () => {
  const create = async (req, res, next) => {
    try {
      const todo = await TodoRepository.create(req.body);
      return response(res).success(todo);
    } catch (err) {
      next(err);
    }
  };

  return {
    create,
  };
};

module.exports = TodoController();
