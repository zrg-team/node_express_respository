const BaseRepository = require('../repositories/BaseRepository');
const ArticleRepository = require('../repositories/ArticleRepository');
const Article = require('../models/Article');
const rawRepository = require('../repositories/rawRepository');
const response = require('../utils/response');
class ArticleController {
    async getArticleDetails(req, res) {
        const { id } = req.params;
        const article = await ArticleRepository.getArticleById(id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        return res.json({
            id: article.id,
            title: article.title,
            content: article.content,
            created_by: article.created_by
        });
    }
    async getArticlesList(req, res, next) {
        const { page = 0, sort_by = 'created_at DESC', filter_by } = req.query;
        const query = `SELECT * FROM articles ${filter_by ? `WHERE ${filter_by}` : ''} ${sort_by ? `ORDER BY ${sort_by}` : ''} LIMIT ${page * 10}, 10`;
        const articles = await rawRepository.select(query);
        const totalItems = await rawRepository.select(`SELECT COUNT(*) as total FROM articles ${filter_by ? `WHERE ${filter_by}` : ''}`);
        const totalPages = Math.ceil(totalItems[0].total / 10);
        return response.success(res, { articles, totalItems: totalItems[0].total, totalPages });
    }
    async deleteArticle(req, res) {
        const { id } = req.params;
        const article = await BaseRepository.findById(Article, id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        await BaseRepository.delete(Article, id);
        return res.status(200).json({ message: 'Article deleted successfully' });
    }
}
module.exports = new ArticleController();
