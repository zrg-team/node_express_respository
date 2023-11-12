const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/ArticleController');
const authMiddleware = require('../middlewares/authMiddleware');
// Existing GET route
router.get('/api/articles/:id', authMiddleware, ArticleController.getArticleDetails);
// New DELETE route
router.delete('/:id', authMiddleware, ArticleController.deleteArticle);
// New PUT route
router.put('/:id', authMiddleware, ArticleController.updateArticleDetails);
module.exports = router;
