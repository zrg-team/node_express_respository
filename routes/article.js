const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/ArticleController');
const authMiddleware = require('../middlewares/authMiddleware');
router.get('/api/articles/:id', authMiddleware, ArticleController.getArticleDetails);
module.exports = router;
