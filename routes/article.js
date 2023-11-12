const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/ArticleController');
const authMiddleware = require('../middlewares/authMiddleware');
// Other routes...
// Add the new DELETE route
router.delete('/:id', authMiddleware, ArticleController.deleteArticle);
module.exports = router;
