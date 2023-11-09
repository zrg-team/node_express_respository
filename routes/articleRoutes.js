const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/ArticleController');
router.get('/api/articles/:id', ArticleController.getArticleDetails);
module.exports = router;
