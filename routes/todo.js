const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/TodoController');
router.post('/', TodoController.create);
module.exports = router;