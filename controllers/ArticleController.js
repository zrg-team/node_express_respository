const BaseRepository = require('../repositories/BaseRepository');
const ArticleRepository = require('../repositories/ArticleRepository');
const Article = require('../models/Article');
const rawRepository = require('../repositories/rawRepository');
const response = require('../utils/response');
const { validationResult } = require('express-validator');
class ArticleController {
    async getArticleDetails(req, res) {
        const { id } = req.params;
        if (isNaN(id)) {
            return res.status(422).json({ message: 'Wrong format.' });
        }
        const article = await ArticleRepository.getArticleById(id);
        if (!article) {
            return res.status(404).json({ message: 'This article is not found' });
        }
        return res.status(200).json({
            status: 200,
            article: {
                id: article.id,
                title: article.title,
                content: article.content,
                author_id: article.created_by,
                created_at: article.created_at
            }
        });
    }
    async updateArticleDetails(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { id } = req.params;
        const { title, content } = req.body;
        const article = await ArticleRepository.getArticleById(id);
        if (!article) {
            return res.status(404).json({ message: 'This article is not found' });
        }
        const updatedArticle = await ArticleRepository.update(id, { title, content });
        if (!updatedArticle) {
            return res.status(500).json({ message: 'Error updating article' });
        }
        return res.status(200).json({status: 200, article: updatedArticle});
    }
    // Other methods remain unchanged
}
module.exports = new ArticleController();
